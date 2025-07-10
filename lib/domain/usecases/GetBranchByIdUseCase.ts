import { Branch } from "@/lib/domain/entities";
import { BranchRepository } from "@/lib/domain/repositories/iBranchRepository";

export interface IGetBranchByIdUseCase {
  execute(id: string): Promise<Branch>;
}

/**
 * Use case for getting a branch by ID
 */
export class GetBranchByIdUseCase implements IGetBranchByIdUseCase {
  constructor(private branchRepository: BranchRepository) {}

  /**
   * Execute the use case to get a branch by ID
   * @param id - Branch ID
   * @returns Promise<Branch>
   * @throws Error if validation fails or repository fails
   */
  async execute(id: string): Promise<Branch> {
    if (!id || id.trim() === "") {
      throw new Error("Branch ID is required");
    }

    try {
      return await this.branchRepository.getBranchById(id);
    } catch (error) {
      throw new Error(
        `Failed to get branch with ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
