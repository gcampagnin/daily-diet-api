import type { Meal, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export interface CreateMealDTO {
  userId: string;
  name: string;
  description: string;
  datetime: Date;
  isOnDiet: boolean;
}

export class MealsRepository {
  async create(data: CreateMealDTO): Promise<Meal> {
    return prisma.meal.create({ data });
  }

  async listByUser(userId: string): Promise<Meal[]> {
    return prisma.meal.findMany({
      where: { userId },
      orderBy: { datetime: "desc" },
    });
  }

  async listChronologically(userId: string): Promise<Meal[]> {
    return prisma.meal.findMany({
      where: { userId },
      orderBy: { datetime: "asc" },
    });
  }

  async findByIdAndUser(id: string, userId: string): Promise<Meal | null> {
    return prisma.meal.findFirst({ where: { id, userId } });
  }

  async update(id: string, data: Prisma.MealUpdateInput): Promise<Meal> {
    return prisma.meal.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.meal.delete({ where: { id } });
  }

  async countByUser(userId: string): Promise<number> {
    return prisma.meal.count({ where: { userId } });
  }

  async countByUserAndDietFlag(userId: string, isOnDiet: boolean): Promise<number> {
    return prisma.meal.count({ where: { userId, isOnDiet } });
  }
}
