import { Brand } from "../entities";

export interface BrandRepository {
  getBrandById(id: string): Promise<Brand>;
  getBrandByOwner(owner: string): Promise<Brand[]>;
  createBrand(
    brand: Omit<Brand, "id" | "createdAt" | "updatedAt">
  ): Promise<Brand>;
  updateBrand(id: string, brand: Partial<Brand>): Promise<Brand>;
  deleteBrand(id: string): Promise<void>;
}
