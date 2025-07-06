import { Customer, CustomerPayload, CustomerType } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export interface IUpdateCustomerUseCase {
  execute(
    id: string,
    customerData: Partial<CustomerPayload>
  ): Promise<Customer>;
}

export class UpdateCustomerUseCase implements IUpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  /**
   * Execute the use case to update an existing customer
   * @param id - Customer ID
   * @param customerData - Partial customer data to update
   * @returns Promise<Customer>
   * @throws Error if validation fails or repository fails
   */
  async execute(
    id: string,
    customerData: Partial<CustomerPayload>
  ): Promise<Customer> {
    if (!id || id.trim() === "") {
      throw new Error("Customer ID is required");
    }

    // Validate partial customer data
    this.validatePartialCustomerData(customerData);

    try {
      return await this.customerRepository.updateCustomer(id, customerData);
    } catch (error) {
      throw new Error(
        `Failed to update customer with ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Validate partial customer data before update
   * @param customerData - Partial customer data to validate
   * @throws Error if validation fails
   */
  private validatePartialCustomerData(
    customerData: Partial<CustomerPayload>
  ): void {
    // Only validate fields that are provided
    if (customerData.fullName !== undefined) {
      if (!customerData.fullName || customerData.fullName.trim() === "") {
        throw new Error("Full name cannot be empty");
      }

      if (customerData.fullName.length < 2) {
        throw new Error("Full name must be at least 2 characters long");
      }
    }

    if (customerData.phoneNumber !== undefined) {
      if (!customerData.phoneNumber || customerData.phoneNumber.trim() === "") {
        throw new Error("Phone number cannot be empty");
      }

      // Basic phone number validation
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(customerData.phoneNumber)) {
        throw new Error("Invalid phone number format");
      }
    }

    if (customerData.birthDate !== undefined) {
      if (!customerData.birthDate) {
        throw new Error("Birth date cannot be empty");
      }

      // Validate birth date is not in the future
      if (customerData.birthDate > new Date()) {
        throw new Error("Birth date cannot be in the future");
      }

      // Validate birth date is reasonable (not too old)
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      if (customerData.birthDate < minDate) {
        throw new Error("Birth date seems invalid");
      }
    }

    if (customerData.customerType !== undefined) {
      if (customerData.customerType === null) {
        throw new Error("Customer type cannot be null");
      }

      // Validate customer type is a valid enum value
      if (!Object.values(CustomerType).includes(customerData.customerType)) {
        throw new Error("Invalid customer type");
      }
    }
  }
}
