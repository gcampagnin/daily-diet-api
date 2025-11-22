import type { FastifyInstance } from "fastify";
import { ensureUser } from "../../middlewares/ensure-user";
import { MetricsController } from "./metrics.controller";

export async function metricsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", async (request, reply) => {
    if (request.method === "OPTIONS") {
      return;
    }

    return ensureUser(request, reply);
  });

  const controller = new MetricsController();

  app.get("/", controller.index);
}
