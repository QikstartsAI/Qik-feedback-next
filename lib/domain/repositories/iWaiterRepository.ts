import { Waiter } from "../entities";

export interface WaiterRepository {
  getWaiterById(id: string): Promise<Waiter>;
  getWaitersByBranchId(branchId: string): Promise<Waiter[]>;
  createWaiter(
    waiter: Omit<Waiter, "id" | "createdAt" | "updatedAt">
  ): Promise<Waiter>;
  updateWaiter(id: string, waiter: Partial<Waiter>): Promise<Waiter>;
  deleteWaiter(id: string): Promise<void>;
}
