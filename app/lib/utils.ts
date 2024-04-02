import { type ClassValue, clsx } from 'clsx'
import { Timestamp } from 'firebase/firestore'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function lastFeedbackFilledIsGreaterThanOneDay(lastFeedbackFilled: Timestamp | undefined): boolean {
  const oneDayInMilliseconds = 3 * 60 * 60 * 1000
  const currentDate = new Date().getTime()

  if (lastFeedbackFilled) {
    const differenceInMilliseconds = currentDate - lastFeedbackFilled.toDate().getTime()
    return oneDayInMilliseconds > differenceInMilliseconds
  }
  return false
}
