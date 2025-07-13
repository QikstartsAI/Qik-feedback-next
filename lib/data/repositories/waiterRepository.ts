import { Waiter, WaiterPayload } from "@/lib/domain/entities";
import { WaiterRepository } from "@/lib/domain/repositories/iWaiterRepository";
import { IHttpClient } from "@/lib/core/httpClient";

export function createWaiterRepository(
  httpClient: IHttpClient,
  baseUrl?: string
): WaiterRepository {
  return new WaiterRepositoryImpl(httpClient, baseUrl);
}

export class WaiterRepositoryImpl implements WaiterRepository {
  constructor(private httpClient: IHttpClient, private baseUrl?: string) {}

  async getWaiterById(id: string): Promise<Waiter> {
    const response = await this.httpClient.get<Waiter>(
      `${this.baseUrl}/waiters/${id}`
    );
    return response.data;
  }

  async getWaitersByBranchId(branchId: string): Promise<Waiter[]> {
    const response = await this.httpClient.get<Waiter[]>(
      `${this.baseUrl}/waiters/branch/${branchId}`
    );
    return response.data;
  }

  async createWaiter(
    waiter: Omit<Waiter, "id" | "createdAt" | "updatedAt">
  ): Promise<Waiter> {
    const response = await this.httpClient.post<Waiter>(
      `${this.baseUrl}/waiters`,
      waiter
    );
    return response.data;
  }

  async updateWaiter(id: string, waiter: Partial<Waiter>): Promise<Waiter> {
    const response = await this.httpClient.put<Waiter>(
      `${this.baseUrl}/waiters/${id}`,
      waiter
    );
    return response.data;
  }

  async deleteWaiter(id: string): Promise<void> {
    await this.httpClient.delete(`${this.baseUrl}/waiters/${id}`);
  }
}
