import { useCallback, useState } from "react";
import { Branch } from "@/lib/domain/entities";
import { useDependencyInjection } from "@/hooks/useDependencyInjection";
import { BRANCH_REPOSITORY } from "@/lib/core/di/ServiceIdentifiers";
import { BranchRepository } from "@/lib/domain/repositories/iBranchRepository";

export function useBranchSearch() {
  const { getService, isInitialized } = useDependencyInjection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBranchesByBrandId = useCallback(
    async (brandId: string): Promise<Branch[]> => {
      if (!isInitialized) {
        setError("Services not initialized");
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const repository = await getService<BranchRepository>(BRANCH_REPOSITORY);
        const branches = await repository.getBranchesByBrandId(brandId);
        return branches;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch branches";
        setError(errorMessage);
        console.error("Error fetching branches by brand ID:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, getService]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    getBranchesByBrandId,
    loading,
    error,
    clearError,
  };
}
