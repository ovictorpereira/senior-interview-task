import { type FastifyInstance } from "fastify";
import { analyzeInventory } from "./analyze-inventory.ts";

export async function seniorTestRoutes(app: FastifyInstance) {
  app.post("/analyze-inventory", analyzeInventory);
}
