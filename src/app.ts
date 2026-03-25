import fastify from "fastify";
import multipart from "@fastify/multipart";
import { seniorTestRoutes } from "./http/controllers/routes.ts";
import { env } from "../env/index.ts";

const app = fastify();

app.register(multipart);
app.register(seniorTestRoutes);

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== "production") {
    console.error(error instanceof Error ? error.message : error);
  }
  reply.status(500).send({ error: "Internal Server Error" });
});

export { app };
