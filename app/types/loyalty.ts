export enum BirthdayOption {
	'onlyOnHisBirthday' = 'onlyOnHisBirthday',
	'onTheDayAndthirtyDaysAfter' = 'onTheDayAndthirtyDaysAfter',
	'upToSixtyDaysAfter' = 'upToSixtyDaysAfter'
}

export interface BirthdayConfiguration {
  birthdayOption: BirthdayOption
  enableBirthdayNotification: boolean
  enableRenewal: boolean
  mailNotificationOption: "dayBeforeMail"
  selectedGifts: string[]
  whatsappNotificationOptions: string[]
}

export interface GiftData {
  id: number
  value: string
  image: string
  text: string
  starValue?: string
}