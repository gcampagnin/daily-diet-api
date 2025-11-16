import type { User } from "@prisma/client";
import { AppError } from "../../errors/app-error";
import { UsersRepository } from "./users.repository";

interface CreateUserInput {
  name: string;
  email: string;
}

export class UsersService {
  constructor(private readonly usersRepository = new UsersRepository()) {}

  async createUser({ name, email }: CreateUserInput): Promise<User> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new AppError("Email already in use", 409);
    }

    return this.usersRepository.create({ name, email });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
