import { useCallback } from "react";
import { Brand } from "@/lib/domain/entities";
import { useBrandContext } from "@/lib/data/context/BrandContext";

/**
 * Custom hook for brand operations
 * Provides easy access to all brand-related functionality
 */
export function useBrand() {
  const context = useBrandContext();

  return {
    // State
    currentBrand: context.currentBrand,
    loading: context.loading,
    error: context.error,

    // Actions
    getBrandById: context.getBrandById,

    // Utility functions
    clearError: context.clearError,
    clearCurrentBrand: context.clearCurrentBrand,
  };
}

/**
 * Hook for brand search operations
 */
export function useBrandSearch() {
  const { getBrandById, loading, error, clearError } = useBrand();

  const searchById = useCallback(
    async (id: string): Promise<Brand | null> => {
      clearError();
      return await getBrandById(id);
    },
    [getBrandById, clearError]
  );

  return {
    searchById,
    loading,
    error,
    clearError,
  };
}
