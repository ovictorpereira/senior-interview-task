import { Readable } from "node:stream";
import { parse } from "csv-parse";

export type InventoryMovementType = "in" | "out";

export interface RawCsvRecord {
  timestamp?: string;
  product_id?: string;
  product_name?: string;
  type?: string;
  quantity?: number;
}

export interface InventoryRecord {
  timestamp: string;
  product_id: string;
  product_name: string;
  type: InventoryMovementType;
  quantity: number;
}

export interface CSVError {
  record: RawCsvRecord;
  message: string;
}

export const REQUIRED_FIELDS = [
  "timestamp",
  "product_id",
  "product_name",
  "type",
  "quantity",
] as const;

export interface CsvInventoryParser {
  parse(
    fileStream: Readable,
  ): Promise<{ records: InventoryRecord[]; csvErrors: CSVError[] }>;
}

export class CsvInventoryParserService implements CsvInventoryParser {
  async parse(
    fileStream: Readable,
  ): Promise<{ records: InventoryRecord[]; csvErrors: CSVError[] }> {
    const parser = fileStream.pipe(parse({ columns: true, trim: true }));

    const records: InventoryRecord[] = [];
    const csvErrors: CSVError[] = [];

    for await (const item of parser) {
      const record = item as RawCsvRecord;
      try {
        const normalized = this.normalizeRawRecord(record);
        records.push(normalized);
      } catch (error) {
        csvErrors.push({
          record,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return {
      records,
      csvErrors,
    };
  }

  private normalizeRawRecord(record: RawCsvRecord): InventoryRecord {
    const missingFields = REQUIRED_FIELDS.filter((i) => !record[i]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    if (record.type !== "in" && record.type !== "out") {
      throw new Error(`Invalid "type" record: ${record.type}`);
    }

    const quantity = Number(record.quantity);

    if (Number.isNaN(quantity)) {
      throw new Error(`"Quantity" value is not a number: ${quantity}`);
    }

    return {
      timestamp: record.timestamp!,
      product_id: record.product_id!,
      product_name: record.product_name!,
      type: record.type,
      quantity,
    };
  }
}
