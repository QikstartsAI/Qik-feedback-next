import { useCallback, useEffect, useState } from "react";
import { ServiceLocator } from "@/lib/core/di";
import { ServiceRegistry } from "@/lib/core/di";

export function useDependencyInjection() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize services if not already done
    if (!isInitialized) {
      ServiceRegistry.initialize();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const getService = useCallback(async <T>(identifier: any): Promise<T> => {
    return ServiceRegistry.getService<T>(identifier);
  }, []);

  const isServiceRegistered = useCallback(<T>(identifier: any): boolean => {
    return ServiceRegistry.isServiceRegistered<T>(identifier);
  }, []);

  return {
    getService,
    isServiceRegistered,
    isInitialized,
  };
}
