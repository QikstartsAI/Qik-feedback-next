export type Customer = {
  email: string
  name: string
  phoneNumber?: string
  birthdayDate?: string
}

export type CustomerRole = 'new' | 'frequent'