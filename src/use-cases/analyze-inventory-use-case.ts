import { Readable } from "node:stream";
import { parse } from "csv-parse";

interface AnalyzeInventoryRequest {
  fileStream: Readable;
}

// interface AnalyzeInventoryResponse {
//   stock: { product_id: string; product_name: string; quantity: number }[];
//   low_stock: { product_id: string; product_name: string; quantity: number }[];
//   anomalies: { product_id: string; product_name: string; message: string }[];
// }

export class AnalyzeInventoryUseCase {
  async execute(request: AnalyzeInventoryRequest) {
    const { fileStream } = request;

    const parser = fileStream.pipe(parse({ columns: true, trim: true }));

    // const stock: AnalyzeInventoryResponse["stock"] = [];
    // const low_stock: AnalyzeInventoryResponse["low_stock"] = [];
    // const anomalies: AnalyzeInventoryResponse["anomalies"] = [];

    for await (const record of parser) {
      console.log(record);
    }
  }
}
