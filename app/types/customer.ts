import { Timestamp } from "firebase/firestore"

export type Customer = {
  userApprovesLoyalty?: boolean
  email: string
  name: string
  phoneNumber?: string
  birthdayDate?: string
  origin: string
  customerType: string
  acceptPromotions?: boolean
  lastFeedbackFilled: Timestamp | undefined
  creationDate?: Timestamp
  customerNumberOfVisits: number
}

export type CustomerRole = 'new' | 'frequent'