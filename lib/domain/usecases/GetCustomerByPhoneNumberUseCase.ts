import { Customer } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export interface IGetCustomerByPhoneNumberUseCase {
  execute(phoneNumber: string): Promise<Customer | null>;
}

export class GetCustomerByPhoneNumberUseCase
  implements IGetCustomerByPhoneNumberUseCase
{
  constructor(private customerRepository: CustomerRepository) {}

  /**
   * Execute the use case to get a customer by phone number
   * @param phoneNumber - Customer phone number
   * @returns Promise<Customer | null>
   * @throws Error if phone number is invalid
   */
  async execute(phoneNumber: string): Promise<Customer | null> {
    if (!phoneNumber || phoneNumber.trim() === "") {
      throw new Error("Phone number is required");
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    try {
      return await this.customerRepository.getCustomerByPhoneNumber(
        phoneNumber
      );
    } catch (error) {
      // For phone number lookups, we return null instead of throwing
      // as it's expected that a customer might not exist
      console.error("Error getting customer by phone number:", error);
      return null;
    }
  }
}
