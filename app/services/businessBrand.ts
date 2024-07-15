import {
  COLLECTION_NAME
} from '@/app/constants/general'
import { getFirebase } from '@/app/lib/firebase'
import { Business } from '@/app/types/business'
import { getDoc, doc, collection } from 'firebase/firestore'
import { addBusinessBranding } from '../lib/utils'


export const findBrandInBusiness = async (
  businessId: string | null,
  brandId: string | null,
  brandBranchId: string | null
) => {
  const docRef = doc(getFirebase().db, COLLECTION_NAME || '', businessId || '', 'brand', brandId || '')

  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    let businessData: Business = docSnap.data() as Business

    if (brandBranchId) {
      const branchRef = doc(collection(docRef, 'branch'), brandBranchId)
      const branchDocSnap = await getDoc(branchRef)
      if (branchDocSnap.exists()) {
        businessData = branchDocSnap.data() as Business
      }
    }

    // commented until get brands with waiters

    // if (waiterId && businessId && !branchId) {
    //   const waitersRef = doc(collection(docRef, 'meseros'), waiterId)
    //   const waitersDocSnap = await getDoc(waitersRef)

    //   if (waitersDocSnap.exists()) {
    //     businessData.Waiter = waitersDocSnap.data() as Waiter
    //   }
    // } else if (waiterId && businessId && branchId) {
    //   const branchRef = doc(collection(docRef, 'sucursales'), branchId)

    //   const waitersRef = doc(collection(branchRef, 'meseros'), waiterId)
    //   const waitersDocSnap = await getDoc(waitersRef)

    //   if (waitersDocSnap.exists()) {
    //     businessData.Waiter = waitersDocSnap.data() as Waiter
    //   }
    // }
    await addBusinessBranding(businessData)
    businessData.BusinessId = businessId || ''
    return businessData
  } else {
    console.info('No such document!')
    return null
  }
}
