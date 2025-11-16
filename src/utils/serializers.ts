import type { Meal, User } from "@prisma/client";

export function serializeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.createdAt.toISOString(),
  };
}

export function serializeMeal(meal: Meal) {
  return {
    id: meal.id,
    user_id: meal.userId,
    name: meal.name,
    description: meal.description,
    datetime: meal.datetime.toISOString(),
    is_on_diet: meal.isOnDiet,
    created_at: meal.createdAt.toISOString(),
  };
}
