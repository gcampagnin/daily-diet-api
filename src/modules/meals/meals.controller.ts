import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { serializeMeal } from "../../utils/serializers";
import { MealsService } from "./meals.service";

const mealBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  datetime: z.string().datetime(),
  is_on_diet: z.boolean(),
});

const mealParamsSchema = z.object({
  id: z.string().uuid(),
});

export class MealsController {
  constructor(private readonly mealsService = new MealsService()) {}

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, description, datetime, is_on_diet } = mealBodySchema.parse(
      request.body,
    );

    const userId = request.userId!;

    const meal = await this.mealsService.createMeal({
      userId,
      name,
      description,
      datetime: new Date(datetime),
      isOnDiet: is_on_diet,
    });

    return reply.status(201).send({ meal: serializeMeal(meal) });
  };

  index = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId!;
    const meals = await this.mealsService.listMeals(userId);

    return reply.status(200).send({ meals: meals.map(serializeMeal) });
  };

  show = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = mealParamsSchema.parse(request.params);
    const userId = request.userId!;

    const meal = await this.mealsService.getMealById(userId, id);

    return reply.status(200).send({ meal: serializeMeal(meal) });
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = mealParamsSchema.parse(request.params);
    const { name, description, datetime, is_on_diet } = mealBodySchema.parse(
      request.body,
    );
    const userId = request.userId!;

    const meal = await this.mealsService.updateMeal({
      userId,
      mealId: id,
      name,
      description,
      datetime: new Date(datetime),
      isOnDiet: is_on_diet,
    });

    return reply.status(200).send({ meal: serializeMeal(meal) });
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = mealParamsSchema.parse(request.params);
    const userId = request.userId!;

    await this.mealsService.deleteMeal(userId, id);

    return reply.status(204).send();
  };
}
