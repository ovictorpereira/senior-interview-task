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
      message: "File is required",
    });
  }

  const fileStream = data.file;
  const csvService = new CsvInventoryParserService();
  const useCase = new AnalyzeInventoryUseCase(csvService);
  const result = await useCase.execute({ fileStream });

  return reply.code(200).send(result);
}
