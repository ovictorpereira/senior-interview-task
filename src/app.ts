import fastify from "fastify";
import multipart from "@fastify/multipart";
import { appRoutes } from "./http/controllers/routes.ts";
import { env } from "../env/index.ts";

const app = fastify();

app.register(multipart);
app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== "production") {
    console.error(error instanceof Error ? error.message : error);
  }
  reply.status(500).send({ error: "Internal Server Error" });
});

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => {
    console.log(`Server is running on port ${env.PORT}`);
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
