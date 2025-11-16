import type { FastifyInstance } from "fastify";
import { ensureUser } from "../../middlewares/ensure-user";
import { MealsController } from "./meals.controller";

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", ensureUser);

  const controller = new MealsController();

  app.post("/", controller.create);
  app.get("/", controller.index);
  app.get("/:id", controller.show);
  app.put("/:id", controller.update);
  app.delete("/:id", controller.delete);
}
