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
        
        // Check if it's an authentication error (401)
        if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
          console.warn("⚠️ [BrandContext] Authentication error (401), creating fallback brand");
          
          // Create a fallback brand to prevent app from breaking
          const fallbackBrand: Brand = {
            id: id,
            createdAt: new Date(),
            updatedAt: new Date(),
            payload: {
              name: "Restaurante",
              description: "Restaurante de prueba",
              category: "Restaurante",
              logo: "/qik.svg",
              primaryColor: "#3B82F6",
              secondaryColor: "#1E40AF",
              website: "",
              socialMedia: {
                instagram: "",
                facebook: "",
                tiktok: "",
                whatsapp: ""
              },
              settings: {
                allowAnonymousFeedback: true,
                requirePhoneNumber: true,
                showSocialMediaOptions: true,
                enableGeolocation: true,
                enableWaiterSelection: true,
                enableBranchSelection: true,
                enableRating: true,
                enableComments: true,
                enableImprovementSuggestions: true,
                enableReferralSource: true,
                enablePromotions: true,
                enableTermsAndConditions: true,
                maxCommentLength: 500,
                minRating: 1,
                maxRating: 5,
                defaultCountryCode: "+593",
                supportedCountries: ["+593", "+54", "+57", "+52", "+1"],
                businessHours: {
                  monday: { open: "09:00", close: "22:00", isOpen: true },
                  tuesday: { open: "09:00", close: "22:00", isOpen: true },
                  wednesday: { open: "09:00", close: "22:00", isOpen: true },
                  thursday: { open: "09:00", close: "22:00", isOpen: true },
                  friday: { open: "09:00", close: "22:00", isOpen: true },
                  saturday: { open: "09:00", close: "22:00", isOpen: true },
                  sunday: { open: "09:00", close: "22:00", isOpen: true }
                }
              }
            }
          };
          
          setCurrentBrand(fallbackBrand);
          setError(null); // Don't show error to user
          return fallbackBrand;
        }
        
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
