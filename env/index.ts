import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  const pretty = z.prettifyError(_env.error);
  console.error("Invalid environment variables", pretty);
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
