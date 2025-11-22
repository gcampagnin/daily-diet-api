import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Meal } from "@prisma/client";

import type { MealsRepository } from "./meals.repository";
import { MetricsService } from "./metrics.service";

function createMeal(
  id: string,
  datetime: Date,
  isOnDiet: boolean,
  userId = "user-1",
): Meal {
  return {
    id,
    name: `Meal ${id}`,
    description: "Test meal",
    datetime,
    isOnDiet,
    userId,
    createdAt: datetime,
  };
}

function createMetricsServiceWithMeals(meals: Meal[]) {
  const repository = {
    async countByUser(_userId: string) {
      return meals.length;
    },
    async countByUserAndDietFlag(_userId: string, isOnDiet: boolean) {
      return meals.filter((meal) => meal.isOnDiet === isOnDiet).length;
    },
    async listChronologically() {
      return meals;
    },
  };

  return new MetricsService(repository as unknown as MealsRepository);
}

describe("MetricsService", () => {
  it("calculates metrics and resets the best on-diet sequence after an off-diet meal", async () => {
    const meals: Meal[] = [
      createMeal("1", new Date("2024-01-01T10:00:00Z"), true),
      createMeal("2", new Date("2024-01-01T12:00:00Z"), true),
      createMeal("3", new Date("2024-01-01T14:00:00Z"), false),
      createMeal("4", new Date("2024-01-02T09:00:00Z"), true),
      createMeal("5", new Date("2024-01-02T12:00:00Z"), true),
      createMeal("6", new Date("2024-01-02T15:00:00Z"), true),
      createMeal("7", new Date("2024-01-03T08:00:00Z"), false),
      createMeal("8", new Date("2024-01-03T10:00:00Z"), true),
    ];

    const metricsService = createMetricsServiceWithMeals(meals);
    const result = await metricsService.getMetrics("user-1");

    assert.deepEqual(result, {
      total_meals: 8,
      meals_inside_diet: 6,
      meals_outside_diet: 2,
      best_on_diet_sequence: 3,
    });
  });

  it("returns zero metrics when there are no meals", async () => {
    const metricsService = createMetricsServiceWithMeals([]);
    const result = await metricsService.getMetrics("user-2");

    assert.deepEqual(result, {
      total_meals: 0,
      meals_inside_diet: 0,
      meals_outside_diet: 0,
      best_on_diet_sequence: 0,
    });
  });

  it("returns zero as best sequence when all meals are outside the diet", async () => {
    const meals: Meal[] = [
      createMeal("1", new Date("2024-02-01T10:00:00Z"), false),
      createMeal("2", new Date("2024-02-01T12:00:00Z"), false),
      createMeal("3", new Date("2024-02-01T14:00:00Z"), false),
    ];

    const metricsService = createMetricsServiceWithMeals(meals);
    const result = await metricsService.getMetrics("user-3");

    assert.deepEqual(result, {
      total_meals: 3,
      meals_inside_diet: 0,
      meals_outside_diet: 3,
      best_on_diet_sequence: 0,
    });
  });
});
