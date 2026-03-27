import { describe, beforeEach, it, expect } from "vitest";
import { AnalyzeInventoryUseCase } from "./analyze-inventory-use-case.ts";
import {
  CsvInventoryParserService,
  type CsvInventoryParser,
} from "../services/csv-inventory-parser-service.ts";
import { mockCsvStream } from "../test/utils/mock-csv-stream.ts";

let csvParserService: CsvInventoryParser;
let sut: AnalyzeInventoryUseCase;

describe("AnalyzeInventoryUseCase", () => {
  beforeEach(() => {
    csvParserService = new CsvInventoryParserService();
    sut = new AnalyzeInventoryUseCase(csvParserService);
  });

  it("should analyze inventory and return stock, low stock and anomalies", async () => {
    const fileStream = mockCsvStream();

    const response = await sut.execute({ fileStream });

    expect(response).toHaveProperty("stock");
    expect(response).toHaveProperty("low_stock");
    expect(response).toHaveProperty("anomalies");
  });

  it("should identify low stock items", async () => {
    const lowStockCsvContent = `1710000001,A1,Widget,in,100\n1710000002,A1,Widget,out,95`;

    const fileStream = mockCsvStream(lowStockCsvContent);

    const response = await sut.execute({ fileStream });
    expect(response.low_stock.length).toBeGreaterThan(0);
  });

  it("should identifies anomalies in the inventory", async () => {
    const anomalousCsvContent = `1710000001,A1,Widget,in,100\n1710000002,A1,Widget,out,150`;

    const fileStream = mockCsvStream(anomalousCsvContent);

    const response = await sut.execute({ fileStream });
    expect(response.anomalies.length).toBeGreaterThan(0);
  });

  it("should ignore invalid rows", async () => {
    const contentWithInvalidRows = `1710000001,A1,Widget,in,100\n1710000002,A2,Widget,in,95\nInvalid,,Row,,`;
    const fileStream = mockCsvStream(contentWithInvalidRows);

    const response = await sut.execute({ fileStream });
    expect(response.stock.length).toBe(2);
  });
});
