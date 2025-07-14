import { Branch, BranchPayload } from "@/lib/domain/entities";
import { BranchRepository } from "@/lib/domain/repositories/iBranchRepository";

// Mock branch data
const mockBranches: Branch[] = [
  {
    id: "branch-1",
    brandId: "brand-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/placeholder-logo.png",
      coverImgURL: "/restaurant-bg.jpg",
      name: "Restaurante El Buen Sabor",
      category: "Restaurante",
      location: {
        address: "Calle 15 #23-45, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9273, lon: -75.2819 },
        googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
      },
    },
  },
  {
    id: "branch-2",
    brandId: "brand-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/placeholder-logo.png",
      coverImgURL: "/restaurant-bg.jpg",
      name: "Restaurante El Buen Sabor - Centro",
      category: "Restaurante",
      location: {
        address: "Carrera 5 #18-32, Centro, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.928, lon: -75.2825 },
        googleMapURL: "https://maps.google.com/?q=2.9280,-75.2825",
      },
    },
  },
  {
    id: "branch-3",
    brandId: "brand-2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/googleqik.png",
      coverImgURL: "/business_icon_cover.jpg",
      name: "Café Delicioso",
      category: "Café",
      location: {
        address: "Avenida 26 #15-67, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9265, lon: -75.28 },
        googleMapURL: "https://maps.google.com/?q=2.9265,-75.2800",
      },
    },
  },
];

export class BranchRepositoryMock implements BranchRepository {
  async getBranchById(id: string): Promise<Branch> {
    const branch = mockBranches.find((b) => b.id === id);
    if (!branch) {
      throw new Error(`Branch with id ${id} not found`);
    }
    return branch;
  }

  async getBranchesByBrandId(brandId: string): Promise<Branch[]> {
    return mockBranches.filter((b) => b.brandId === brandId);
  }

  async createBranch(
    branch: Omit<Branch, "id" | "createdAt" | "updatedAt">
  ): Promise<Branch> {
    const newBranch: Branch = {
      ...branch,
      id: `branch-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBranches.push(newBranch);
    return newBranch;
  }

  async updateBranch(id: string, branch: Partial<Branch>): Promise<Branch> {
    const index = mockBranches.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Branch with id ${id} not found`);
    }

    mockBranches[index] = {
      ...mockBranches[index],
      ...branch,
      updatedAt: new Date(),
    };

    return mockBranches[index];
  }

  async deleteBranch(id: string): Promise<void> {
    const index = mockBranches.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Branch with id ${id} not found`);
    }
    mockBranches.splice(index, 1);
  }
}

export function createBranchRepositoryMock(): BranchRepository {
  return new BranchRepositoryMock();
}
