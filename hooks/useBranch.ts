import { useCallback } from "react";
import { Branch } from "@/lib/domain/entities";
import { useBranchContext } from "@/lib/data/context";

export interface UseBranchReturn {
  // State
  currentBranch: Branch | null;
  loading: boolean;
  error: string | null;

  // Actions
  getBranchById: (id: string) => Promise<Branch | null>;
  setCurrentBranch: (branch: Branch | null) => void;

  // Utility functions
  clearError: () => void;
  clearCurrentBranch: () => void;
}

/**
 * Custom hook for branch operations
 * Provides easy access to all branch-related functionality
 */
export function useBranch(): UseBranchReturn {
  const context = useBranchContext();

  return {
    // State
    currentBranch: context.currentBranch,
    loading: context.loading,
    error: context.error,

    // Actions
    getBranchById: context.getBranchById,
    setCurrentBranch: context.setCurrentBranch,

    // Utility functions
    clearError: context.clearError,
    clearCurrentBranch: context.clearCurrentBranch,
  };
}

/**
 * Hook for branch search operations
 */
export function useBranchSearch() {
  const { getBranchById, loading, error, clearError } = useBranch();

  const searchById = useCallback(
    async (id: string): Promise<Branch | null> => {
      clearError();
      return await getBranchById(id);
    },
    [getBranchById, clearError]
  );

  return {
    searchById,
    loading,
    error,
    clearError,
  };
}
