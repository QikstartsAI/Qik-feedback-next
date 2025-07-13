import { User } from "../entities";
import { UserRepository } from "../repositories/iUserRepository";

export interface IGetUserByIdUseCase {
  execute(id: string): Promise<User>;
}

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    if (!id || id.trim() === "") {
      throw new Error("User ID is required");
    }

    return await this.userRepository.getUserById(id);
  }
}
