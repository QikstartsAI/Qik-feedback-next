import { Branch } from "@/lib/domain/entities";

export interface BranchRepository {
  getBranchById(id: string): Promise<Branch>;
}
