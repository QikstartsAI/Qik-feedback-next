import { COLLECTION_NAME } from '@/app/constants/general'
import { getFirebase, getTimesTampFromDate } from '@/app/lib/firebase'
import { Waiter } from '@/app/types/business'
import { FeedbackProps } from '@/app/validators/feedbackSchema'
import { addDoc, updateDoc, collection, doc, getDoc } from 'firebase/firestore'

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
    BirthdayDate
  } : FeedbackProps, Improve : string[]) => {
  const searchParams = new URLSearchParams(document.location.search)

  const businessId = searchParams.get('id')
  const branchId = searchParams.get('sucursal')
  const waiterId = searchParams.get('mesero')

  const businessFeedbackRef = collection(
    getFirebase().db,
    COLLECTION_NAME || '',
    businessId ? businessId : '',
    'feedbacks'
  )
  const businessDocRef = doc(getFirebase().db, COLLECTION_NAME || '', businessId || '')

  const data = {
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
    BirthdayDate: BirthdayDate ? getTimesTampFromDate(new Date(BirthdayDate)) : null
  }

  if (waiterId && businessId && !branchId) {
    try {
      const waiterFeedbackRef = collection(
        getFirebase().db,
        COLLECTION_NAME || '',
        businessId || '',
        'meseros',
        waiterId || '',
        'feedbacks'
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
      await addDoc(waiterFeedbackRef, data)

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
        'feedbacks'
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
      await addDoc(waiterFeedbackRef, data)
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
        'feedbacks'
    )
      await addDoc(branchFeedbackRef, data)
    } else if (businessId && !waiterId) {
      await addDoc(businessFeedbackRef, data)
    }
  } catch (err) {
    console.error(err)
  }
}

export default handleSubmitFeedback
