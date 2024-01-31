import { create } from "zustand";

interface FormState {
  rating: null | string;
  setRating: (rating: null | string) => void;
  isSubmitted: boolean;
  setIsSubmitted: (isSubmitted: boolean) => void;
}

export const useFormStore = create<FormState>()((set) => ({
  rating: null,
  setRating: (rating: null | string) => set({ rating }),
  isSubmitted: false,
  setIsSubmitted: (isSubmitted: boolean) => set({ isSubmitted }),
}));
