"use client";

import { useState, useEffect } from "react";
import { useCustomer } from "@/hooks/useCustomer";
import { useBrand } from "@/hooks/useBrand";
import { useBranch } from "@/hooks/useBranch";
import { useWaiter } from "@/hooks/useWaiter";
import { useFeedback } from "@/hooks/useFeedback";
import { useSearchParams } from "next/navigation";
import { Branch, Feedback } from "@/lib/domain/entities";
import {
  DEFAULT_COUNTRY_CODE,
  GOOGLE_REVIEW_URL,
  VIEWS,
  FORM_STEPS,
} from "@/lib/utils/constants";
import {
  validatePhone,
  getCountryCodeFromISO,
  countryCodes,
} from "@/lib/utils/phoneUtils";
import {
  calculateDetailedProgress,
  hasGeolocationPower,
  canContinueStep1,
} from "@/lib/utils/formUtils";
import { getAverageTicket } from "@/app/constants/form";

// Mock branches data for branch selection
const mockBranches: Branch[] = [
  {
    id: "branch-1",
    brandId: "brand-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/placeholder-logo.png",
      coverImgURL: "/restaurant-bg.jpg",
      name: "Restaurante El Buen Sabor",
      category: "Restaurante",
      location: {
        address: "Calle 15 #23-45, Neiva, Huila",
        countryCode: "MX",
        geopoint: { lat: 2.9273, lon: -75.2819 },
        googleMapURL: "https://maps.google.com/?q=2.9273,-75.2819",
      },
    },
  },
  {
    id: "branch-2",
    brandId: "brand-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/placeholder-logo.png",
      coverImgURL: "/restaurant-bg.jpg",
      name: "Restaurante El Buen Sabor - Centro",
      category: "Restaurante",
      location: {
        address: "Carrera 5 #18-32, Centro, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.928, lon: -75.2825 },
        googleMapURL: "https://maps.google.com/?q=2.9280,-75.2825",
      },
    },
  },
  {
    id: "branch-3",
    brandId: "brand-2",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    payload: {
      logoImgURL: "/googleqik.png",
      coverImgURL: "/business_icon_cover.jpg",
      name: "Café Delicioso",
      category: "Café",
      location: {
        address: "Avenida 26 #15-67, Neiva, Huila",
        countryCode: "CO",
        geopoint: { lat: 2.9265, lon: -75.28 },
        googleMapURL: "https://maps.google.com/?q=2.9265,-75.2800",
      },
    },
  },
];

export function useFeedbackForm() {
  // Hooks
  const { currentCustomer, getCustomerByPhone, customerType } = useCustomer();
  const { currentBrand, getBrandById, loading: brandLoading } = useBrand();
  const { currentBranch, getBranchById, loading: branchLoading } = useBranch();
  const { getWaiterById, loading: waiterLoading } = useWaiter();
  const { sendFeedback, loading: feedbackLoading } = useFeedback();
  const searchParams = useSearchParams();

  // Form state
  const [currentView, setCurrentView] = useState<
    (typeof VIEWS)[keyof typeof VIEWS]
  >(VIEWS.WELCOME);
  const [step, setStep] = useState<number>(FORM_STEPS.WELCOME);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [acceptPromotions, setAcceptPromotions] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [referralSource, setReferralSource] = useState("");
  const [socialMediaSource, setSocialMediaSource] = useState("");
  const [otherSource, setOtherSource] = useState("");
  const [rating, setRating] = useState<string>("");
  const [comment, setComment] = useState("");
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>(
    []
  );
  const [averageTicket, setAverageTicket] = useState<string>("");
  const [copiedReviewId, setCopiedReviewId] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] =
    useState(DEFAULT_COUNTRY_CODE);
  const [currentWaiter, setCurrentWaiter] = useState<any>(null);
  const [showBranchSelection, setShowBranchSelection] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<any[]>([]);

  // URL parameters
  const brandId = searchParams.get("id");
  const branchId = searchParams.get("branch");
  const waiterId = searchParams.get("waiter");

  // Calculate progress
  const detailedProgress = calculateDetailedProgress({
    phone,
    phoneError,
    firstName,
    lastName,
    referralSource,
    socialMediaSource,
    otherSource,
    selectedCountryCode,
    rating,
    comment,
    acceptTerms,
    acceptPromotions,
  });

  const progress = calculateDetailedProgress({
    phone,
    phoneError,
    firstName,
    lastName,
    referralSource,
    socialMediaSource,
    otherSource,
    selectedCountryCode,
    rating,
    comment,
    acceptTerms,
    acceptPromotions,
  });

  // Fetch data when component mounts or parameters change
  useEffect(() => {
    if (waiterId) {
      const fetchWaiterAndBranch = async () => {
        try {
          const waiter = await getWaiterById(waiterId);
          if (waiter) {
            setCurrentWaiter(waiter);
            await getBranchById(waiter.branchId);
          }
        } catch (error) {
          console.error("Error fetching waiter:", error);
        }
      };
      fetchWaiterAndBranch();
    } else if (branchId) {
      getBranchById(branchId);
    } else if (brandId) {
      getBrandById(brandId);
    }
  }, [waiterId, branchId, brandId, getWaiterById, getBranchById, getBrandById]);

  // Pre-select country based on branch's country code
  useEffect(() => {
    if (currentBranch?.payload?.location?.countryCode) {
      const countryCode = getCountryCodeFromISO(
        currentBranch.payload.location.countryCode
      );
      if (countryCode && countryCode.code !== selectedCountryCode) {
        setSelectedCountryCode(countryCode.code);
        if (phone && phone !== countryCode.code + " ") {
          const currentDigits = phone
            .replace(selectedCountryCode + " ", "")
            .replace(/\D/g, "");
          if (currentDigits) {
            // Reformat phone with new country code
            setPhone(countryCode.code + " " + currentDigits);
          }
        }
      }
    } else if (currentBrand?.payload?.location?.countryCode) {
      const countryCode = getCountryCodeFromISO(
        currentBrand.payload.location.countryCode
      );
      if (countryCode && countryCode.code !== selectedCountryCode) {
        setSelectedCountryCode(countryCode.code);
        if (phone && phone !== countryCode.code + " ") {
          const currentDigits = phone
            .replace(selectedCountryCode + " ", "")
            .replace(/\D/g, "");
          if (currentDigits) {
            setPhone(countryCode.code + " " + currentDigits);
          }
        }
      }
    }
  }, [currentBranch, currentBrand, selectedCountryCode, phone]);

  // Check for geolocation power and handle branch selection
  useEffect(() => {
    if (currentBrand && !branchId && !waiterId) {
      if (hasGeolocationPower(currentBrand)) {
        const brandBranches = mockBranches.filter(
          (branch) => branch.brandId === currentBrand.id
        );
        setAvailableBranches(brandBranches);

        if (brandBranches.length > 0) {
          setShowBranchSelection(true);
        }
      }
    }
  }, [currentBrand, branchId, waiterId]);

  // Update customer data when customer is loaded
  useEffect(() => {
    if (!currentCustomer?.payload) return;
    const { name, lastName } = currentCustomer?.payload;
    setFirstName(name || "");
    setLastName(lastName || "");
  }, [currentCustomer]);

  // Phone validation
  const handlePhoneChange = async (value: string) => {
    setPhone(value);
    const validation = validatePhone(value, selectedCountryCode);
    setPhoneError(validation.error);

    const digitsOnly = value.replace(/\D/g, "");
    const country = countryCodes.find((c) => c.code === selectedCountryCode);
    const expectedLength = country?.phoneLength || 10;

    if (!validation.error && digitsOnly.length === expectedLength) {
      const currentBranchId = currentBranch?.id || branchId || undefined;
      await getCustomerByPhone(digitsOnly, currentBranchId);
    }
  };

  // Form handlers
  const handleSourceSelect = (sourceId: string) => {
    setReferralSource(sourceId);
    if (sourceId !== "social_media") {
      setSocialMediaSource("");
    }
    if (sourceId !== "other") {
      setOtherSource("");
    }
  };

  const handleSocialMediaSelect = (socialMediaId: string) => {
    setSocialMediaSource(socialMediaId);
  };

  const handleImprovementSelect = (improvementId: string) => {
    setSelectedImprovements((prev) => {
      if (prev.includes(improvementId)) {
        return prev.filter((id) => id !== improvementId);
      } else {
        return [...prev, improvementId];
      }
    });
  };

  const handleCopyReview = async (reviewText: string, reviewId: string) => {
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopiedReviewId(reviewId);
      setTimeout(() => {
        setCopiedReviewId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const handleBranchSelect = (branch: Branch) => {
    setShowBranchSelection(false);
    getBranchById(branch.id);
  };

  const handleFeedbackSubmit = async () => {
    // Create temporary customer and branch data if not available
    const customerData = currentCustomer || {
      id: "temp-customer-" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      payload: {
        name: firstName,
        lastName: lastName,
        phoneNumber: phone,
        email: "",
        birthdayDate: "",
        origin: "",
        customerType: "new" as const,
        acceptPromotions,
        lastFeedbackFilled: new Date(),
      },
    };

    const branchData = currentBranch || mockBranches[0];

    if (!customerData || !branchData) {
      console.error("Unable to create customer or branch data");
      return;
    }

    // Map text rating to numeric value
    const ratingMap: { [key: string]: number } = {
      "terrible": 1,
      "bad": 2,
      "regular": 3,
      "good": 4,
      "excellent": 5
    };
    
    const ratingValue = ratingMap[rating] || parseInt(rating) || 0;
    if (ratingValue < 1 || ratingValue > 5) {
      console.error("Invalid rating value:", rating, "mapped to:", ratingValue);
      return;
    }

    let originString = referralSource;
    if (referralSource === "social_media" && socialMediaSource) {
      originString = `${referralSource}:${socialMediaSource}`;
    } else if (referralSource === "other" && otherSource) {
      originString = `${referralSource}:${otherSource}`;
    }

    const feedbackData: Feedback = {
      id: "",
      updatedAt: new Date(),
      createdAt: new Date(),
      branchId: branchData.id,
      waiterId: currentWaiter?.id,
      customerId: customerData.id,
      payload: {
        acceptTerms,
        acceptPromotions,
        customerType: (customerData.payload as any).customerType || "new",
        averageTicket: averageTicket || "0",
        origin: originString,
        feedback: comment,
        rate: ratingValue,
        experienceText: comment,
        improve: selectedImprovements,
      },
    };

    try {
      console.log("🔍 Debug rating value:", {
        rating,
        ratingType: typeof rating,
        mappedRating: ratingMap[rating],
        parsedRating: parseInt(rating),
        finalRating: ratingValue
      });
      
      console.log("📤 Sending feedback with payload:", {
        feedbackData,
        payload: feedbackData.payload,
        customerData: {
          id: customerData.id,
          name: customerData.payload.name,
          lastName: customerData.payload.lastName,
          phoneNumber: customerData.payload.phoneNumber,
          customerType: (customerData.payload as any).customerType || "new",
        },
        branchData: {
          id: branchData.id,
          name: branchData.payload?.name,
        },
        waiterData: currentWaiter ? {
          id: currentWaiter.id,
          name: currentWaiter.payload?.name,
        } : null,
      });
      
      await sendFeedback(feedbackData);
      setCurrentView(VIEWS.THANK_YOU);
    } catch (error) {
      console.error("Failed to send feedback:", error);
    }
  };

  const openGoogleMaps = () => {
    window.open(GOOGLE_REVIEW_URL, "_blank");
    setStep(FORM_STEPS.THANK_YOU);
  };

  const backToWelcome = () => {
    setCurrentView(VIEWS.WELCOME);
    setStep(FORM_STEPS.WELCOME);
  };

  const goToSurvey = () => {
    setCurrentView(VIEWS.SURVEY);
    setStep(FORM_STEPS.SURVEY);
  };

  // Validation
  const canContinue = canContinueStep1(
    firstName,
    phone,
    phoneError,
    referralSource,
    socialMediaSource,
    otherSource,
    selectedCountryCode,
    averageTicket
  );

  return {
    // State
    currentView,
    step,
    firstName,
    lastName,
    phone,
    phoneError,
    acceptPromotions,
    acceptTerms,
    referralSource,
    socialMediaSource,
    otherSource,
    rating,
    comment,
    averageTicket,
    selectedImprovements,
    copiedReviewId,
    selectedCountryCode,
    currentWaiter,
    showBranchSelection,
    availableBranches,
    detailedProgress,
    progress,
    canContinue,

    // Data
    currentCustomer,
    currentBrand,
    currentBranch,
    brandLoading,
    branchLoading,
    waiterLoading,
    feedbackLoading,
    customerType,

    // Handlers
    setFirstName,
    setLastName,
    handlePhoneChange,
    setSelectedCountryCode,
    setAcceptPromotions,
    setAcceptTerms,
    handleSourceSelect,
    handleSocialMediaSelect,
    setOtherSource,
    setRating,
    setComment,
    setAverageTicket,
    handleImprovementSelect,
    handleCopyReview,
    handleBranchSelect,
    handleFeedbackSubmit,
    openGoogleMaps,
    backToWelcome,
    goToSurvey,
  };
}
