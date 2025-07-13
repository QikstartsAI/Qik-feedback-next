export const calculateProgress = (step: number, totalSteps: number): number => {
  return (step / totalSteps) * 100;
};

export const isPositiveRating = (rating: string): boolean => {
  return rating === "good" || rating === "excellent";
};

export const getBranchInfo = (branch: any) => {
  return {
    name: branch?.payload?.name || "Restaurante",
    logo: branch?.payload?.logo || "/logo.png",
    coverImage: branch?.payload?.coverImgURL || "/restaurant-bg.jpg",
    address: branch?.payload?.address || "Ubicación",
  };
};

export const canContinueStep1 = (
  name: string,
  phone: string,
  phoneError: string,
  referralSource: string
): boolean => {
  return Boolean(name && phone && !phoneError && referralSource);
};

export const canSubmitFeedback = (
  rating: string,
  acceptTerms: boolean
): boolean => {
  return Boolean(rating && acceptTerms);
};
