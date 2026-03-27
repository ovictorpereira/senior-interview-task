import type { FastifyRequest, FastifyReply } from "fastify";
import { AnalyzeInventoryUseCase } from "../../use-cases/analyze-inventory-use-case.ts";
import { CsvInventoryParserService } from "../../services/csv-inventory-parser-service.ts";

export async function analyzeInventory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await request.file();

  if (!data) {
    return reply.code(400).send({
      message: "CSV File is required",
    });
  }

  const extension = data?.filename.split(".").pop()?.toLowerCase();

  if (extension !== "csv") {
    return reply.code(400).send({
      message: "Only CSV files are allowed",
    });
  }

  const fileStream = data.file;
  const csvService = new CsvInventoryParserService();
  const useCase = new AnalyzeInventoryUseCase(csvService);
  const result = await useCase.execute({ fileStream });

  return reply.code(200).send(result);
}
