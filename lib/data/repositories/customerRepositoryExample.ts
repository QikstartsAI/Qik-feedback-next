import { createCustomerRepository } from "./customerRepository";
import { HttpClient } from "@/lib/core/httpClient";
import { Customer, CustomerPayload, CustomerType } from "@/lib/domain/entities";

// Example usage of the Customer Repository
export class CustomerService {
  private customerRepository = createCustomerRepository(
    HttpClient.createWithEnv()
  );

  /**
   * Example: Get a customer by ID
   */
  async getCustomerById(id: string) {
    try {
      const customer = await this.customerRepository.getCustomerById(id);
      console.log("Customer found:", customer);
      return customer;
    } catch (error) {
      console.error("Failed to get customer:", error);
      throw error;
    }
  }

  /**
   * Example: Get a customer by phone number
   */
  async getCustomerByPhoneNumber(phone: string) {
    try {
      const customer = await this.customerRepository.getCustomerByPhoneNumber(
        phone
      );
      if (customer) {
        console.log("Customer found:", customer);
        return customer;
      } else {
        console.log("No customer found with phone:", phone);
        return null;
      }
    } catch (error) {
      console.error("Failed to get customer by phone:", error);
      throw error;
    }
  }

  /**
   * Example: Create a new customer
   */
  async createNewCustomer(customerData: CustomerPayload) {
    try {
      const newCustomer = await this.customerRepository.createCustomer(
        customerData
      );
      console.log("Customer created:", newCustomer);
      return newCustomer;
    } catch (error) {
      console.error("Failed to create customer:", error);
      throw error;
    }
  }

  /**
   * Example: Update an existing customer
   */
  async updateExistingCustomer(
    id: string,
    updateData: Partial<CustomerPayload>
  ) {
    try {
      const updatedCustomer = await this.customerRepository.updateCustomer(
        id,
        updateData
      );
      console.log("Customer updated:", updatedCustomer);
      return updatedCustomer;
    } catch (error) {
      console.error("Failed to update customer:", error);
      throw error;
    }
  }

  /**
   * Example: Complete workflow - find or create customer
   */
  async findOrCreateCustomer(phone: string, customerData: CustomerPayload) {
    try {
      // First, try to find existing customer
      let customer = await this.customerRepository.getCustomerByPhoneNumber(
        phone
      );

      if (customer) {
        console.log("Existing customer found:", customer);
        return customer;
      }

      // If not found, create new customer
      console.log("Creating new customer for phone:", phone);
      const newCustomer = await this.customerRepository.createCustomer(
        customerData
      );

      console.log("New customer created:", newCustomer);
      return newCustomer;
    } catch (error) {
      console.error("Failed to find or create customer:", error);
      throw error;
    }
  }
}

// Usage examples:
/*
const customerService = new CustomerService();

// Get customer by ID
await customerService.getCustomerById("customer123");

// Get customer by phone number
await customerService.getCustomerByPhoneNumber("+1234567890");

// Create new customer
const newCustomerData: CustomerPayload = {
  fullName: "John Doe",
  customerType: CustomerType.New,
  birthDate: new Date("1990-01-01"),
  phoneNumber: "+1234567890"
};
await customerService.createNewCustomer(newCustomerData);

// Update customer
await customerService.updateExistingCustomer("customer123", {
  fullName: "John Smith",
  phoneNumber: "+1234567890"
});

// Find or create customer
await customerService.findOrCreateCustomer("+1234567890", {
  fullName: "John Doe",
  customerType: CustomerType.New,
  birthDate: new Date("1990-01-01"),
  phoneNumber: "+1234567890"
});
*/
