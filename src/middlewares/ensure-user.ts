import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors/app-error";
import { prisma } from "../lib/prisma";

export async function ensureUser(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  const headerValue = request.headers["user-id"];

  if (!headerValue || typeof headerValue !== "string") {
    throw new AppError("Missing user-id header", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: headerValue } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  request.userId = user.id;
}
