import { countryCodes } from "./phoneUtils";

export const calculateProgress = (step: number, totalSteps: number): number => {
  return (step / totalSteps) * 100;
};

// New function to calculate detailed progress based on question completion
export const calculateDetailedProgress = (formData: {
  phone: string;
  phoneError: string;
  firstName: string;
  lastName: string;
  referralSource: string;
  socialMediaSource: string;
  otherSource: string;
  selectedCountryCode: string;
  rating: string;
  comment: string;
  acceptTerms: boolean;
  acceptPromotions: boolean;
}): {
  progress: number;
  completedQuestions: number;
  totalQuestions: number;
  questionProgress: Array<{
    id: string;
    label: string;
    completed: boolean;
    required: boolean;
  }>;
} => {
  const questions = [
    {
      id: "phone",
      label: "Número de teléfono",
      completed: Boolean(
        formData.phone &&
          !formData.phoneError &&
          (() => {
            const phoneDigits = formData.phone
              .replace(formData.selectedCountryCode + " ", "")
              .replace(/\D/g, "");
            const country = countryCodes.find(
              (c) => c.code === formData.selectedCountryCode
            );
            const expectedLength = country?.phoneLength || 10;
            return phoneDigits.length === expectedLength;
          })()
      ),
      required: true,
    },
    {
      id: "name",
      label: "Nombre",
      completed: Boolean(
        formData.firstName && formData.firstName.trim().length > 0
      ),
      required: false,
    },
    {
      id: "referralSource",
      label: "¿De dónde nos conoces?",
      completed: Boolean(formData.referralSource),
      required: true,
    },
    {
      id: "socialMediaSource",
      label: "Red social específica",
      completed:
        formData.referralSource === "social_media"
          ? Boolean(formData.socialMediaSource)
          : true,
      required: formData.referralSource === "social_media",
    },
    {
      id: "otherSource",
      label: "Otro origen",
      completed:
        formData.referralSource === "other"
          ? Boolean(
              formData.otherSource && formData.otherSource.trim().length > 0
            )
          : true,
      required: formData.referralSource === "other",
    },
    {
      id: "rating",
      label: "Calificación",
      completed: Boolean(formData.rating),
      required: true,
    },
    {
      id: "comment",
      label: "Comentario",
      completed: Boolean(
        formData.comment && formData.comment.trim().length > 0
      ),
      required: false, // Will be dynamically set based on rating
    },
    {
      id: "terms",
      label: "Términos y condiciones",
      completed: formData.acceptTerms,
      required: true,
    },
  ];

  const requiredQuestions = questions.filter((q) => q.required);
  const completedRequired = requiredQuestions.filter((q) => q.completed).length;
  const totalRequired = requiredQuestions.length;

  const progress =
    totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 0;

  return {
    progress,
    completedQuestions: completedRequired,
    totalQuestions: totalRequired,
    questionProgress: questions,
  };
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
  socialMediaSource: string,
  otherSource: string,
  selectedCountryCode: string,
  averageTicket: string
): boolean => {
  // Check if phone number is complete for the selected country
  const phoneDigits = phone
    .replace(selectedCountryCode + " ", "")
    .replace(/\D/g, "");
  const country = countryCodes.find((c) => c.code === selectedCountryCode);
  const expectedLength = country?.phoneLength || 10;
  const isPhoneComplete = phoneDigits.length === expectedLength;

  // Check if referral source is selected
  const hasReferralSource = Boolean(referralSource);

  // Check conditional validation
  let hasValidSubSelection = true;
  if (referralSource === "social_media") {
    hasValidSubSelection = Boolean(socialMediaSource);
  } else if (referralSource === "other") {
    hasValidSubSelection = Boolean(
      otherSource && otherSource.trim().length > 0
    );
  }

  return Boolean(
    name &&
      phone &&
      !phoneError &&
      hasReferralSource &&
      hasValidSubSelection &&
      isPhoneComplete &&
      averageTicket
  );
};

export const canSubmitFeedback = (
  rating: string,
  acceptTerms: boolean
): boolean => {
  return Boolean(rating && acceptTerms);
};
