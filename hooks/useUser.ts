import { useState, useCallback } from "react";
import { useDependencyInjection } from "./useDependencyInjection";
import { GetUserByIdUseCase } from "@/lib/domain/usecases";
import { User } from "@/lib/domain/entities";

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getService } = useDependencyInjection();

  const getUserById = useCallback(
    async (id: string): Promise<User | null> => {
      setLoading(true);
      setError(null);

      try {
        const getUserByIdUseCase = await getService<GetUserByIdUseCase>(
          "GetUserByIdUseCase"
        );
        const user = await getUserByIdUseCase.execute(id);
        return user;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get user";
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
    getUserById,
    loading,
    error,
    clearError,
  };
};
