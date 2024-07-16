import { create } from "zustand";

interface FormState {
  rating: null | string;
  setRating: (rating: null | string) => void;
  isSubmitted: boolean;
  setIsSubmitted: (isSubmitted: boolean) => void;
  business: BusinessI | BusinessSucursalI | null;
  setBusiness: (business: BusinessI | BusinessSucursalI | null) => void;
  showBusinessSelector: boolean;
  setShowBusinessSelector: (showBusinessSelect: boolean) => void;
}

export const useFormStore = create<FormState>()((set) => ({
  rating: null,
  setRating: (rating: null | string) => set({ rating }),
  isSubmitted: false,
  setIsSubmitted: (isSubmitted: boolean) => set({ isSubmitted }),
  business: null,
  setBusiness: (business: BusinessI | BusinessSucursalI | null) =>
    set({ business }),
  showBusinessSelector: false,
  setShowBusinessSelector: (showBusinessSelector) =>
    set({ showBusinessSelector }),
}));
