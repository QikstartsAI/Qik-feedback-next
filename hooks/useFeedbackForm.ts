"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useCustomer } from "@/hooks/useCustomer";
import { useBrand } from "@/hooks/useBrand";
import { useBranch } from "@/hooks/useBranch";
import { useWaiter } from "@/hooks/useWaiter";
import { useFeedback } from "@/hooks/useFeedback";
import { useIncompleteFeedback } from "@/hooks/useIncompleteFeedback";
import { useCompleteFeedback } from "@/hooks/useCompleteFeedback";
import { useBranchSearch } from "@/hooks/useBranchSearch";
import { useGeolocationNew } from "@/hooks/useGeolocationNew";
import { useSearchParams } from "next/navigation";
import { Branch, Feedback, Business, CustomerType } from "@/lib/domain/entities";
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


export function useFeedbackForm() {
  // Hooks
  const { currentCustomer, getCustomerByPhone, customerType, createCustomer } = useCustomer();
  const { currentBrand, getBrandById, loading: brandLoading } = useBrand();
  const { currentBranch, getBranchById, setCurrentBranch, loading: branchLoading } = useBranch();
  const { getWaiterById, loading: waiterLoading } = useWaiter();
  const { sendFeedback, loading: feedbackLoading } = useFeedback();
  const { createIncompleteFeedback } = useIncompleteFeedback();
  const { completeFeedback } = useCompleteFeedback();
  const { getBranchesByBrandId, loading: branchSearchLoading } = useBranchSearch();
  const searchParams = useSearchParams();

  // URL parameters - declare before using in hooks
  const brandId = searchParams.get("id");
  const branchId = searchParams.get("branch");
  const waiterId = searchParams.get("waiter");

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
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [feedbackCompleted, setFeedbackCompleted] = useState(false);
  const [incompleteFeedbackId, setIncompleteFeedbackId] = useState<string | null>(null);
  const [brandBranches, setBrandBranches] = useState<Branch[]>([]);

  const handleRatingSelect = (ratingId: string) => {
    setRating(ratingId);
    // Auto-activate terms when rating is selected
    setAcceptTerms(true);
  };
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
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showBranchSelectionDialog, setShowBranchSelectionDialog] = useState(false);

  // Geolocation hook - memoize business object to avoid initialization issues
  const business: Business | null = useMemo(() => {
    return currentBrand ? {
      HasGeolocation: true,
      sucursales: brandBranches,
    } : null;
  }, [currentBrand, brandBranches]);

  const {
    locationPermission,
    originPosition,
    closestDestination,
    requestLocation,
    grantingPermissions,
    distanceLoading,
    enableGeolocation,
    availableBranches: geolocationBranches,
    getLocation,
    setRequestLocation,
  } = useGeolocationNew(brandId || null, business);

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

  // Load branches when brand is available
  useEffect(() => {
    const loadBrandBranches = async () => {
      if (currentBrand && !branchId && !waiterId) {
        try {
          const branches = await getBranchesByBrandId(currentBrand.id);
          setBrandBranches(branches);
        } catch (error) {
          console.error("Error loading brand branches:", error);
        }
      }
    };

    loadBrandBranches();
  }, [currentBrand, branchId, waiterId, getBranchesByBrandId]);

  // Use real data from services
  const effectiveBrand = currentBrand;
  const effectiveBranch = currentBranch;

  // Handle geolocation logic
  useEffect(() => {
    if (enableGeolocation && effectiveBrand && !currentBranch && !waiterId) {
      // Show location dialog if geolocation is enabled and no specific branch/waiter is selected
      if (!locationPermission && !requestLocation) {
        setShowLocationDialog(true);
      } else if (geolocationBranches.length > 0) {
        setAvailableBranches(geolocationBranches);
        setShowBranchSelectionDialog(true);
      }
    } else if (effectiveBrand && !enableGeolocation) {
      // Use real branches for non-geolocation enabled businesses
      setAvailableBranches(brandBranches);
      setShowBranchSelectionDialog(true);
    }
  }, [enableGeolocation, effectiveBrand, currentBranch, waiterId, locationPermission, requestLocation, geolocationBranches, brandBranches]);

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
        // Use branches already loaded from service
        const filteredBranches = brandBranches.filter(
          (branch) => branch.brandId === currentBrand.id
        );
        setAvailableBranches(filteredBranches);

        if (filteredBranches.length > 0) {
          setShowBranchSelection(true);
        }
      }
    }
  }, [currentBrand, branchId, waiterId, brandBranches]);

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
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(reviewText);
        setCopiedReviewId(reviewId);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = reviewText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setCopiedReviewId(reviewId);
        } catch (fallbackError) {
          console.error("Fallback copy failed: ", fallbackError);
          // Show user-friendly error message
          alert('No se pudo copiar el texto. Por favor, selecciona y copia manualmente.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error("Failed to copy text: ", error);
      // Show user-friendly error message
      alert('No se pudo copiar el texto. Por favor, selecciona y copia manualmente.');
    }
  };

  const handleBranchSelect = (branch: Branch) => {
    setShowBranchSelection(false);
    getBranchById(branch.id);
  };

  const handleFeedbackSubmit = async () => {
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

    try {
      console.log("🔍 Debug rating value:", {
        rating,
        ratingType: typeof rating,
        mappedRating: ratingMap[rating],
        parsedRating: parseInt(rating),
        finalRating: ratingValue
      });

      if (incompleteFeedbackId) {
        // Complete existing incomplete feedback
        console.log("📝 Completing existing feedback:", incompleteFeedbackId);
        
        const completeData = {
          acceptTerms,
          acceptPromotions,
          rate: ratingValue,
          feedback: comment,
          experienceText: comment,
          improve: selectedImprovements,
        };

        const result = await completeFeedback(incompleteFeedbackId, completeData);
        if (result) {
          console.log("✅ Feedback completed successfully:", result.id);
          setFeedbackCompleted(true);
          setCurrentView(VIEWS.THANK_YOU);
        }
      } else {
        // Fallback: create new complete feedback (legacy behavior)
        console.log("⚠️ No incomplete feedback found, creating new complete feedback");
        
        let customerData = currentCustomer;
        
        // If no customer exists, create one
        if (!customerData) {
          console.log("📝 Creating new customer for feedback");
          try {
            const newCustomerPayload = {
              name: firstName,
              lastName: lastName,
              phoneNumber: phone,
              email: "",
              birthDate: new Date("1990-01-01"), // Default birth date
              branches: currentBranch ? [{
                branchId: currentBranch.id,
                acceptPromotions
              }] : []
            };
            
            customerData = await createCustomer(newCustomerPayload);
            
            if (!customerData) {
              console.error("Failed to create customer");
              return;
            }
            
            console.log("✅ Customer created successfully:", customerData.id);
          } catch (error) {
            console.error("Error creating customer:", error);
            return;
          }
        }

        const branchData = currentBranch || (brandBranches.length > 0 ? brandBranches[0] : null);

        if (!branchData) {
          console.error("No branch data available");
          return;
        }

        let originString = referralSource;
        if (referralSource === "social_media" && socialMediaSource) {
          originString = `${referralSource}:${socialMediaSource}`;
        } else if (referralSource === "other" && otherSource) {
          originString = `${referralSource}:${otherSource}`;
        }

        // Check if we have a mock customer and handle it appropriately
        const isMockCustomer = customerData.id.startsWith('mock-');
        
        if (isMockCustomer) {
          console.warn("⚠️ [useFeedbackForm] handleFeedbackSubmit - Detected mock customer, attempting to create real customer first");
          
          try {
            // Try to create a real customer with the current form data
            const realCustomerPayload = {
              name: firstName,
              lastName: lastName,
              phoneNumber: phone,
              email: "",
              birthDate: new Date("1990-01-01"),
              branches: currentBranch ? [{
                branchId: currentBranch.id,
                acceptPromotions
              }] : []
            };
            
            const realCustomer = await createCustomer(realCustomerPayload);
            
            if (realCustomer && !realCustomer.id.startsWith('mock-')) {
              console.log("✅ [useFeedbackForm] handleFeedbackSubmit - Successfully created real customer", realCustomer.id);
              customerData = realCustomer;
            } else {
              console.error("❌ [useFeedbackForm] handleFeedbackSubmit - Failed to create real customer, using mock customer");
            }
          } catch (error) {
            console.error("❌ [useFeedbackForm] handleFeedbackSubmit - Error creating real customer:", error);
          }
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
            status: "complete"
          },
        };

        const result = await sendFeedback(feedbackData);
        console.log("🔍 Debug result:", result);
        if (result) {
          console.log("✅ Feedback sent successfully:", result.id);
          setFeedbackCompleted(true);
          setCurrentView(VIEWS.THANK_YOU);
        } else {
          console.error("❌ Failed to send feedback - no result returned");
          toast.error("No se pudo enviar el feedback. Por favor, inténtalo de nuevo.");
        }
      }
    } catch (error) {
      console.error("Failed to complete feedback:", error);
      toast.error("No se pudo enviar el feedback. Por favor, inténtalo de nuevo.");
    }
  };

  const openGoogleMaps = async () => {
    console.log("🌐 [GoogleReview] openGoogleMaps - Starting");
    
    try {
      if (incompleteFeedbackId) {
        // Complete existing incomplete feedback before going to Google
        console.log("📝 [GoogleReview] Completing feedback before Google Maps:", incompleteFeedbackId);
        
        const completeData = {
          acceptTerms,
          acceptPromotions,
          rate: 5, // Assume positive rating for Google Maps flow
          feedback: comment || "Positive experience - leaving Google review",
          experienceText: comment || "Positive experience - leaving Google review",
          improve: [],
        };

        const result = await completeFeedback(incompleteFeedbackId, completeData);
        console.log("🔍 Debug result:", result);
        if (result) {
          console.log("✅ [GoogleReview] Feedback completed before Google Maps:", result.id);
        } else {
          console.error("❌ [GoogleReview] Failed to complete feedback - no result returned");
          // Don't navigate if feedback completion failed
          return;
        }
      }
      
      console.log("🚀 [GoogleReview] Navigating to Google Maps");
      window.location.href = GOOGLE_REVIEW_URL;
      setFeedbackCompleted(true);
      setCurrentView(VIEWS.THANK_YOU);
      setStep(FORM_STEPS.THANK_YOU);
      
    } catch (error) {
      console.error("❌ [GoogleReview] Failed to complete feedback before Google Maps:", error);
      // Don't navigate if there was an error
      console.log("🚫 [GoogleReview] Navigation cancelled due to error");
      
      // Show user-friendly error message
      toast.error("No se pudo completar el feedback. Por favor, inténtalo de nuevo.");
    }
  };

  const backToWelcome = () => {
    setCurrentView(VIEWS.WELCOME);
    setStep(FORM_STEPS.WELCOME);
  };

  const goToSurvey = async () => {
    // Activate validation errors when user tries to continue
    setShowValidationErrors(true);
    
    // Check if form is valid before proceeding
    if (canContinue) {
      // Create incomplete feedback if not already created
      if (!incompleteFeedbackId) {
        await createInitialIncompleteFeedback();
      }
      
      setCurrentView(VIEWS.SURVEY);
      setStep(FORM_STEPS.SURVEY);
    }
  };

  const createInitialIncompleteFeedback = async () => {
    try {
      // Create temporary customer and branch data if not available
      let customerData = currentCustomer;
      
      // If no customer exists, create one
      if (!customerData) {
        console.log("📝 Creating new customer for incomplete feedback");
        try {
          const newCustomerPayload = {
            name: firstName,
            lastName: lastName,
            phoneNumber: phone,
            email: "",
            birthDate: new Date("1990-01-01"), // Default birth date
            branches: currentBranch ? [{
              branchId: currentBranch.id,
              acceptPromotions
            }] : []
          };
          
          customerData = await createCustomer(newCustomerPayload);
          
          if (!customerData) {
            console.error("Failed to create customer");
            return;
          }
          
          console.log("✅ Customer created successfully:", customerData.id);
        } catch (error) {
          console.error("Error creating customer:", error);
          return;
        }
      }

      const branchData = currentBranch || (brandBranches.length > 0 ? brandBranches[0] : null);

      if (!customerData || !branchData) {
        console.error("Unable to create customer or branch data");
        return;
      }

      let originString = referralSource;
      if (referralSource === "social_media" && socialMediaSource) {
        originString = `${referralSource}:${socialMediaSource}`;
      } else if (referralSource === "other" && otherSource) {
        originString = `${referralSource}:${otherSource}`;
      }

      const incompleteFeedbackData: Partial<Feedback> = {
        id: "",
        updatedAt: new Date(),
        createdAt: new Date(),
        branchId: branchData.id,
        waiterId: currentWaiter?.id,
        customerId: customerData.id,
        payload: {
          acceptTerms: false,
          acceptPromotions,
          customerType: (customerData.payload as any).customerType || "new",
          averageTicket: averageTicket || "0",
          origin: originString,
          feedback: "",
          rate: 0,
          experienceText: "",
          improve: [],
          status: "incomplete"
        }
      };

      const result = await createIncompleteFeedback(incompleteFeedbackData);
      if (result) {
        setIncompleteFeedbackId(result.id);
        console.log("✅ Incomplete feedback created:", result.id);
      }
    } catch (error) {
      console.error("Failed to create incomplete feedback:", error);
    }
  };

  // Geolocation handlers
  const handleShareLocation = () => {
    getLocation();
  };

  const handleViewAllBranches = () => {
    setShowLocationDialog(false);
    setRequestLocation(false);
    // Show all branches instead of just the closest one
    if (brandBranches.length > 0) {
      setAvailableBranches(brandBranches);
      setShowBranchSelectionDialog(true);
    }
  };

  const handleConfirmLocation = (branch: Branch) => {
    setShowLocationDialog(false);
    setRequestLocation(false);
    handleBranchSelect(branch);
  };

  const handleCloseLocationDialog = () => {
    setShowLocationDialog(false);
    setRequestLocation(false);
  };

  const handleBranchSelectFromDialog = (branch: any) => {
    setCurrentBranch(branch);
    setShowBranchSelectionDialog(false);
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
    feedbackCompleted,
    brandBranches,
    branchSearchLoading,

    // Geolocation state
    showLocationDialog,
    showBranchSelectionDialog,
    locationPermission,
    grantingPermissions,
    distanceLoading,
    enableGeolocation,
    closestDestination,

    // Data
    currentCustomer,
    currentBrand: effectiveBrand,
    currentBranch: effectiveBranch,
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
    setRating: handleRatingSelect,
    setComment,
    setAverageTicket,
    handleImprovementSelect,
    handleCopyReview,
    handleBranchSelect,
    setCurrentBranch,
    handleFeedbackSubmit,
    openGoogleMaps,
    backToWelcome,
    goToSurvey,

    // Geolocation handlers
    handleShareLocation,
    handleViewAllBranches,
    handleConfirmLocation,
    handleCloseLocationDialog,
    handleBranchSelectFromDialog,
    setShowBranchSelectionDialog,
    showValidationErrors,

    // Query parameters
    brandId,
    branchId,
    waiterId,
  };
}
