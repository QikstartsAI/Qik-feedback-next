import { useState, useCallback } from "react";
import { useDependencyInjection } from "./useDependencyInjection";
import { GetBrandByIdUseCase } from "@/lib/domain/usecases";
import { Brand } from "@/lib/domain/entities";

export const useBrand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getService } = useDependencyInjection();

  const getBrandById = useCallback(
    async (id: string): Promise<Brand | null> => {
      setLoading(true);
      setError(null);

      try {
        const getBrandByIdUseCase = await getService<GetBrandByIdUseCase>(
          "GetBrandByIdUseCase"
        );
        const brand = await getBrandByIdUseCase.execute(id);
        return brand;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get brand";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getService]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    getBrandById,
    loading,
    error,
    clearError,
  };
};
