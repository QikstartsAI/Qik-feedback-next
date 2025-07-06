import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Customer, CustomerPayload } from "@/lib/domain/entities";
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
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

interface CustomerContextActions {
  getCustomerById: (id: string) => Promise<Customer | null>;
  getCustomerByPhone: (phoneNumber: string) => Promise<Customer | null>;
  createCustomer: (customerData: CustomerPayload) => Promise<Customer | null>;
  updateCustomer: (
    id: string,
    customerData: Partial<CustomerPayload>
  ) => Promise<Customer | null>;
  clearError: () => void;
  clearCurrentCustomer: () => void;
  clearCustomers: () => void;
}

interface CustomerContextType
  extends CustomerContextState,
    CustomerContextActions {}

const CustomerContext = createContext<CustomerContextType | null>(null);

interface CustomerProviderProps {
  children: ReactNode;
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const { getService, isInitialized } = useDependencyInjection();

  const [state, setState] = useState<CustomerContextState>({
    currentCustomer: null,
    customers: [],
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

  const addCustomerToList = useCallback((customer: Customer) => {
    setState((prev) => ({
      ...prev,
      customers: prev.customers.some((c) => c.id === customer.id)
        ? prev.customers.map((c) => (c.id === customer.id ? customer : c))
        : [...prev.customers, customer],
    }));
  }, []);

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
        addCustomerToList(customer);

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
    [
      isInitialized,
      getService,
      setLoading,
      setError,
      setCurrentCustomer,
      addCustomerToList,
    ]
  );

  const getCustomerByPhone = useCallback(
    async (phoneNumber: string): Promise<Customer | null> => {
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

        if (customer) {
          setCurrentCustomer(customer);
          addCustomerToList(customer);
        }

        return customer;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to get customer by phone";
        setError(errorMessage);
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
      addCustomerToList,
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
        addCustomerToList(customer);

        return customer;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create customer";
        setError(errorMessage);
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
      addCustomerToList,
    ]
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
        addCustomerToList(customer);

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
    [
      isInitialized,
      getService,
      setLoading,
      setError,
      setCurrentCustomer,
      addCustomerToList,
    ]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const clearCurrentCustomer = useCallback(() => {
    setCurrentCustomer(null);
  }, [setCurrentCustomer]);

  const clearCustomers = useCallback(() => {
    setState((prev) => ({ ...prev, customers: [] }));
  }, []);

  const contextValue: CustomerContextType = {
    ...state,
    getCustomerById,
    getCustomerByPhone,
    createCustomer,
    updateCustomer,
    clearError,
    clearCurrentCustomer,
    clearCustomers,
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
