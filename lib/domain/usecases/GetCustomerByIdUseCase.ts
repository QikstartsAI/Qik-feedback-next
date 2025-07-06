import { Customer } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export interface IGetCustomerByIdUseCase {
  execute(id: string): Promise<Customer>;
}

export class GetCustomerByIdUseCase implements IGetCustomerByIdUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  /**
   * Execute the use case to get a customer by ID
   * @param id - Customer ID
   * @returns Promise<Customer>
   * @throws Error if customer is not found or repository fails
   */
  async execute(id: string): Promise<Customer> {
    if (!id || id.trim() === "") {
      throw new Error("Customer ID is required");
    }

    try {
      return await this.customerRepository.getCustomerById(id);
    } catch (error) {
      throw new Error(
        `Failed to get customer by ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
