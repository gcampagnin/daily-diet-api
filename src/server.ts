import "dotenv/config";
import cors from "@fastify/cors";
import Fastify from "fastify";
import { AppError } from "./errors/app-error";
import { mealsRoutes } from "./modules/meals/meals.routes";
import { metricsRoutes } from "./modules/meals/metrics.routes";
import { usersRoutes } from "./modules/users/users.routes";

export function createServer() {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

    request.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  });

  app.register(usersRoutes, { prefix: "/users" });
  app.register(mealsRoutes, { prefix: "/meals" });
  app.register(metricsRoutes, { prefix: "/metrics" });

  return app;
}

if (require.main === module) {
  const app = createServer();
  const port = Number(process.env.PORT) || 3333;
  const host = process.env.HOST ?? "0.0.0.0";

  app
    .listen({ port, host })
    .then(() => {
      app.log.info(`HTTP server running on http://${host}:${port}`);
    })
    .catch((error) => {
      app.log.error(error);
      process.exit(1);
    });
}
