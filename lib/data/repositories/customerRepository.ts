import { HttpClient, IHttpClient } from "@/lib/core/httpClient";
import { Customer, CustomerPayload } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export class CustomerRepositoryImpl implements CustomerRepository {
  private httpClient: IHttpClient;
  private baseUrl: string;

  constructor(httpClient: IHttpClient, baseUrl: string = "/api") {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  /**
   * Get customer by ID
   * @param id - Customer ID
   * @returns Promise<Customer>
   */
  async getCustomerById(id: string): Promise<Customer> {
    try {
      const response = await this.httpClient.get<Customer>(
        `${this.baseUrl}/customers/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer by ID:", error);
      throw new Error(
        `Failed to fetch customer with ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get customer by phone
   * @param phone - Customer phone
   * @returns Promise<Customer | null>
   */
  async getCustomerByPhoneNumber(phone: string): Promise<Customer | null> {
    try {
      const response = await this.httpClient.get<Customer[]>(
        `${this.baseUrl}/customers`,
        {
          params: { phone },
        }
      );

      if (response.data && response.data.length > 0) {
        return response.data[0];
      }

      return null;
    } catch (error) {
      console.error("Error fetching customer by email:", error);
      // Return null instead of throwing for email lookups
      return null;
    }
  }

  /**
   * Create a new customer
   * @param customerData - Customer data to create
   * @returns Promise<Customer>
   */
  async createCustomer(customerData: CustomerPayload): Promise<Customer> {
    try {
      const response = await this.httpClient.post<Customer>(
        `${this.baseUrl}/customers`,
        customerData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw new Error(
        `Failed to create customer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update an existing customer
   * @param id - Customer ID
   * @param customerData - Partial customer data to update
   * @returns Promise<Customer>
   */
  async updateCustomer(
    id: string,
    customerData: Partial<CustomerPayload>
  ): Promise<Customer> {
    try {
      const response = await this.httpClient.put<Customer>(
        `${this.baseUrl}/customers/${id}`,
        customerData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw new Error(
        `Failed to update customer with ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Factory function to create a customer repository instance
export const createCustomerRepository = (
  httpClient: IHttpClient,
  baseUrl?: string
): CustomerRepository => {
  return new CustomerRepositoryImpl(httpClient, baseUrl);
};

// Legacy factory function for backward compatibility
export const createCustomerRepositoryLegacy = (
  baseUrl?: string
): CustomerRepository => {
  const httpClient = HttpClient.createWithEnv();
  return new CustomerRepositoryImpl(httpClient, baseUrl);
};

// Default export for convenience
export default createCustomerRepositoryLegacy;
