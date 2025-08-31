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

const formattedName = (name?: string | null): string => {
  if (name?.includes(" ")) {
    return name ? name.toLocaleLowerCase().split(" ").join("-").trim() : "";
  }
  return name ?? "";
};

const handleBenitoMiamiSubmitFeedback = async (
  {
    FullName,
    ImproveText,
    Origin,
    PhoneNumber,
    Rating,
    StartTime,
    Email,
    AcceptPromotions,
    AcceptTerms,
  }: FeedbackProps,
  Improve: string[],
  customerType: string,
  AttendedBy: string,
  customerNumberOfVisits: number,
  feedbackNumberOfVisit: number
) => {
  const searchParams = new URLSearchParams(document.location.search);

  const businessId = searchParams.get("id");
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");
  const customerContactData: Customer = {
    email: Email,
    name: FullName,
    phoneNumber: PhoneNumber || "",
    origin: Origin || "",
    customerType: customerType || "",
    acceptPromotions: !PhoneNumber ? false : true,
    lastFeedbackFilled: getTimesTampFromDate(new Date()),
  };

  const formattedId = formattedName(businessId);

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
    Email,
    AttendedBy,
  };
  if (waiterId && businessId && !branchId) {
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
      await setDoc(customerRef, customerContactData);
      await addDoc(waiterFeedbackRef, feedbaackData);

      await updateDoc(waitersRef, {
        numberOfSurveys: numberOfSurveys + 1,
        latestSum: waiterRating,
        ratingAverage,
      });
    } catch (err) {
      console.error(err);
    }
  } else if (waiterId && businessId && branchId) {
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
      await setDoc(customerRef, customerContactData);
      await addDoc(waiterFeedbackRef, feedbaackData);
      await updateDoc(waitersRef, {
        numberOfSurveys: numberOfSurveys + 1,
        latestSum: waiterRating,
        ratingAverage,
      });
    } catch (err) {
      console.error(err);
    }
  }

  try {
    if (branchId && !waiterId) {
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
      const customerRef = doc(branchCustomerRef, Email);
      await setDoc(customerRef, customerContactData);
      await addDoc(branchFeedbackRef, feedbaackData);
    } else if (businessId && !waiterId) {
      const customerRef = doc(businessCustomerRef, Email);
      await setDoc(customerRef, customerContactData);
      await addDoc(businessFeedbackRef, feedbaackData);
    }

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
  } catch (err) {
    console.error(err);
  }
};

export default handleBenitoMiamiSubmitFeedback;
export { formattedName };
