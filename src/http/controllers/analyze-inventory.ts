import type { FastifyRequest, FastifyReply } from "fastify";
import { AnalyzeInventoryUseCase } from "../../use-cases/analyze-inventory-use-case.ts";

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
  const useCase = new AnalyzeInventoryUseCase();
  await useCase.execute({ fileStream });
}
