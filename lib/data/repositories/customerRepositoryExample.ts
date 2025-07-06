import { createCustomerRepository } from "./customerRepository";
import { CustomerDTO } from "@/app/layers/domain";

// Example usage of the Customer Repository
export class CustomerService {
  private customerRepository = createCustomerRepository();

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
   * Example: Get a customer by email
   */
  async getCustomerByPhoneNumber(email: string) {
    try {
      const customer = await this.customerRepository.getCustomerByPhoneNumber(
        email
      );
      if (customer) {
        console.log("Customer found:", customer);
        return customer;
      } else {
        console.log("No customer found with email:", email);
        return null;
      }
    } catch (error) {
      console.error("Failed to get customer by email:", error);
      throw error;
    }
  }

  /**
   * Example: Create a new customer
   */
  async createNewCustomer(customerData: CustomerDTO) {
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
  async updateExistingCustomer(id: string, updateData: Partial<CustomerDTO>) {
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
  async findOrCreateCustomer(
    phone: string,
    customerData: Omit<CustomerDTO, "id">
  ) {
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
      const newCustomer = await this.customerRepository.createCustomer({
        ...customerData,
        id: phone, // Using phone as ID for this example
      });

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

// Get customer by email
await customerService.getCustomerByPhoneNumber("user@example.com");

// Create new customer
const newCustomerData: CustomerDTO = {
  id: "user@example.com",
  email: "user@example.com",
  customerType: "new",
  origin: "web",
  payload: {
    name: "John Doe",
    phoneNumber: "+1234567890"
  }
};
await customerService.createNewCustomer(newCustomerData);

// Update customer
await customerService.updateExistingCustomer("user@example.com", {
  payload: {
    name: "John Smith",
    phoneNumber: "+1234567890"
  }
});

// Get all customers with filter
await customerService.getAllCustomers({ customerType: "frequent" });

// Find or create customer
await customerService.findOrCreateCustomer("user@example.com", {
  email: "user@example.com",
  customerType: "new",
  origin: "web",
  payload: {
    name: "John Doe"
  }
});
*/
