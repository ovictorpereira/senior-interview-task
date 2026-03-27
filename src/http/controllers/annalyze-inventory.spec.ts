import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../app.ts";

describe("Analyze Inventory Controller (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should analyze inventory and return correct stock, low stock, and anomalies", async () => {
    const response = await request(app.server)
      .post("/analyze-inventory")
      .attach("file", "src/test/inventory_example.csv");

    const { stock, low_stock, anomalies } = response.body;
    expect(response.status).toBe(200);
    expect(stock).toHaveLength(5);
    expect(low_stock).toHaveLength(2);
    expect(anomalies).toHaveLength(1);
  });
});
