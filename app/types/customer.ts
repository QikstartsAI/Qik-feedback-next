export type Customer = {
  userApprovesLoyalty: boolean
  email: string
  name: string
  phoneNumber?: string
  birthdayDate?: string
  origin: string
  customerType: string
  acceptPromotions?: boolean
}

export type CustomerRole = 'new' | 'frequent'