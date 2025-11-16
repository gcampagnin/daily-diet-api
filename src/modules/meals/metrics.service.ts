import type { Meal } from "@prisma/client";
import { MealsRepository } from "./meals.repository";

export interface MetricsResponse {
  total_meals: number;
  meals_inside_diet: number;
  meals_outside_diet: number;
  best_on_diet_sequence: number;
}

export class MetricsService {
  constructor(private readonly mealsRepository = new MealsRepository()) {}

  async getMetrics(userId: string): Promise<MetricsResponse> {
    const [totalMeals, mealsInsideDiet] = await Promise.all([
      this.mealsRepository.countByUser(userId),
      this.mealsRepository.countByUserAndDietFlag(userId, true),
    ]);

    const mealsOutsideDiet = totalMeals - mealsInsideDiet;
    const chronologicalMeals = await this.mealsRepository.listChronologically(
      userId,
    );
    const bestOnDietSequence = this.calculateBestOnDietSequence(
      chronologicalMeals,
    );

    return {
      total_meals: totalMeals,
      meals_inside_diet: mealsInsideDiet,
      meals_outside_diet: mealsOutsideDiet,
      best_on_diet_sequence: bestOnDietSequence,
    };
  }

  private calculateBestOnDietSequence(meals: Meal[]): number {
    let bestSequence = 0;
    let currentSequence = 0;

    for (const meal of meals) {
      if (meal.isOnDiet) {
        currentSequence += 1;
        bestSequence = Math.max(bestSequence, currentSequence);
      } else {
        currentSequence = 0;
      }
    }

    return bestSequence;
  }
}
