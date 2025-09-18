import { HttpClient, IHttpClient } from "@/lib/core/httpClient";
import { Customer, CustomerPayload } from "@/lib/domain/entities";
import { CustomerRepository } from "@/lib/domain/repositories/iCustomerRepository";

export class CustomerRepositoryImpl implements CustomerRepository {
  private httpClient: IHttpClient;
  private baseUrl: string;

  constructor(httpClient: IHttpClient, baseUrl?: string) {
    this.httpClient = httpClient;
    // Don't use baseUrl since HttpClient already has baseURL configured
    // This prevents double base URL issues and undefined concatenation
    this.baseUrl = "";
  }

  /**
   * Get customer by ID
   * @param id - Customer ID
   * @returns Promise<Customer>
   */
  async getCustomerById(id: string): Promise<Customer> {
    console.log("🔍 [CustomerRepository] getCustomerById - Starting", { id });
    try {
      const endpoint = `${this.baseUrl}/customers/${id}`;
      console.log("📡 [CustomerRepository] getCustomerById - Making request", { endpoint });
      
      const response = await this.httpClient.get<Customer>(endpoint);
      
      console.log("✅ [CustomerRepository] getCustomerById - Success", { 
        id, 
        customerId: response.data?.id,
        customerName: response.data?.payload?.name 
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ [CustomerRepository] getCustomerById - Error", { id, error });
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
    console.log("🔍 [CustomerRepository] getCustomerByPhoneNumber - Starting", { phone });
    try {
      const endpoint = `${this.baseUrl}/customers/by-number`;
      const params = { phoneNumber: phone };
      
      console.log("📡 [CustomerRepository] getCustomerByPhoneNumber - Making request", { 
        endpoint, 
        params 
      });
      
      const response = await this.httpClient.get<Customer>(endpoint, { params });

      console.log("✅ [CustomerRepository] getCustomerByPhoneNumber - Success", { 
        phone, 
        found: !!response.data,
        customerId: response.data?.id,
        customerName: response.data?.payload?.name 
      });

      return response.data;
    } catch (error) {
      console.error("❌ [CustomerRepository] getCustomerByPhoneNumber - Error (returning null)", { phone, error });
      // Return null instead of throwing for phone lookups
      return null;
    }
  }

  /**
   * Get customer by email
   * @param email - Customer email
   * @returns Promise<Customer | null>
   */
  async getCustomerByEmail(email: string): Promise<Customer | null> {
    try {
      const response = await this.httpClient.get<{items: Customer[], total: number}>(
        `${this.baseUrl}/customers`,
        {
          params: { email },
        }
      );

      // The API returns {items: Customer[], total: number}, so we need to extract the items
      const customers = response.data.items || [];
      return customers.length > 0 ? customers[0] : null;
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
    console.log("👤 [CustomerRepository] createCustomer - Starting", { 
      name: customerData.name,
      lastName: customerData.lastName,
      phoneNumber: customerData.phoneNumber,
      email: customerData.email,
      branchesCount: customerData.branches?.length || 0
    });
    
    try {
      // Backend expects data wrapped in a payload object
      const requestData = {
        payload: customerData
      };
      
      const endpoint = `${this.baseUrl}/customers`;
      console.log("📡 [CustomerRepository] createCustomer - Making request", { 
        endpoint, 
        requestData: {
          ...requestData,
          payload: {
            ...requestData.payload,
            // Don't log sensitive data in full
            phoneNumber: requestData.payload.phoneNumber ? 
              `${requestData.payload.phoneNumber.substring(0, 4)}***` : 'N/A'
          }
        }
      });
      
      const response = await this.httpClient.post<Customer>(endpoint, requestData);
      
      console.log("✅ [CustomerRepository] createCustomer - Success", { 
        customerId: response.data?.id,
        customerName: response.data?.payload?.name,
        customerLastName: response.data?.payload?.lastName,
        createdAt: response.data?.createdAt
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ [CustomerRepository] createCustomer - Error", { 
        customerData: {
          name: customerData.name,
          lastName: customerData.lastName,
          phoneNumber: customerData.phoneNumber ? 
            `${customerData.phoneNumber.substring(0, 4)}***` : 'N/A'
        },
        error 
      });
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
    console.log("✏️ [CustomerRepository] updateCustomer - Starting", { 
      id,
      updateFields: Object.keys(customerData)
    });
    
    try {
      // Backend expects data wrapped in a payload object
      const requestData = {
        payload: customerData
      };
      
      const endpoint = `${this.baseUrl}/customers/${id}`;
      console.log("📡 [CustomerRepository] updateCustomer - Making request", { 
        endpoint, 
        requestData: {
          ...requestData,
          payload: {
            ...requestData.payload,
            // Don't log sensitive data in full
            phoneNumber: requestData.payload.phoneNumber ? 
              `${requestData.payload.phoneNumber.substring(0, 4)}***` : undefined
          }
        }
      });
      
      const response = await this.httpClient.put<Customer>(endpoint, requestData);
      
      console.log("✅ [CustomerRepository] updateCustomer - Success", { 
        id,
        customerId: response.data?.id,
        customerName: response.data?.payload?.name,
        updatedAt: response.data?.updatedAt
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ [CustomerRepository] updateCustomer - Error", { 
        id,
        updateFields: Object.keys(customerData),
        error 
      });
      throw new Error(
        `Failed to update customer with ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete a customer
   * @param id - Customer ID
   * @returns Promise<void>
   */
  async deleteCustomer(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`${this.baseUrl}/customers/${id}`);
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw new Error(
        `Failed to delete customer ${id}: ${
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
