import { User, UserPayload } from "@/lib/domain/entities";
import { UserRepository } from "@/lib/domain/repositories/iUserRepository";
import { IHttpClient } from "@/lib/core/httpClient";

export class UserRepositoryImpl implements UserRepository {
  constructor(private httpClient: IHttpClient, private baseUrl?: string) {}

  async getUserById(id: string): Promise<User> {
    const response = await this.httpClient.get<User>(
      `${this.baseUrl}/users/${id}`
    );
    return response.data;
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    try {
      const response = await this.httpClient.get<User>(
        `${this.baseUrl}/users/phone/${phoneNumber}`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async createUser(
    user: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const response = await this.httpClient.post<User>(
      `${this.baseUrl}/users`,
      user
    );
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.httpClient.put<User>(
      `${this.baseUrl}/users/${id}`,
      userData
    );
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.httpClient.delete(`${this.baseUrl}/users/${id}`);
  }
}
