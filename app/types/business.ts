import { Timestamp } from 'firebase/firestore'

export type FeedbackPerRating = {
  [key: number]: number
}

export interface Feedback {
  BusinessName?: string
  AverageTicket: string
  CreationDate: Timestamp
  Dinners: string
  Email: string
  FullName: string
  Improve?: string[]
  ImproveText?: string
  Origin: string
  PhoneNumber?: string
  Rating: number
  StartTime: Timestamp,
}

export const colorByFeedback = (feedback: string) => {
  switch (feedback) {
    case 'Comida':
      return '#FBF2EF'
    case 'Servicio':
      return '#D0D8EA'
    default:
      return '#CBEFD2'
  }
}

export interface Waiter {
  name: string
  gender: string
  numberOfSurveys: number
  ratingAverage?: number
  latestSum?: number
  feedbacks?: Feedback[]
  numberOfFeedbackPerRating: FeedbackPerRating
  feedbackType?: string
}

export interface Branch {
  Address: string
  Icono: string
  MapsUrl: string
  Name: string
  Cover: string
  IconoWhite: string
  Country: 'CO' | 'EC' | 'MX' | 'US' | 'AR' | 'CA' | 'DO' | 'HN'
  Waiter?: Waiter
  Waiters?: Waiter[]
  feedbacks?: Feedback[]
  PricePlan: number
}

export interface Business {
    BusinessId: string
    Address: string
    Icono: string
    MapsUrl: string
    Name: string
    Cover: string
    IconoWhite: string
    Country: 'CO' | 'EC' | 'MX' | 'US' | 'AR' | 'CA' | 'DO' | 'HN' | 'GT' | 'ES' | 'FR' | 'HK'
    sucursales?: Branch[]
    meseros?: Waiter[]
    Waiter?: Waiter
    feedbacks?: Feedback[]
    PricePlan: number
}

export type BusinessAssets = {
    iconUrl: string
    coverUrl: string
}

export type BusinessData = {
  loading: boolean,
  businessData: Business | null
}

// adapters
export type ImproveAdapted = {
  value: number
  name: string
}

export type Client = {
  feedback: Feedback
  visits: number
  hasGoogleReview: boolean
  businessName?: string
  phoneNumber?: string
  
}

export type OriginAdapted = {
  value: number
  name: string
}

export type VisitsPerDate = {
  value: number
  name: string
}
