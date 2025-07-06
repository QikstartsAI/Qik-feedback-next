import { Customer, CustomerPayload, CustomerType } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export interface ICreateCustomerUseCase {
  execute(customerData: CustomerPayload): Promise<Customer>;
}

export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  /**
   * Execute the use case to create a new customer
   * @param customerData - Customer data to create
   * @returns Promise<Customer>
   * @throws Error if validation fails or repository fails
   */
  async execute(customerData: CustomerPayload): Promise<Customer> {
    // Validate customer data
    this.validateCustomerData(customerData);

    try {
      return await this.customerRepository.createCustomer(customerData);
    } catch (error) {
      throw new Error(
        `Failed to create customer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Validate customer data before creation
   * @param customerData - Customer data to validate
   * @throws Error if validation fails
   */
  private validateCustomerData(customerData: CustomerPayload): void {
    if (!customerData.fullName || customerData.fullName.trim() === "") {
      throw new Error("Full name is required");
    }

    if (customerData.fullName.length < 2) {
      throw new Error("Full name must be at least 2 characters long");
    }

    if (!customerData.phoneNumber || customerData.phoneNumber.trim() === "") {
      throw new Error("Phone number is required");
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(customerData.phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    if (!customerData.birthDate) {
      throw new Error("Birth date is required");
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

    if (
      customerData.customerType === undefined ||
      customerData.customerType === null
    ) {
      throw new Error("Customer type is required");
    }

    // Validate customer type is a valid enum value
    if (!Object.values(CustomerType).includes(customerData.customerType)) {
      throw new Error("Invalid customer type");
    }
  }
}
