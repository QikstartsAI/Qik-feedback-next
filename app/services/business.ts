import {
  COLLECTION_NAME
} from '@/app/constants/general'
import { getFirebase } from '@/app/lib/firebase'
import { Business, Waiter } from '@/app/types/business'
import { getDoc, doc, collection } from 'firebase/firestore'
import { addBusinessBranding } from '../lib/utils'

export const findBusiness = async (businessId: string | null, branchId?: string | null, waiterId?: string | null) => {
  const docRef = doc(getFirebase().db, COLLECTION_NAME || '', businessId || '')

  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    let businessData: Business = docSnap.data() as Business

    if (branchId) {
      const branchRef = doc(collection(docRef, 'sucursales'), branchId)
      const branchDocSnap = await getDoc(branchRef)

      if (branchDocSnap.exists()) {
        businessData = branchDocSnap.data() as Business
      }
    }

    if (waiterId && businessId && !branchId) {
      const waitersRef = doc(collection(docRef, 'meseros'), waiterId)
      const waitersDocSnap = await getDoc(waitersRef)

      if (waitersDocSnap.exists()) {
        businessData.Waiter = waitersDocSnap.data() as Waiter
      }
    } else if (waiterId && businessId && branchId) {
      const branchRef = doc(collection(docRef, 'sucursales'), branchId)

      const waitersRef = doc(collection(branchRef, 'meseros'), waiterId)
      const waitersDocSnap = await getDoc(waitersRef)

      if (waitersDocSnap.exists()) {
        businessData.Waiter = waitersDocSnap.data() as Waiter
      }
    }

    addBusinessBranding(businessData)
    businessData.BusinessId = businessId || ''

    return businessData
  } else {
    console.info('No such document!')
    return null
  }
}
