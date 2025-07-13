import { Branch } from "@/lib/domain/entities";

export interface BranchRepository {
  getBranchById(id: string): Promise<Branch>;
  getBranchesByBrandId(brandId: string): Promise<Branch[]>;
  createBranch(
    branch: Omit<Branch, "id" | "createdAt" | "updatedAt">
  ): Promise<Branch>;
  updateBranch(id: string, branch: Partial<Branch>): Promise<Branch>;
  deleteBranch(id: string): Promise<void>;
}
