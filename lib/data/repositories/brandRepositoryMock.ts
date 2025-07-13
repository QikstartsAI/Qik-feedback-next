import { Brand, BrandPayload } from "@/lib/domain/entities";
import { BrandRepository } from "@/lib/domain/repositories/iBrandRepository";

// Mock brand data
const mockBrands: Brand[] = [
  {
    id: "brand-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/placeholder-logo.png",
      coverImgURL: "/restaurant-bg.jpg",
      name: "Restaurante El Buen Sabor",
      category: "Restaurante",
      powers: ["GEOLOCATION"],

      location: {
        address: "Calle 15 #23-45, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9273, lon: -75.2819 },
        googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
      },
    },
  },
  {
    id: "brand-2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/googleqik.png",
      coverImgURL: "/business_icon_cover.jpg",
      name: "Café Delicioso",
      category: "Café",
      powers: ["GEOLOCATION"],
      location: {
        address: "Avenida 26 #15-67, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9273, lon: -75.2819 },
        googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
      },
    },
  },
  {
    id: "brand-3",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/qik.svg",
      coverImgURL: "/female-dashboard.jpg",
      name: "Pizzería La Italiana",
      category: "Pizzería",
      powers: ["GEOLOCATION"],
      location: {
        address: "Carrera 8 #12-34, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9273, lon: -75.2819 },
        googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
      },
    },
  },
  {
    id: "brand-4",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/placeholder-logo.svg",
      coverImgURL: "/male-dashboard.jpg",
      name: "Hamburguesas El Rincón",
      category: "Fast Food",
      powers: ["GEOLOCATION"],

      location: {
        address: "Calle 20 #45-67, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9273, lon: -75.2819 },
        googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
      },
    },
  },
  {
    id: "brand-5",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/logo.png",
      coverImgURL: "/restaurant-bg.jpg",
      name: "Sushi Bar Sakura",
      category: "Restaurante Japonés",
      powers: ["GEOLOCATION"],

      location: {
        address: "Avenida 30 #18-90, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9273, lon: -75.2819 },
        googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
      },
    },
  },
];

export class BrandRepositoryMock implements BrandRepository {
  async getBrandById(id: string): Promise<Brand> {
    const brand = mockBrands.find((b) => b.id === id);
    if (!brand) {
      throw new Error(`Brand with id ${id} not found`);
    }
    return brand;
  }

  async getBrandByOwner(owner: string): Promise<Brand[]> {
    // For mock purposes, return all brands as if they belong to the owner
    // In a real implementation, this would filter by owner
    return mockBrands;
  }

  async createBrand(
    brand: Omit<Brand, "id" | "createdAt" | "updatedAt">
  ): Promise<Brand> {
    const newBrand: Brand = {
      ...brand,
      id: `brand-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBrands.push(newBrand);
    return newBrand;
  }

  async updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
    const index = mockBrands.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Brand with id ${id} not found`);
    }

    mockBrands[index] = {
      ...mockBrands[index],
      ...brand,
      updatedAt: new Date(),
    };

    return mockBrands[index];
  }

  async deleteBrand(id: string): Promise<void> {
    const index = mockBrands.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Brand with id ${id} not found`);
    }
    mockBrands.splice(index, 1);
  }
}

export function createBrandRepositoryMock(): BrandRepository {
  return new BrandRepositoryMock();
}
