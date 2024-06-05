import { COLLECTION_NAME, CUSTOMERS_COLLECTION_NAME } from '@/app/constants/general'
import { getFirebase, getTimesTampFromDate } from '@/app/lib/firebase'
import { Waiter } from '@/app/types/business'
import { addDoc, updateDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { findBusiness } from '../services/business'
import { Customer } from '../types/customer'
import { findCustomerDataByEmail } from './handleEmail'
import { GusFeedbackProps } from '../validators/gusFeedbackSchema'

const handleGusFeedbackSubmit = async (
  {
    FullName,
    AcceptTerms,
    Email,
    Treatment,
    Reception,
    ReceptionText,
    ProductTaste,
    CashServiceSpeed,
    ProductDeliverySpeed,
    PlaceCleanness,
    Satisfaction,
    Recommending,
    RecommendingText,
    ComeBack,
    ComeBackText,
    ImproveText,
    StartTime,
  }: GusFeedbackProps,
  Improve: string[],
  customerType: string,
  AttendedBy: string,
  customerNumberOfVisits: number,
  feedbackNumberOfVisit: number
) => {
  const searchParams = new URLSearchParams(document.location.search)

  const businessId = searchParams.get('id')
  const branchId = searchParams.get('sucursal')
  const waiterId = searchParams.get('mesero')
  const customerContactData: Customer = {
    email: Email,
    name: FullName,
    phoneNumber: '',
    birthdayDate: '',
    origin: '',
    customerType: customerType || '',
    acceptPromotions: false,
    lastFeedbackFilled: getTimesTampFromDate(new Date())
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
    AcceptTerms,
    Improve,
    ImproveText,
    StartTime: getTimesTampFromDate(StartTime),
    Email,
    AttendedBy,
    Treatment: parseInt(Treatment),
    Reception,
    ReceptionText,
    ProductTaste: parseInt(ProductTaste),
    CashServiceSpeed: parseInt(CashServiceSpeed),
    ProductDeliverySpeed: parseInt(ProductDeliverySpeed),
    PlaceCleanness: parseInt(PlaceCleanness),
    Satisfaction: parseInt(Satisfaction),
    Recommending,
    RecommendingText,
    ComeBack,
    ComeBackText,
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
      const numberOfSurveys = waiterData.numberOfSurveys || 0
      let waiterRating = waiterData.ratingAverage || 0
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
      const numberOfSurveys = waiterData.numberOfSurveys || 0
      let waiterRating = waiterData.ratingAverage || 0
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

    const businessData = await findBusiness(businessId)
    const customerData = await findCustomerDataByEmail(Email)

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
        lastFeedbackFilled: customerData?.lastFeedbackFilled,
        acceptPromotions: customerData?.acceptPromotions,
        lastOrigin: customerData?.origin,
        customerNumberOfVisits,
        creationDate
      })
    } else {
      await setDoc(businessDoc, { 
        ...businessData,
        customerType: customerType,
        lastFeedbackFilled: getTimesTampFromDate(new Date()),
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

export default handleGusFeedbackSubmit