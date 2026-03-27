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

    const { records } = await this.csvParser.parse(fileStream);

    const sortedRecords = [...records].sort(
      (a, b) => Number(a.timestamp) - Number(b.timestamp),
    );

    const { stock, anomalies } = this.buildStock(sortedRecords);

    return {
      stock,
      low_stock: this.filterLowStock(stock),
      anomalies: anomalies,
    };
  }

  private buildStock(records: InventoryRecord[]): {
    stock: StockItem[];
    anomalies: AnomalyResponse[];
  } {
    const stock: StockItem[] = [];
    const anomalies: AnomalyResponse[] = [];

    records.forEach((record) => {
      const existing = stock.find((i) => i.product_id === record.product_id);

      if (!existing) {
        const entry: StockItem = {
          product_id: record.product_id,
          product_name: record.product_name,
          quantity: record.quantity,
        };

        stock.push(entry);

        if (record.quantity < 0) {
          anomalies.push({
            product_id: entry.product_id,
            product_name: entry.product_name,
            message: "Stock went negative",
          });
        }
      } else {
        existing.quantity += record.quantity;

        if (
          existing.quantity < 0 &&
          !anomalies.find((a) => a.product_id === existing.product_id)
        ) {
          anomalies.push({
            product_id: existing.product_id,
            product_name: existing.product_name,
            message: "Stock went negative",
          });
        }
      }
    });

    return { stock, anomalies };
  }

  private filterLowStock(stock: StockItem[]): StockItem[] {
    return stock.filter((i) => i.quantity < LOW_STOCK_THRESHOLD);
  }
}
