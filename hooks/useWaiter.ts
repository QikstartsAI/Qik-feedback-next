import { useState, useCallback } from "react";
import { useDependencyInjection } from "./useDependencyInjection";
import { GetWaiterByIdUseCase } from "@/lib/domain/usecases";
import { Waiter } from "@/lib/domain/entities";
import { GET_WAITER_BY_ID_USE_CASE } from "@/lib/core/di/ServiceIdentifiers";

export const useWaiter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getService } = useDependencyInjection();

  const getWaiterById = useCallback(
    async (id: string): Promise<Waiter | null> => {
      setLoading(true);
      setError(null);

      try {
        const getWaiterByIdUseCase = await getService<GetWaiterByIdUseCase>(
          GET_WAITER_BY_ID_USE_CASE
        );
        const waiter = await getWaiterByIdUseCase.execute(id);
        return waiter;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get waiter";
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
    getWaiterById,
    loading,
    error,
    clearError,
  };
};
