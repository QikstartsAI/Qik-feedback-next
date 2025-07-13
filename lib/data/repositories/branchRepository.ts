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

  /**
   * Get branches by brand ID
   * @param brandId - Brand ID
   * @returns Promise<Branch[]>
   */
  async getBranchesByBrandId(brandId: string): Promise<Branch[]> {
    try {
      const response = await this.httpClient.get<Branch[]>(
        `${this.baseUrl}/branches/brand/${brandId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching branches by brand ID:", error);
      throw new Error(
        `Failed to fetch branches for brand ${brandId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Create a new branch
   * @param branch - Branch data without id, createdAt, updatedAt
   * @returns Promise<Branch>
   */
  async createBranch(
    branch: Omit<Branch, "id" | "createdAt" | "updatedAt">
  ): Promise<Branch> {
    try {
      const response = await this.httpClient.post<Branch>(
        `${this.baseUrl}/branches`,
        branch
      );
      return response.data;
    } catch (error) {
      console.error("Error creating branch:", error);
      throw new Error(
        `Failed to create branch: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update an existing branch
   * @param id - Branch ID
   * @param branch - Partial branch data
   * @returns Promise<Branch>
   */
  async updateBranch(id: string, branch: Partial<Branch>): Promise<Branch> {
    try {
      const response = await this.httpClient.put<Branch>(
        `${this.baseUrl}/branches/${id}`,
        branch
      );
      return response.data;
    } catch (error) {
      console.error("Error updating branch:", error);
      throw new Error(
        `Failed to update branch ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete a branch
   * @param id - Branch ID
   * @returns Promise<void>
   */
  async deleteBranch(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`${this.baseUrl}/branches/${id}`);
    } catch (error) {
      console.error("Error deleting branch:", error);
      throw new Error(
        `Failed to delete branch ${id}: ${
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
