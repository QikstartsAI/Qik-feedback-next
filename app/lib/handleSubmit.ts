import {
  COLLECTION_NAME,
  CUSTOMERS_COLLECTION_NAME,
} from "@/app/constants/general";
import { getFirebase, getTimesTampFromDate } from "@/app/lib/firebase";
import { Waiter } from "@/app/types/business";
import { FeedbackProps } from "@/app/validators/feedbackSchema";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { findBusiness } from "../services/business";
import { Customer } from "../types/customer";
import { findCustomerDataByEmail } from "./handleEmail";

const formattedName = (name: string | null) => {
  console.log("=== DEBUG: formattedName ===");
  console.log("Input name:", name);
  console.log("Formatted result:", name ?? "");
  return name ?? "";
};

const handleSubmitFeedback = async (
  {
    FullName,
    ImproveText,
    Origin,
    PhoneNumber,
    Rating,
    StartTime,
    Dinners,
    AverageTicket,
    PaymentMethod,
    Email,
    AcceptPromotions,
    AcceptTerms,
    BirthdayDate,
  }: FeedbackProps,
  Improve: string[],
  customerType: string,
  AttendedBy: string,
  customerNumberOfVisits: number,
  feedbackNumberOfVisit: number,
  businessId: string | null,
  branchId: string | null,
  waiterId: string | null
) => {
  console.log("=== DEBUG: handleSubmitFeedback START ===");
  console.log("Parameters received:", {
    businessId,
    branchId,
    waiterId,
    Email,
    FullName,
    Rating
  });

  const searchParams = new URLSearchParams(document.location.search);

  const customerContactData: Customer = {
    email: Email,
    name: FullName,
    phoneNumber: PhoneNumber || "",
    birthdayDate: BirthdayDate || "",
    origin: Origin || "",
    customerType: customerType || "",
    acceptPromotions: !PhoneNumber ? false : true,
    lastFeedbackFilled: getTimesTampFromDate(new Date()),
  };

  const formattedId = formattedName(businessId);
  console.log("formattedId:", formattedId);

  const businessFeedbackRef = collection(
    getFirebase().db,
    COLLECTION_NAME || "",
    formattedId,
    "customers",
    Email,
    "feedbacks"
  );

  const businessCustomerRef = collection(
    getFirebase().db,
    COLLECTION_NAME || "",
    formattedId,
    "customers"
  );
  const businessDocRef = doc(
    getFirebase().db,
    COLLECTION_NAME || "",
    formattedId
  );

  console.log("Firebase references:", {
    businessFeedbackRef: businessFeedbackRef.path,
    businessCustomerRef: businessCustomerRef.path,
    businessDocRef: businessDocRef.path
  });

  const feedbaackData = {
    CreationDate: getTimesTampFromDate(new Date()),
    FullName,
    AcceptPromotions,
    AcceptTerms,
    Improve,
    ImproveText,
    Origin,
    PhoneNumber: PhoneNumber || "",
    Rating: parseInt(Rating),
    StartTime: getTimesTampFromDate(StartTime),
    Dinners,
    AverageTicket,
    PaymentMethod,
    Email,
    BirthdayDate: BirthdayDate
      ? getTimesTampFromDate(new Date(BirthdayDate))
      : null,
    AttendedBy,
  };

  console.log("=== DEBUG: Checking conditional logic ===");
  console.log("Condition 1 (waiterId && businessId && !branchId):", waiterId && businessId && !branchId);
  console.log("Condition 2 (waiterId && businessId && branchId):", waiterId && businessId && branchId);
  console.log("Condition 3 (isRealBranch && !waiterId):", (branchId && branchId !== businessId) && !waiterId);
  console.log("Condition 4 (businessId && !waiterId):", businessId && !waiterId);

  if (waiterId && businessId && !branchId) {
    console.log("=== DEBUG: Executing Case 1 - Waiter in business principal ===");
    try {
      const waiterFeedbackRef = collection(
        getFirebase().db,
        COLLECTION_NAME || "",
        formattedId,
        "meseros",
        waiterId || "",
        "customers",
        Email,
        "feedbacks"
      );
      const waiterCustomerRef = collection(
        getFirebase().db,
        COLLECTION_NAME || "",
        formattedId,
        "meseros",
        waiterId || "",
        "customers"
      );
      const waitersRef = doc(
        collection(businessDocRef, "meseros"),
        waiterId || ""
      );
      console.log("Waiter references:", {
        waiterFeedbackRef: waiterFeedbackRef.path,
        waiterCustomerRef: waiterCustomerRef.path,
        waitersRef: waitersRef.path
      });

      const waitersDocSnap = await getDoc(waitersRef);
      const waiterData = waitersDocSnap.data() as Waiter;
      const latestSum = waiterData.latestSum || 0;
      const numberOfSurveys = waiterData.numberOfSurveys || 0;
      let waiterRating = waiterData.ratingAverage || 0;
      if (latestSum > 0) {
        waiterRating = latestSum + parseInt(Rating);
      } else {
        waiterRating += parseInt(Rating);
      }
      const ratingAverage = (waiterRating / (numberOfSurveys + 1)).toFixed(1);
      const customerRef = doc(waiterCustomerRef, Email);
      console.log("Attempting to save waiter feedback...");
      await setDoc(customerRef, customerContactData);
      await addDoc(waiterFeedbackRef, feedbaackData);

      await updateDoc(waitersRef, {
        numberOfSurveys: numberOfSurveys + 1,
        latestSum: waiterRating,
        ratingAverage,
      });
      console.log("Waiter feedback saved successfully");
    } catch (err) {
      console.error("Error saving waiter feedback:", err);
    }
  } else if (waiterId && businessId && branchId) {
    console.log("=== DEBUG: Executing Case 2 - Waiter in branch ===");
    try {
      const waiterFeedbackRef = collection(
        getFirebase().db,
        COLLECTION_NAME || "",
        formattedId,
        "sucursales",
        branchId || "",
        "meseros",
        waiterId || "",
        "customers",
        Email,
        "feedbacks"
      );
      const waiterBranchCustomerRef = collection(
        getFirebase().db,
        COLLECTION_NAME || "",
        formattedId,
        "sucursales",
        branchId || "",
        "meseros",
        waiterId || "",
        "customers"
      );
      const branchDocRef = doc(
        collection(businessDocRef, "sucursales"),
        branchId || ""
      );
      const waitersRef = doc(
        collection(branchDocRef, "meseros"),
        waiterId || ""
      );
      console.log("Branch waiter references:", {
        waiterFeedbackRef: waiterFeedbackRef.path,
        waiterBranchCustomerRef: waiterBranchCustomerRef.path,
        waitersRef: waitersRef.path
      });

      const waitersDocSnap = await getDoc(waitersRef);
      const waiterData = waitersDocSnap.data() as Waiter;
      const latestSum = waiterData.latestSum || 0;
      const numberOfSurveys = waiterData.numberOfSurveys || 0;
      let waiterRating = waiterData.ratingAverage || 0;
      if (latestSum > 0) {
        waiterRating = latestSum + parseInt(Rating);
      } else {
        waiterRating += parseInt(Rating);
      }
      const ratingAverage = (waiterRating / (numberOfSurveys + 1)).toFixed(1);
      const customerRef = doc(waiterBranchCustomerRef, Email);
      console.log("Attempting to save branch waiter feedback...");
      await setDoc(customerRef, customerContactData);
      await addDoc(waiterFeedbackRef, feedbaackData);
      await updateDoc(waitersRef, {
        numberOfSurveys: numberOfSurveys + 1,
        latestSum: waiterRating,
        ratingAverage,
      });
      console.log("Branch waiter feedback saved successfully");
    } catch (err) {
      console.error("Error saving branch waiter feedback:", err);
    }
  }

  try {
    console.log("=== DEBUG: Executing main storage logic ===");
    
    // Check if branchId is actually a real branch (not the business principal ID)
    const isRealBranch = branchId && branchId !== businessId;
    
    console.log("=== DEBUG: Branch vs Business Principal Check ===");
    console.log("branchId:", branchId);
    console.log("businessId:", businessId);
    console.log("isRealBranch:", isRealBranch);
    
    if (isRealBranch && !waiterId) {
      console.log("=== DEBUG: Executing Case 3 - Branch feedback (no waiter) ===");
      const branchFeedbackRef = collection(
        getFirebase().db,
        COLLECTION_NAME || "",
        formattedId,
        "sucursales",
        branchId || "",
        "customers",
        Email,
        "feedbacks"
      );
      const branchCustomerRef = collection(
        getFirebase().db,
        COLLECTION_NAME || "",
        formattedId,
        "sucursales",
        branchId || "",
        "customers"
      );
      console.log("Branch references:", {
        branchFeedbackRef: branchFeedbackRef.path,
        branchCustomerRef: branchCustomerRef.path
      });

      const customerRef = doc(branchCustomerRef, Email);
      console.log("Attempting to save branch feedback...");
      await setDoc(customerRef, customerContactData);
      await addDoc(branchFeedbackRef, feedbaackData);
      console.log("Branch feedback saved successfully");
    } else if (businessId && !waiterId) {
      console.log("=== DEBUG: Executing Case 4 - Business principal feedback (casa matriz) ===");
      console.log("This is the case for casa matriz - should create customers collection in business principal");
      
      const customerRef = doc(businessCustomerRef, Email);
      console.log("Business customer reference:", customerRef.path);
      console.log("Attempting to save business principal feedback...");
      console.log("Customer data to save:", customerContactData);
      console.log("Feedback data to save:", feedbaackData);
      
      try {
        await setDoc(customerRef, customerContactData);
        console.log("Customer data saved successfully");
        await addDoc(businessFeedbackRef, feedbaackData);
        console.log("Feedback data saved successfully");
        console.log("=== SUCCESS: Casa matriz feedback stored correctly ===");
      } catch (error) {
        console.error("Error saving casa matriz feedback:", error);
        console.error("Error details:", {
          errorCode: (error as any)?.code,
          errorMessage: (error as any)?.message,
          errorStack: (error as any)?.stack
        });
      }
    } else {
      console.log("=== DEBUG: No matching condition found ===");
      console.log("This should not happen - check the conditional logic");
    }

    console.log("=== DEBUG: Executing parent customer storage ===");
    const parentCustomerDataRef = collection(
      getFirebase().db,
      CUSTOMERS_COLLECTION_NAME || ""
    );
    const parentCustomerBusinessRef = collection(
      getFirebase().db,
      CUSTOMERS_COLLECTION_NAME || "",
      Email,
      "business"
    );

    const businessData = await findBusiness(businessId);
    const customerData = await findCustomerDataByEmail(Email);

    let creationDate = customerData?.creationDate;

    const customerDoc = doc(parentCustomerDataRef, Email);
    const businessDoc = doc(parentCustomerBusinessRef, formattedId);

    if (!customerData?.creationDate) {
      creationDate = getTimesTampFromDate(new Date());
    }

    console.log("Saving to parent customer collections...");
    await setDoc(customerDoc, customerContactData);
    if (customerData) {
      await setDoc(businessDoc, {
        ...businessData,
        customerType: customerData?.customerType,
        lastFeedbackFilled: customerData?.lastFeedbackFilled,
        acceptPromotions: customerData?.acceptPromotions,
        lastOrigin: customerData?.origin,
        customerNumberOfVisits,
        creationDate,
      });
    } else {
      await setDoc(businessDoc, {
        ...businessData,
        customerType: customerType,
        lastFeedbackFilled: getTimesTampFromDate(new Date()),
        acceptPromotions: AcceptPromotions,
        lastOrigin: Origin,
        customerNumberOfVisits,
        creationDate,
      });
    }

    const customerBusinessFeedbackRef = collection(
      getFirebase().db,
      CUSTOMERS_COLLECTION_NAME || "",
      Email,
      "business",
      formattedId,
      "feedbacks"
    );
    const businessFeedbackDoc = doc(customerBusinessFeedbackRef);
    await setDoc(businessFeedbackDoc, {
      ...feedbaackData,
      feedbackNumberOfVisit,
    });
    console.log("Parent customer data saved successfully");
  } catch (err) {
    console.error("=== ERROR: Main storage logic failed ===", err);
    console.error("Error details:", {
      errorCode: (err as any)?.code,
      errorMessage: (err as any)?.message,
      errorStack: (err as any)?.stack
    });
  }
  
  console.log("=== DEBUG: handleSubmitFeedback END ===");
};

export default handleSubmitFeedback;
export { formattedName };
