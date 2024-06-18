'use client';

import { useState } from 'react'

import useGetBusinessData from './hooks/useGetBusinessData'
import Loader from './components/Loader'
import { Toaster } from './components/ui/Toaster'
import { Customer, CustomerRole } from './types/customer';
import { DSC_SOLUTIONS_ID } from './constants/general';
import FormsHandler from './components/handlers/FormsHandler';
import ThanksHandler from './components/handlers/ThanksHandler';
import LoyaltyHandler from './components/handlers/LoyaltyHandler';

const CUSTOM_HOOTERS_FORM_ID = 'hooters'
const CUSTOM_GUS_FORM_ID = 'pollo-gus'

export default function Home() {
  const {
    business,
    loading,
    businessId,
    branchId,
    waiterId
  } = useGetBusinessData()
  const [customerType, setCustomerType] = useState<CustomerRole | null>(null)
  const toggleCustomer = (customerType: CustomerRole) => {
    setCustomerType(customerType)
  }
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isQr, setIsQr] = useState(false)
  const [rating, setRating] = useState('')
  const isHootersForm = businessId === CUSTOM_HOOTERS_FORM_ID
  const isGusForm = businessId === CUSTOM_GUS_FORM_ID
  const isDscSolutions = businessId === DSC_SOLUTIONS_ID
  const [customerName, setCustomerName] = useState('')
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [userHasBirthdayBenefit, setUserHasBirthdayBenefit] = useState(false)
  const [businessSelectedGifts, setBusinessSelectedGifts] = useState<string[] | null>(null)

  if (loading === 'loading' || loading === 'requesting') {
    return <Loader />;
  }
  return (
    <div>
      <LoyaltyHandler
        userHasBirthdayBenefit={userHasBirthdayBenefit}
        businessSelectedGifts={businessSelectedGifts}
        customerData={customerData}
        businessIcon={business?.Icono || ''}
      />
      <ThanksHandler
        business={business}
        customerName={customerName}
        isDscSolutions={isDscSolutions}
        isGusForm={isGusForm}
        isHootersForm={isHootersForm}
        isQr={isQr}
        isSubmitted={isSubmitted}
        rating={rating}
        userHasBirthdayBenefit={userHasBirthdayBenefit}
      />
      {!isSubmitted && !userHasBirthdayBenefit && (
        <FormsHandler
          business={business}
          branchId={branchId}
          waiterId={waiterId}
          customerType={customerType}
          isDscSolutions={isDscSolutions}
          isGusForm={isGusForm}
          isHootersForm={isHootersForm}
          rating={rating}
          setCustomerName={setCustomerName}
          setCustomerData={setCustomerData}
          setIsQr={setIsQr}
          setIsSubmitted={setIsSubmitted}
          setRating={setRating}
          setUserHasBirthdayBenefit={setUserHasBirthdayBenefit}
          toggleCustomer={toggleCustomer}
          setBusinessSelectedGifts={setBusinessSelectedGifts}
        />
      )}
      <Toaster />
    </div>
  )
}
