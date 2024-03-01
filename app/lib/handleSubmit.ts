import { COLLECTION_NAME, CUSTOMERS_COLLECTION_NAME } from '@/app/constants/general'
import { getFirebase, getTimesTampFromDate } from '@/app/lib/firebase'
import { Waiter } from '@/app/types/business'
import { FeedbackProps } from '@/app/validators/feedbackSchema'
import { addDoc, updateDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { findBusiness } from '../services/business'
import { Customer } from '../types/customer'

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
    Email,
    AcceptPromotions,
    AcceptTerms,
    BirthdayDate,
  }: FeedbackProps,
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
    phoneNumber: PhoneNumber || '',
    birthdayDate: BirthdayDate || '',
    origin: Origin || '',
    customerType: customerType || '',
    acceptPromotions: !PhoneNumber ? false : true,
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

  const feedbaackData = {
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
      await addDoc(waiterFeedbackRef, feedbaackData)

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
      await addDoc(waiterFeedbackRef, feedbaackData)
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
      await addDoc(branchFeedbackRef, feedbaackData)
    } else if (businessId && !waiterId) {
      const customerRef = doc(businessCustomerRef, Email)
      await setDoc(customerRef, customerContactData)
      await addDoc(businessFeedbackRef, feedbaackData)
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

    const customerDoc = doc(parentCustomerDataRef, Email)
    const businessDoc = doc(parentCustomerBusinessRef, businessId || '')

    await setDoc(customerDoc, customerContactData)
    await setDoc(businessDoc, { ...businessData, customerNumberOfVisits })

    const customerBusinessFeedbackRef = collection(
      getFirebase().db,
      CUSTOMERS_COLLECTION_NAME || '',
      Email,
      'business',
      businessId || '',
      'feedbacks'
    )
    const businessFeedbackDoc = doc(customerBusinessFeedbackRef)
    await setDoc(businessFeedbackDoc, { ...feedbaackData, feedbackNumberOfVisit })
  } catch (err) {
    console.error(err)
  }
}

export default handleSubmitFeedback