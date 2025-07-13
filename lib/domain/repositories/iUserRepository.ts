import { User } from "../entities";

export interface UserRepository {
  getUserById(id: string): Promise<User>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | null>;
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
