import React, { createContext, useContext, useEffect, useState } from "react";
import { ServiceRegistry } from "@/lib/core/di";

interface DependencyInjectionContextType {
  isInitialized: boolean;
  getService: <T>(identifier: any) => Promise<T>;
  isServiceRegistered: <T>(identifier: any) => boolean;
}

const DependencyInjectionContext =
  createContext<DependencyInjectionContextType | null>(null);

interface DependencyInjectionProviderProps {
  children: React.ReactNode;
}

export function DependencyInjectionProvider({
  children,
}: DependencyInjectionProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize the service registry
    ServiceRegistry.initialize();
    setIsInitialized(true);
  }, []);

  const getService = async <T,>(identifier: any): Promise<T> => {
    return ServiceRegistry.getService<T>(identifier);
  };

  const isServiceRegistered = <T,>(identifier: any): boolean => {
    return ServiceRegistry.isServiceRegistered<T>(identifier);
  };

  const value: DependencyInjectionContextType = {
    isInitialized,
    getService,
    isServiceRegistered,
  };

  return (
    <DependencyInjectionContext.Provider value={value}>
      {children}
    </DependencyInjectionContext.Provider>
  );
}

export function useDependencyInjection(): DependencyInjectionContextType {
  const context = useContext(DependencyInjectionContext);
  if (!context) {
    throw new Error(
      "useDependencyInjection must be used within a DependencyInjectionProvider"
    );
  }
  return context;
}
