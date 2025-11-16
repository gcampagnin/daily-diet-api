import type { FastifyInstance } from "fastify";
import { UsersController } from "./users.controller";

export async function usersRoutes(app: FastifyInstance) {
  const controller = new UsersController();

  app.post("/", controller.create);
  app.get("/:id", controller.show);
}
