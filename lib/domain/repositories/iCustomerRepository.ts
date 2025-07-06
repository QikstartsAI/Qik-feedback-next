import { Customer, CustomerPayload } from "@/lib/domain/entities";

export interface CustomerRepository {
  getCustomerById(id: string): Promise<Customer>;
  getCustomerByPhoneNumber(phone: string): Promise<Customer | null>;
  createCustomer(customerData: CustomerPayload): Promise<Customer>;
  updateCustomer(
    id: string,
    customerData: Partial<CustomerPayload>
  ): Promise<Customer>;
}
