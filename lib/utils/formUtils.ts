import { countryCodes } from "./phoneUtils";

export const calculateProgress = (step: number, totalSteps: number): number => {
  return (step / totalSteps) * 100;
};

export const isPositiveRating = (rating: string): boolean => {
  return rating === "good" || rating === "excellent";
};

export const getBranchInfo = (branch: any) => {
  return {
    name: branch?.payload?.name || "Restaurante",
    logo: branch?.payload?.logoImgURL || "/logo.png",
    coverImage: branch?.payload?.coverImgURL || "/restaurant-bg.jpg",
    address: branch?.payload?.location?.address || "Ubicación",
  };
};

export const getBrandInfo = (brand: any) => {
  return {
    name: brand?.payload?.name || "Restaurante",
    logo: brand?.payload?.logoImgURL || "/logo.png",
    coverImage: brand?.payload?.coverImgURL || "/restaurant-bg.jpg",
    address: brand?.payload?.location?.address || "Ubicación",
  };
};

export const hasGeolocationPower = (brand: any): boolean => {
  return brand?.payload?.powers?.includes("GEOLOCATION") || false;
};

export const canContinueStep1 = (
  name: string,
  phone: string,
  phoneError: string,
  referralSource: string,
  selectedCountryCode: string
): boolean => {
  // Check if phone number is complete for the selected country
  const phoneDigits = phone
    .replace(selectedCountryCode + " ", "")
    .replace(/\D/g, "");
  const country = countryCodes.find((c) => c.code === selectedCountryCode);
  const expectedLength = country?.phoneLength || 10;
  const isPhoneComplete = phoneDigits.length === expectedLength;

  return Boolean(
    name && phone && !phoneError && referralSource && isPhoneComplete
  );
};

export const canSubmitFeedback = (
  rating: string,
  acceptTerms: boolean
): boolean => {
  return Boolean(rating && acceptTerms);
};
