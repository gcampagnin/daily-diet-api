import type { FastifyReply, FastifyRequest } from "fastify";
import { MetricsService } from "./metrics.service";

export class MetricsController {
  constructor(private readonly metricsService = new MetricsService()) {}

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId!;

    const metrics = await this.metricsService.getMetrics(userId);

    return reply.status(200).send({ metrics });
  };
}
