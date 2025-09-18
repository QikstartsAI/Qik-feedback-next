"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Customer, CustomerPayload, CustomerType } from "@/lib/domain/entities";
import {
  IGetCustomerByIdUseCase,
  IGetCustomerByPhoneNumberUseCase,
  ICreateCustomerUseCase,
  IUpdateCustomerUseCase,
} from "@/lib/domain/usecases";
import { useDependencyInjection } from "@/hooks/useDependencyInjection";
import {
  GET_CUSTOMER_BY_ID_USE_CASE,
  GET_CUSTOMER_BY_PHONE_USE_CASE,
  CREATE_CUSTOMER_USE_CASE,
  UPDATE_CUSTOMER_USE_CASE,
} from "@/lib/core/di/ServiceIdentifiers";

interface CustomerContextState {
  currentCustomer: Customer | null;
  customerType: CustomerType;
  loading: boolean;
  error: string | null;
}

interface CustomerContextActions {
  editCustomer: (customerData: CustomerPayload) => void;
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
  clearError: () => void;
  clearCurrentCustomer: () => void;
}

interface CustomerContextType
  extends CustomerContextState,
    CustomerContextActions {}

interface CustomerProviderProps {
  children: ReactNode;
}

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export function CustomerProvider({ children }: CustomerProviderProps) {
  const { getService, isInitialized } = useDependencyInjection();

  const [state, setState] = useState<CustomerContextState>({
    currentCustomer: null,
    customerType: CustomerType.New,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loading,
      error: loading ? null : prev.error,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, loading: false }));
  }, []);

  const setCurrentCustomer = useCallback((customer: Customer | null) => {
    setState((prev) => ({ ...prev, currentCustomer: customer }));
  }, []);

  const setCustomerType = useCallback((customerType: CustomerType) => {
    setState((prev) => ({ ...prev, customerType }));
  }, []);

  const editCustomer = (customerData: CustomerPayload): void => {
    const editedCustomer = {
      ...state.currentCustomer,
      payload: customerData,
    } as Customer;

    setCurrentCustomer(editedCustomer);
  };

  const getCustomerById = useCallback(
    async (id: string): Promise<Customer | null> => {
      if (!isInitialized) {
        setError("Services not initialized");
        return null;
      }

      setLoading(true);

      try {
        const useCase = await getService<IGetCustomerByIdUseCase>(
          GET_CUSTOMER_BY_ID_USE_CASE
        );
        const customer = await useCase.execute(id);

        setCurrentCustomer(customer);

        return customer;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to get customer by ID";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, getService, setLoading, setError, setCurrentCustomer]
  );

  const getCustomerByPhone = useCallback(
    async (
      phoneNumber: string,
      currentBranchId?: string
    ): Promise<Customer | null> => {
      if (!isInitialized) {
        setError("Services not initialized");
        return null;
      }

      setLoading(true);

      try {
        const useCase = await getService<IGetCustomerByPhoneNumberUseCase>(
          GET_CUSTOMER_BY_PHONE_USE_CASE
        );
        const customer = await useCase.execute(phoneNumber);

        console.log("customer:::", customer);
        if (customer) {
          setCurrentCustomer(customer);

          // Determine customer type based on whether customer exists and has current branch
          if (currentBranchId) {
            const hasCurrentBranch = customer.payload.branches.some(
              (branch) => branch.branchId === currentBranchId
            );
            const customerType = hasCurrentBranch
              ? CustomerType.Frequent
              : CustomerType.New;
            setCustomerType(customerType);
          } else {
            // If no current branch, treat as New
            setCustomerType(CustomerType.New);
          }
        } else {
          // If customer doesn't exist, treat as New
          setCustomerType(CustomerType.New);
        }

        return customer;
      } catch (error) {
        console.warn("⚠️ [CustomerContext] getCustomerByPhone failed, treating as new customer:", error);
        
        // For server errors (500), don't show error to user, just treat as new customer
        const errorMessage = error instanceof Error ? error.message : "Failed to get customer by phone";
        
        if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
          console.log("🔄 [CustomerContext] Server error detected, treating as new customer silently");
          setError(null); // Don't show error to user
        } else {
          setError(errorMessage);
        }
        
        // If error occurs, treat as New
        setCustomerType(CustomerType.New);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [
      isInitialized,
      getService,
      setLoading,
      setError,
      setCurrentCustomer,
      setCustomerType,
    ]
  );

  const createCustomer = useCallback(
    async (customerData: CustomerPayload): Promise<Customer | null> => {
      if (!isInitialized) {
        setError("Services not initialized");
        return null;
      }

      setLoading(true);

      try {
        const useCase = await getService<ICreateCustomerUseCase>(
          CREATE_CUSTOMER_USE_CASE
        );
        const customer = await useCase.execute(customerData);

        setCurrentCustomer(customer);

        return customer;
      } catch (error) {
        console.warn("⚠️ [CustomerContext] createCustomer failed:", error);
        
        const errorMessage = error instanceof Error ? error.message : "Failed to create customer";
        
        // For server errors (500), don't show error to user, just return null
        if (errorMessage.includes("500") || errorMessage.includes("Internal Server Error")) {
          console.log("🔄 [CustomerContext] Server error detected, customer creation failed silently");
          setError(null); // Don't show error to user
        } else {
          setError(errorMessage);
        }
        
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, getService, setLoading, setError, setCurrentCustomer]
  );

  const updateCustomer = useCallback(
    async (
      id: string,
      customerData: Partial<CustomerPayload>
    ): Promise<Customer | null> => {
      if (!isInitialized) {
        setError("Services not initialized");
        return null;
      }

      setLoading(true);

      try {
        const useCase = await getService<IUpdateCustomerUseCase>(
          UPDATE_CUSTOMER_USE_CASE
        );
        const customer = await useCase.execute(id, customerData);

        setCurrentCustomer(customer);

        return customer;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update customer";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, getService, setLoading, setError, setCurrentCustomer]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const clearCurrentCustomer = useCallback(() => {
    setCurrentCustomer(null);
    setCustomerType(CustomerType.New);
  }, [setCurrentCustomer, setCustomerType]);

  const contextValue: CustomerContextType = {
    ...state,
    editCustomer,
    getCustomerById,
    getCustomerByPhone,
    createCustomer,
    updateCustomer,
    clearError,
    clearCurrentCustomer,
  };

  return (
    <CustomerContext.Provider value={contextValue}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerContext(): CustomerContextType {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error(
      "useCustomerContext must be used within a CustomerProvider"
    );
  }

  return context;
}
