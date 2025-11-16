import type { Meal } from "@prisma/client";
import { AppError } from "../../errors/app-error";
import { MealsRepository, type CreateMealDTO } from "./meals.repository";

type CreateMealInput = CreateMealDTO;

interface UpdateMealInput {
  userId: string;
  mealId: string;
  name: string;
  description: string;
  datetime: Date;
  isOnDiet: boolean;
}

export class MealsService {
  constructor(private readonly mealsRepository = new MealsRepository()) {}

  async createMeal(input: CreateMealInput): Promise<Meal> {
    return this.mealsRepository.create(input as CreateMealDTO);
  }

  async listMeals(userId: string): Promise<Meal[]> {
    return this.mealsRepository.listByUser(userId);
  }

  async getMealById(userId: string, mealId: string): Promise<Meal> {
    const meal = await this.mealsRepository.findByIdAndUser(mealId, userId);

    if (!meal) {
      throw new AppError("Meal not found", 404);
    }

    return meal;
  }

  async updateMeal({
    userId,
    mealId,
    name,
    description,
    datetime,
    isOnDiet,
  }: UpdateMealInput): Promise<Meal> {
    await this.ensureOwnership(userId, mealId);

    return this.mealsRepository.update(mealId, {
      name,
      description,
      datetime,
      isOnDiet,
    });
  }

  async deleteMeal(userId: string, mealId: string): Promise<void> {
    await this.ensureOwnership(userId, mealId);
    await this.mealsRepository.delete(mealId);
  }

  private async ensureOwnership(userId: string, mealId: string) {
    const meal = await this.mealsRepository.findByIdAndUser(mealId, userId);

    if (!meal) {
      throw new AppError("Meal not found", 404);
    }
  }
}
