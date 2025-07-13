import { Brand } from "../entities";
import { BrandRepository } from "../repositories/iBrandRepository";

export interface IGetBrandByIdUseCase {
  execute(id: string): Promise<Brand>;
}

export class GetBrandByIdUseCase implements IGetBrandByIdUseCase {
  constructor(private brandRepository: BrandRepository) {}

  async execute(id: string): Promise<Brand> {
    if (!id || id.trim() === "") {
      throw new Error("Brand ID is required");
    }

    return await this.brandRepository.getBrandById(id);
  }
}
