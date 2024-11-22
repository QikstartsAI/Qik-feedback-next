import { HttpClient } from "@/data";
import { CustomerDTO, CustomerModel, GetCustomerParams } from '@/domain'

const httpClient = new HttpClient();

export const getAllCustomers = async (params: GetCustomerParams) : Promise<CustomerModel[]> => {
  try {
    const customerList = await httpClient.get('/customer', params);
    return customerList as CustomerModel[];
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const createCustomer = async (customerData: CustomerDTO) => {
  try {
    const newCustomer = await httpClient.post("/customer", customerData);
    return newCustomer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const getCustomerById = async (customerId: string) : Promise<CustomerModel> => {
  try {
    const customer = await httpClient.get(`/customer/${customerId}`);
    return customer as CustomerModel;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
};