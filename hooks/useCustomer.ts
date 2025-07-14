import { useCallback } from "react";
import { Customer, CustomerPayload, CustomerType } from "@/lib/domain/entities";
import { useCustomerContext } from "@/lib/data/context";

export interface UseCustomerReturn {
  // State
  currentCustomer: Customer | null;
  customerType: CustomerType;
  loading: boolean;
  error: string | null;

  // Actions
  editCustomer: (customer: CustomerPayload) => void;
  getCustomerById: (id: string) => Promise<Customer | null>;
  getCustomerByPhone: (
    phoneNumber: string,
    currentBranchId?: string
  ) => Promise<Customer | null>;
  createCustomer: (customerData: CustomerPayload) => Promise<Customer | null>;
  updateCustomer: (
    id: string,
    customerData: Partial<CustomerPayload>
  ) => Promise<Customer | null>;

  // Utility functions
  clearError: () => void;
  clearCurrentCustomer: () => void;
}

/**
 * Custom hook for customer operations
 * Provides easy access to all customer-related functionality
 */
export function useCustomer(): UseCustomerReturn {
  const context = useCustomerContext();

  // Convenience methods

  return {
    // State
    currentCustomer: context.currentCustomer,
    customerType: context.customerType,
    loading: context.loading,
    error: context.error,

    // Actions
    editCustomer: context.editCustomer,
    getCustomerById: context.getCustomerById,
    getCustomerByPhone: context.getCustomerByPhone,
    createCustomer: context.createCustomer,
    updateCustomer: context.updateCustomer,

    // Utility functions
    clearError: context.clearError,
    clearCurrentCustomer: context.clearCurrentCustomer,
  };
}

/**
 * Hook for customer search operations
 */
export function useCustomerSearch() {
  const { getCustomerById, getCustomerByPhone, loading, error, clearError } =
    useCustomer();

  const searchById = useCallback(
    async (id: string): Promise<Customer | null> => {
      clearError();
      return await getCustomerById(id);
    },
    [getCustomerById, clearError]
  );

  const searchByPhone = useCallback(
    async (
      phoneNumber: string,
      currentBranchId?: string
    ): Promise<Customer | null> => {
      clearError();
      return await getCustomerByPhone(phoneNumber, currentBranchId);
    },
    [getCustomerByPhone, clearError]
  );

  return {
    searchById,
    searchByPhone,
    loading,
    error,
    clearError,
  };
}

/**
 * Hook for customer creation operations
 */
export function useCustomerCreation() {
  const { createCustomer, loading, error, clearError } = useCustomer();

  const create = useCallback(
    async (customerData: CustomerPayload): Promise<Customer | null> => {
      clearError();
      return await createCustomer(customerData);
    },
    [createCustomer, clearError]
  );

  return {
    create,
    loading,
    error,
    clearError,
  };
}

/**
 * Hook for customer update operations
 */
export function useCustomerUpdate() {
  const { updateCustomer, currentCustomer, loading, error, clearError } =
    useCustomer();

  const update = useCallback(
    async (
      id: string,
      customerData: Partial<CustomerPayload>
    ): Promise<Customer | null> => {
      clearError();
      return await updateCustomer(id, customerData);
    },
    [updateCustomer, clearError]
  );

  const updateCurrentCustomer = useCallback(
    async (
      customerData: Partial<CustomerPayload>
    ): Promise<Customer | null> => {
      if (!currentCustomer) {
        throw new Error("No current customer to update");
      }
      clearError();
      return await updateCustomer(currentCustomer.id, customerData);
    },
    [currentCustomer, updateCustomer, clearError]
  );

  return {
    update,
    updateCurrentCustomer,
    currentCustomer,
    loading,
    error,
    clearError,
  };
}
