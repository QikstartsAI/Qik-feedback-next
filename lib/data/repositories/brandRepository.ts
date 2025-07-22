import { Brand, BrandPayload } from "@/lib/domain/entities";
import { BrandRepository } from "@/lib/domain/repositories/iBrandRepository";
import { IHttpClient } from "@/lib/core/httpClient";

export function createBrandRepository(
  httpClient: IHttpClient,
  baseUrl?: string
): BrandRepository {
  return new BrandRepositoryImpl(httpClient, baseUrl);
}

export class BrandRepositoryImpl implements BrandRepository {
  constructor(private httpClient: IHttpClient, private baseUrl?: string) {}

  async getBrandById(id: string): Promise<Brand> {
    const response = await this.httpClient.get<Brand>(
      `${this.baseUrl}/brands/${id}`
    );
    return response.data;
  }

  async getBrandByOwner(owner: string): Promise<Brand[]> {
    const response = await this.httpClient.get<Brand[]>(
      `${this.baseUrl}/brands/owner/${owner}`
    );
    return response.data;
  }

  async createBrand(
    brand: Omit<Brand, "id" | "createdAt" | "updatedAt">
  ): Promise<Brand> {
    const response = await this.httpClient.post<Brand>(
      `${this.baseUrl}/brands`,
      brand
    );
    return response.data;
  }

  async updateBrand(id: string, brand: Partial<Brand>): Promise<Brand> {
    const response = await this.httpClient.put<Brand>(
      `${this.baseUrl}/brands/${id}`,
      brand
    );
    return response.data;
  }

  async deleteBrand(id: string): Promise<void> {
    await this.httpClient.delete(`${this.baseUrl}/brands/${id}`);
  }
}
