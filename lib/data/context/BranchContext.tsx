"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Branch } from "@/lib/domain/entities";
import { IGetBranchByIdUseCase } from "@/lib/domain/usecases";
import { useDependencyInjection } from "@/hooks/useDependencyInjection";
import { GET_BRANCH_BY_ID_USE_CASE } from "@/lib/core/di/ServiceIdentifiers";

interface BranchContextState {
  currentBranch: Branch | null;
  loading: boolean;
  error: string | null;
}

interface BranchContextActions {
  getBranchById: (id: string) => Promise<Branch | null>;
  clearError: () => void;
  clearCurrentBranch: () => void;
}

interface BranchContextType extends BranchContextState, BranchContextActions {}

const BranchContext = createContext<BranchContextType | null>(null);

interface BranchProviderProps {
  children: ReactNode;
}

export function BranchProvider({ children }: BranchProviderProps) {
  const { getService, isInitialized } = useDependencyInjection();

  const [state, setState] = useState<BranchContextState>({
    currentBranch: null,
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

  const setCurrentBranch = useCallback((branch: Branch | null) => {
    setState((prev) => ({ ...prev, currentBranch: branch }));
  }, []);

  const getBranchById = useCallback(
    async (id: string): Promise<Branch | null> => {
      if (!isInitialized) {
        setError("Services not initialized");
        return null;
      }

      setLoading(true);

      try {
        const useCase = await getService<IGetBranchByIdUseCase>(
          GET_BRANCH_BY_ID_USE_CASE
        );
        const branch = await useCase.execute(id);

        setCurrentBranch(branch);

        return branch;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to get branch by ID";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, getService, setLoading, setError, setCurrentBranch]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const clearCurrentBranch = useCallback(() => {
    setCurrentBranch(null);
  }, [setCurrentBranch]);

  const contextValue: BranchContextType = {
    ...state,
    getBranchById,
    clearError,
    clearCurrentBranch,
  };

  return (
    <BranchContext.Provider value={contextValue}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranchContext(): BranchContextType {
  const context = useContext(BranchContext);

  if (!context) {
    throw new Error("useBranchContext must be used within a BranchProvider");
  }

  return context;
}
