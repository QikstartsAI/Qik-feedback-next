import { COLLECTION_NAME, CUSTOMERS_COLLECTION_NAME } from '@/app/constants/general'
import { getFirebase, getTimesTampFromDate } from '@/app/lib/firebase'
import { Business, Waiter } from '@/app/types/business'
import { FeedbackProps } from '@/app/validators/feedbackSchema'
import { addDoc, updateDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { Customer } from '../types/customer'

const handleSubmitFeedback = async (
    {
      UserApprovesLoyalty,
      FullName,
      ImproveText,
      Origin,
      PhoneNumber,
      Rating,
      StartTime,
      Dinners,
      AverageTicket,
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
    customerData: Customer | null | undefined,
    businessData: Business | null,
    branchId: string | null,
    waiterId: string | null
  ) => {
  const lastFeedbackFilledValue = getTimesTampFromDate(new Date())

  const businessId = businessData?.BusinessId

  const customerContactData: Customer = {
    email: Email,
    name: FullName,
    phoneNumber: PhoneNumber || '',
    birthdayDate: BirthdayDate || '',
    origin: Origin || '',
    customerType: customerType || '',
    acceptPromotions: !PhoneNumber ? false : true,
    lastFeedbackFilled: lastFeedbackFilledValue,
    customerNumberOfVisits: customerNumberOfVisits
  }

  const businessFeedbackRef = collection(
    getFirebase().db,
    COLLECTION_NAME || '',
    businessId ? businessId : '',
    'customers',
    Email,
    'feedbacks'
  )

  const businessCustomerRef = collection(
    getFirebase().db,
    COLLECTION_NAME || '',
    businessId ? businessId : '',
    'customers',
  )
  const businessDocRef = doc(getFirebase().db, COLLECTION_NAME || '', businessId || '')

  const feedbackData = {
    CreationDate: getTimesTampFromDate(new Date()),
    FullName,
    AcceptPromotions,
    AcceptTerms,
    Improve,
    ImproveText,
    Origin,
    PhoneNumber,
    Rating: parseInt(Rating),
    StartTime: getTimesTampFromDate(StartTime),
    Dinners,
    AverageTicket,
    Email,
    BirthdayDate: BirthdayDate ? getTimesTampFromDate(new Date(BirthdayDate)) : null,
    AttendedBy,
  }
  if (waiterId && businessId && !branchId) {
    try {
      const waiterFeedbackRef = collection(
        getFirebase().db,
        COLLECTION_NAME || '',
        businessId || '',
        'meseros',
        waiterId || '',
        'customers',
        Email,
        'feedbacks'
      )
      const waiterCustomerRef = collection(
        getFirebase().db,
        COLLECTION_NAME || '',
        businessId || '',
        'meseros',
        waiterId || '',
        'customers',
      )
      const waitersRef = doc(collection(businessDocRef, 'meseros'), waiterId || '')
      const waitersDocSnap = await getDoc(waitersRef)
      const waiterData = waitersDocSnap.data() as Waiter
      const latestSum = waiterData.latestSum || 0
      const numberOfSurveys = waiterData.numberOfSurveys || 0
      let waiterRating = waiterData.ratingAverage || 0
      if (latestSum > 0) {
        waiterRating = latestSum + parseInt(Rating)
      } else {
        waiterRating += parseInt(Rating)
      }
      const ratingAverage = (waiterRating / (numberOfSurveys + 1)).toFixed(1)
      const customerRef = doc(waiterCustomerRef, Email)
      await setDoc(customerRef, customerContactData)
      await addDoc(waiterFeedbackRef, feedbackData)

      await updateDoc(waitersRef, {
        numberOfSurveys: numberOfSurveys + 1,
        latestSum: waiterRating,
        ratingAverage
      })
    } catch (err) {
      console.error(err)
    }
  } else if (waiterId && businessId && branchId) {
    try {
      const waiterFeedbackRef = collection(
        getFirebase().db,
        COLLECTION_NAME || '',
        businessId || '',
        'sucursales',
        branchId || '',
        'meseros',
        waiterId || '',
        'customers',
        Email,
        'feedbacks'
      )
      const waiterBranchCustomerRef = collection(
        getFirebase().db,
        COLLECTION_NAME || '',
        businessId || '',
        'sucursales',
        branchId || '',
        'meseros',
        waiterId || '',
        'customers',
      )
      const branchDocRef = doc(collection(businessDocRef, 'sucursales'), branchId || '')
      const waitersRef = doc(collection(branchDocRef, 'meseros'), waiterId || '')
      const waitersDocSnap = await getDoc(waitersRef)
      const waiterData = waitersDocSnap.data() as Waiter
      const latestSum = waiterData.latestSum || 0
      const numberOfSurveys = waiterData.numberOfSurveys || 0
      let waiterRating = waiterData.ratingAverage || 0
      if (latestSum > 0) {
        waiterRating = latestSum + parseInt(Rating)
      } else {
        waiterRating += parseInt(Rating)
      }
      const ratingAverage = (waiterRating / (numberOfSurveys + 1)).toFixed(1)
      const customerRef = doc(waiterBranchCustomerRef, Email)
      await setDoc(customerRef, customerContactData)
      await addDoc(waiterFeedbackRef, feedbackData)
      await updateDoc(waitersRef, {
        numberOfSurveys: numberOfSurveys + 1,
        latestSum: waiterRating,
        ratingAverage
      })
    } catch (err) {
      console.error(err)
    }
  }

  try {
    if (branchId && !waiterId) {
      const branchFeedbackRef = collection(
        getFirebase().db,
        COLLECTION_NAME || '',
        businessId || '',
        'sucursales',
        branchId || '',
        'customers',
        Email,
        'feedbacks'
      )
      const branchCustomerRef = collection(
        getFirebase().db,
        COLLECTION_NAME || '',
        businessId || '',
        'sucursales',
        branchId || '',
        'customers',
      )
      const customerRef = doc(branchCustomerRef, Email)
      await setDoc(customerRef, customerContactData)
      await addDoc(branchFeedbackRef, feedbackData)
    } else if (businessId && !waiterId) {
      const customerRef = doc(businessCustomerRef, Email)
      await setDoc(customerRef, customerContactData)
      await addDoc(businessFeedbackRef, feedbackData)
    }

    const parentCustomerDataRef = collection(
      getFirebase().db,
      CUSTOMERS_COLLECTION_NAME || '',
    )
    const parentCustomerBusinessRef = collection(
      getFirebase().db,
      CUSTOMERS_COLLECTION_NAME || '',
      Email,
      'business',
    )

    let creationDate = customerData?.creationDate;

    const customerDoc = doc(parentCustomerDataRef, Email)
    const businessDoc = doc(parentCustomerBusinessRef, businessId || '')

    if (!customerData?.creationDate) {
      creationDate = getTimesTampFromDate(new Date())
    }

    await setDoc(customerDoc, customerContactData)
    if (customerData) {
      await setDoc(businessDoc, { 
        ...businessData,
        customerType: customerData?.customerType,
        lastFeedbackFilled: lastFeedbackFilledValue,
        acceptPromotions: customerData?.acceptPromotions,
        lastOrigin: customerData?.origin,
        userApprovesLoyalty: UserApprovesLoyalty,
        customerNumberOfVisits,
        creationDate
      })
    } else {
      await setDoc(businessDoc, {
        ...businessData,
        customerType: customerType,
        lastFeedbackFilled: lastFeedbackFilledValue,
        acceptPromotions: AcceptPromotions,
        lastOrigin: Origin,
        userApprovesLoyalty: UserApprovesLoyalty,
        customerNumberOfVisits,
        creationDate
      })
    }

    const customerBusinessFeedbackRef = collection(
      getFirebase().db,
      CUSTOMERS_COLLECTION_NAME || '',
      Email,
      'business',
      businessId || '',
      'feedbacks'
    )
    const businessFeedbackDoc = doc(customerBusinessFeedbackRef)
    await setDoc(businessFeedbackDoc, { ...feedbackData, feedbackNumberOfVisit })
  } catch (err) {
    console.error(err)
  }
}

export default handleSubmitFeedback