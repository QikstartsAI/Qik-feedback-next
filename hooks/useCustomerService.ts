import { useCallback } from "react";
import { Customer, CustomerPayload } from "@/lib/domain/entities";
import { useDependencyInjection } from "@/hooks/useDependencyInjection";
import { CUSTOMER_SERVICE } from "@/lib/core/di/ServiceIdentifiers";
import { ICustomerService } from "@/lib/domain/usecases/CustomerService";

export function useCustomerService() {
  const { getService, isInitialized } = useDependencyInjection();

  const createOrRecoverCustomer = useCallback(
    async (customerData: CustomerPayload): Promise<Customer | null> => {
      if (!isInitialized) {
        console.error("Services not initialized");
        return null;
      }

      try {
        const customerService = await getService<ICustomerService>(CUSTOMER_SERVICE);
        const customer = await customerService.createOrRecoverCustomer(customerData);
        return customer;
      } catch (error) {
        console.error("Error creating or recovering customer:", error);
        return null;
      }
    },
    [isInitialized, getService]
  );

  return {
    createOrRecoverCustomer,
  };
}

