import {
    DASHBOARD_COLLECTION_NAME,
    ASSETS_FOLDER,
    BUCKET_NAME,
    USERS_COLLECTION_NAME,
    COLLECTION_NAME
  } from '@/app/constants/general'
  import { getFirebase } from '@/app/lib/firebase'
  import { Branch, Business, Feedback, Waiter } from '@/app/types/business'
  import { getDoc, doc, collection, getDocs } from 'firebase/firestore'
  import { getDownloadURL, getStorage, ref } from 'firebase/storage'
  import { User } from '@/app/types/user'
  
  const storageBucket = `gs://${BUCKET_NAME}`
  const storage = getStorage(getFirebase().firebaseApp, storageBucket)
  
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
  
      const storageBucket = `gs://${BUCKET_NAME}`
      const storage = getStorage(getFirebase().firebaseApp, storageBucket)
      const mediaRefs = [
        ref(storage, `${ASSETS_FOLDER.icons}/${businessData.IconoWhite}`),
        ref(storage, `${ASSETS_FOLDER.background}/${businessData.Cover}`)
      ]
  
      const [iconUrl, coverUrl] = await Promise.all(
        mediaRefs.map(async (mediaRef) => {
          const url = await getDownloadURL(mediaRef)
          return url
        })
      )
  
      businessData.Icono = iconUrl
      businessData.Cover = coverUrl
      businessData.BusinessId = businessId || ''
  
      return businessData
    } else {
      console.info('No such document!')
      return null
    }
  }
  
  const getBusinessIcon = async (businessData: Business) => {
    const mediaRefs = [
      ref(storage, `${ASSETS_FOLDER.icons}/${businessData.IconoWhite}`),
      ref(storage, `${ASSETS_FOLDER.background}/${businessData.Cover}`)
    ]
  
    const [iconUrl] = await Promise.all(
      mediaRefs.map(async (mediaRef) => {
        const url = await getDownloadURL(mediaRef)
        return url
      })
    )
    return iconUrl
  }
  
  export const getBusinessDataFromUser = async (userId: string) => {
    const userDocRef = doc(getFirebase().db, USERS_COLLECTION_NAME, userId || '')
    const userDocSnap = await getDoc(userDocRef)
    const userData: User = userDocSnap.data() as User
  
    const businessDocRef = doc(getFirebase().db, DASHBOARD_COLLECTION_NAME, userData.businessId || '')
  
    try {
      const docSnap = await getDoc(businessDocRef)
      const businessData: Business = docSnap.data() as Business
      const response = {
        ...businessData,
        feedbacks: [] as Feedback[],
        sucursales: [] as Branch[],
        meseros: [] as Waiter[]
      }
      response.Icono = await getBusinessIcon(businessData)
  
      const mainBusinessFeedback = await getDocs(collection(businessDocRef, 'feedbacks'))
      mainBusinessFeedback.forEach((doc) => {
        response.feedbacks.push(doc.data() as Feedback)
      })
  
      const branchesSnapshot = await getDocs(collection(businessDocRef, 'sucursales'))
  
      const branchesData = await Promise.all(
        branchesSnapshot.docs.map(async (branchDoc) => {
          const branchData = branchDoc.data() as Branch
  
          const branch = {
            ...branchData,
            feedbacks: [] as Feedback[],
            meseros: [] as Waiter[]
          }
  
          const [branchFeedback, waitersSnapshot] = await Promise.all([
            getDocs(collection(branchDoc.ref, 'feedbacks')),
            getDocs(collection(branchDoc.ref, 'meseros'))
          ])
  
          branchFeedback.docs.forEach((doc) => {
            branch.feedbacks.push(doc.data() as Feedback)
          })
  
          await Promise.all(
            waitersSnapshot.docs.map(async (waiterDoc) => {
              const waiterData = waiterDoc.data() as Waiter
              const waiter = {
                ...waiterData,
                feedbacks: [] as Feedback[]
              }
  
              const waiterFeedback = await getDocs(collection(waiterDoc.ref, 'feedbacks'))
  
              waiterFeedback.docs.forEach((doc) => {
                waiter.feedbacks.push(doc.data() as Feedback)
              })
  
              branch.meseros.push(waiter)
            })
          )
  
          return branch
        })
      )
  
      response.sucursales = branchesData
  
      // Obtener meseros del negocio principal
      const waitersSnapshot = await getDocs(collection(businessDocRef, 'meseros'))
      const waitersData = await Promise.all(
        waitersSnapshot.docs.map(async (waiterMainDoc) => {
          const waiterData = waiterMainDoc.data() as Waiter
          const waiter = {
            ...waiterData,
            feedbacks: [] as Feedback[]
          }
  
          const waiterFeedback = await getDocs(collection(waiterMainDoc.ref, 'feedbacks'))
          waiterFeedback.docs.forEach((doc) => {
            waiter.feedbacks.push(doc.data() as Feedback)
          })
  
          return waiter
        })
      )
  
      response.meseros = waitersData
  
      return response
    } catch (error) {
      console.error('Error al obtener información del negocio:', error)
      return null
    }
  }
  