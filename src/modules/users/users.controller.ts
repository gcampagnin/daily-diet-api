import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { serializeUser } from "../../utils/serializers";
import { UsersService } from "./users.service";

const createUserBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

const getUserParamsSchema = z.object({
  id: z.string().uuid(),
});

export class UsersController {
  constructor(private readonly usersService = new UsersService()) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email } = createUserBodySchema.parse(request.body);

    const user = await this.usersService.createUser({ name, email });

    return reply.status(201).send({ user: serializeUser(user) });
  };

  show = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = getUserParamsSchema.parse(request.params);

    const user = await this.usersService.getUserById(id);

    return reply.status(200).send({ user: serializeUser(user) });
  };
}
