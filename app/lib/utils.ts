import { type ClassValue, clsx } from 'clsx'
import { Timestamp } from 'firebase/firestore'
import { twMerge } from 'tailwind-merge'
import { Business } from '../types/business'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { getFirebase } from './firebase'
import { ASSETS_FOLDER, BUCKET_NAME } from '../constants/general'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const lastFeedbackFilledIsGreaterThanOneDay = (lastFeedbackFilled: Timestamp | undefined) => {
  const oneDayInMilliseconds = 3 * 60 * 60 * 1000
  const currentDate = new Date().getTime()

  if (lastFeedbackFilled) {
    const differenceInMilliseconds = currentDate - lastFeedbackFilled.toDate().getTime()
    return oneDayInMilliseconds > differenceInMilliseconds
  }
  return false
}

export const addBusinessBranding = async (businessData: Business) => {
  if (businessData.IconoWhite && businessData.Cover) {
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
  }
}