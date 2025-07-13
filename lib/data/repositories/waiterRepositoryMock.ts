import { Waiter, WaiterPayload } from "@/lib/domain/entities";
import { WaiterRepository } from "@/lib/domain/repositories/iWaiterRepository";

// Mock waiter data
const mockWaiters: Waiter[] = [
  {
    id: "waiter-1",
    branchId: "branch-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      name: "María",
      lastName: "González",
      gender: "female",
      birthDate: new Date("1990-05-15"),
      rate: 4.8,
    },
  },
  {
    id: "waiter-2",
    branchId: "branch-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      name: "Carlos",
      lastName: "Rodríguez",
      gender: "male",
      birthDate: new Date("1988-12-03"),
      rate: 4.6,
    },
  },
  {
    id: "waiter-3",
    branchId: "branch-2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      name: "Ana",
      lastName: "Martínez",
      gender: "female",
      birthDate: new Date("1992-08-22"),
      rate: 4.9,
    },
  },
];

export class WaiterRepositoryMock implements WaiterRepository {
  async getWaiterById(id: string): Promise<Waiter> {
    const waiter = mockWaiters.find((w) => w.id === id);
    if (!waiter) {
      throw new Error(`Waiter with id ${id} not found`);
    }
    return waiter;
  }

  async getWaitersByBranchId(branchId: string): Promise<Waiter[]> {
    return mockWaiters.filter((w) => w.branchId === branchId);
  }

  async createWaiter(
    waiter: Omit<Waiter, "id" | "createdAt" | "updatedAt">
  ): Promise<Waiter> {
    const newWaiter: Waiter = {
      ...waiter,
      id: `waiter-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockWaiters.push(newWaiter);
    return newWaiter;
  }

  async updateWaiter(id: string, waiter: Partial<Waiter>): Promise<Waiter> {
    const index = mockWaiters.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Waiter with id ${id} not found`);
    }

    mockWaiters[index] = {
      ...mockWaiters[index],
      ...waiter,
      updatedAt: new Date(),
    };

    return mockWaiters[index];
  }

  async deleteWaiter(id: string): Promise<void> {
    const index = mockWaiters.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Waiter with id ${id} not found`);
    }
    mockWaiters.splice(index, 1);
  }
}

export function createWaiterRepositoryMock(): WaiterRepository {
  return new WaiterRepositoryMock();
}
