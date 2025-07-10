import { HttpClient, IHttpClient } from "@/lib/core/httpClient";
import { Branch } from "@/lib/domain/entities";
import { BranchRepository } from "@/lib/domain/repositories/iBranchRepository";

export class BranchRepositoryImpl implements BranchRepository {
  private httpClient: IHttpClient;
  private baseUrl: string;

  constructor(httpClient: IHttpClient, baseUrl?: string) {
    this.httpClient = httpClient;
    // Only use baseUrl if HttpClient doesn't already have a baseURL configured
    // This prevents double base URL issues
    this.baseUrl = baseUrl || "";
  }

  /**
   * Get branch by ID
   * @param id - Branch ID
   * @returns Promise<Branch>
   */
  async getBranchById(id: string): Promise<Branch> {
    try {
      const response = await this.httpClient.get<Branch>(
        `${this.baseUrl}/branches/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching branch by ID:", error);
      throw new Error(
        `Failed to fetch branch with ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Factory function to create a branch repository instance
export const createBranchRepository = (
  httpClient: IHttpClient,
  baseUrl?: string
): BranchRepository => {
  return new BranchRepositoryImpl(httpClient, baseUrl);
};

// Default export for convenience
export default createBranchRepository;
