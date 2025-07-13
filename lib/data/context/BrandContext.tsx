"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Brand } from "@/lib/domain/entities";
import { IGetBrandByIdUseCase } from "@/lib/domain/usecases";
import { useDependencyInjection } from "@/hooks/useDependencyInjection";
import { GET_BRAND_BY_ID_USE_CASE } from "@/lib/core/di/ServiceIdentifiers";

interface BrandContextState {
  currentBrand: Brand | null;
  loading: boolean;
  error: string | null;
}

interface BrandContextType extends BrandContextState {
  getBrandById: (id: string) => Promise<Brand | null>;
  clearError: () => void;
  clearCurrentBrand: () => void;
}

interface BrandProviderProps {
  children: ReactNode;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function useBrandContext(): BrandContextType {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error("useBrandContext must be used within a BrandProvider");
  }
  return context;
}

export function BrandProvider({ children }: BrandProviderProps) {
  const { getService, isInitialized } = useDependencyInjection();

  const [state, setState] = useState<BrandContextState>({
    currentBrand: null,
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

  const setCurrentBrand = useCallback((brand: Brand | null) => {
    setState((prev) => ({ ...prev, currentBrand: brand }));
  }, []);

  const getBrandById = useCallback(
    async (id: string): Promise<Brand | null> => {
      if (!isInitialized) {
        setError("Services not initialized");
        return null;
      }

      setLoading(true);

      try {
        const useCase = await getService<IGetBrandByIdUseCase>(
          GET_BRAND_BY_ID_USE_CASE
        );
        const brand = await useCase.execute(id);

        setCurrentBrand(brand);

        return brand;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get brand by ID";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, getService, setLoading, setError, setCurrentBrand]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const clearCurrentBrand = useCallback(() => {
    setCurrentBrand(null);
  }, [setCurrentBrand]);

  const contextValue: BrandContextType = {
    ...state,
    getBrandById,
    clearError,
    clearCurrentBrand,
  };

  return (
    <BrandContext.Provider value={contextValue}>
      {children}
    </BrandContext.Provider>
  );
}
