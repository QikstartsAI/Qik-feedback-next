import { HttpClient, IHttpClient } from "@/lib/core/httpClient";
import { Customer, CustomerPayload } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export class CustomerRepositoryImpl implements CustomerRepository {
  private httpClient: IHttpClient;
  private baseUrl: string;

  constructor(httpClient: IHttpClient, baseUrl?: string) {
    this.httpClient = httpClient;
    // Only use baseUrl if HttpClient doesn't already have a baseURL configured
    // This prevents double base URL issues
    this.baseUrl = baseUrl || "";
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
      const response = await this.httpClient.get<Customer>(
        `${this.baseUrl}/customers/by-number`,
        {
          params: { phone },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching customer by phone:", error);
      // Return null instead of throwing for phone lookups
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

// Default export for convenience
export default createCustomerRepository;

// {
//   "email": "test@test.com",
//   "firstName": "TEST",
//   "lastName": "TEST",
//   "phoneNumber": "+573183147981",
//   "password": "TEST12345!"
// }

// {
//   "id": "ac34c402-73a1-4a2b-b920-b9a147471ecb",
//   "owner": "686c2f50539c8f5a48487bbc",
//   "payload": {
//     "name": "Negocio de Prueba",
//     "address": "Calle 20 # 20 - 20",
//     "country": "CO",
//     "city": "Neiva",
//     "coverImgURL": "https://marketplace.canva.com/EAF8OQTDry0/1/0/1600w/canva-logo-restaurante-circular-blanco-y-negro-yoLE4F7rTeQ.jpg",
//     "logo": "https://marketplace.canva.com/EAF8OQTDry0/1/0/1600w/canva-logo-restaurante-circular-blanco-y-negro-yoLE4F7rTeQ.jpg"
//   },
//   "_id": "686c32b6539c8f5a48487bc0",
//   "createdAt": "2025-07-07T20:48:54.520Z",
//   "updatedAt": "2025-07-07T20:48:54.520Z",
//   "__v": 0
// }

// {
//   "id": "d66bc78e-516f-46b3-ba3b-4bc042200908",
//   "brand": "ac34c402-73a1-4a2b-b920-b9a147471ecb",
//   "owner": "686c2f50539c8f5a48487bbc",
//   "payload": {
//     "name": "Negocio de Prueba",
//     "address": "Calle 20 # 20 - 20",
//     "country": "CO",
//     "city": "Neiva",
//     "coverImgURL": "https://marketplace.canva.com/EAF8OQTDry0/1/0/1600w/canva-logo-restaurante-circular-blanco-y-negro-yoLE4F7rTeQ.jpg",
//     "logo": "https://marketplace.canva.com/EAF8OQTDry0/1/0/1600w/canva-logo-restaurante-circular-blanco-y-negro-yoLE4F7rTeQ.jpg"
//   },
//   "_id": "686c3305539c8f5a48487bc4",
//   "createdAt": "2025-07-07T20:50:13.418Z",
//   "updatedAt": "2025-07-07T20:50:13.418Z",
//   "__v": 0
// }

// {
//   "origin": "a",
//   "customerType": "new",
//   "email": "a@a.com",
//   "payload": {
//     "fullName": "Jesus Sanchez",
//     "phoneNumber": "+573183147984",
//     "branches": [
//       "d66bc78e-516f-46b3-ba3b-4bc042200908"
//     ]
//   },
//   "_id": "686c3420539c8f5a48487bc6",
//   "createdAt": "2025-07-07T20:54:56.501Z",
//   "updatedAt": "2025-07-07T20:54:56.501Z",
//   "__v": 0,
//   "id": "686c3420539c8f5a48487bc6"
// }
