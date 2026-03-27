import { Readable } from "node:stream";
import type {
  CsvInventoryParser,
  InventoryRecord,
} from "../services/csv-inventory-parser-service.ts";

const LOW_STOCK_THRESHOLD = 10;

interface AnalyzeInventoryRequest {
  fileStream: Readable;
}

interface StockItem {
  product_id: string;
  product_name: string;
  quantity: number;
}

interface AnomalyResponse {
  product_id: string;
  product_name: string;
  message: string;
}

interface AnalyzeInventoryResponse {
  stock: StockItem[];
  low_stock: StockItem[];
  anomalies: AnomalyResponse[];
}

export class AnalyzeInventoryUseCase {
  private csvParser: CsvInventoryParser;
  constructor(csvParser: CsvInventoryParser) {
    this.csvParser = csvParser;
  }

  async execute(
    request: AnalyzeInventoryRequest,
  ): Promise<AnalyzeInventoryResponse> {
    const { fileStream } = request;

    const { records, csvErrors } = await this.csvParser.parse(fileStream);

    const stock = this.buildStock(records);

    console.log("csv row errors: ", csvErrors);

    return {
      stock,
      low_stock: this.filterLowStock(stock),
      anomalies: this.filterAnomalies(stock),
    };
  }

  private buildStock(records: InventoryRecord[]): StockItem[] {
    const result: StockItem[] = [];

    records.forEach((record) => {
      const existing = result.find((i) => i.product_id === record.product_id);
      if (!existing) {
        result.push({
          product_id: record.product_id,
          product_name: record.product_name,
          quantity: record.quantity,
        });
      } else {
        record.type === "in"
          ? (existing.quantity += record.quantity)
          : (existing.quantity -= record.quantity);
      }
    });

    return result;
  }

  private filterLowStock(stock: StockItem[]): StockItem[] {
    return stock.filter((i) => i.quantity < LOW_STOCK_THRESHOLD);
  }

  private filterAnomalies(stock: StockItem[]): AnomalyResponse[] {
    return stock
      .filter((i) => i.quantity < 0)
      .map((i) => ({
        product_id: i.product_id,
        product_name: i.product_name,
        message: "Stock went negative",
      }));
  }
}
