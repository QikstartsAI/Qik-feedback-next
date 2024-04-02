import { Timestamp } from "firebase/firestore"

export type Customer = {
  email: string
  name: string
  phoneNumber?: string
  birthdayDate?: string
  origin: string
  customerType: string
  acceptPromotions?: boolean
  lastFeedbackFilled: Timestamp | undefined
  creationDate?: Timestamp
}

export type CustomerRole = 'new' | 'frequent'