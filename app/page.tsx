'use client';

import { lazy, useState } from 'react'

import useGetBusinessData from './hooks/useGetBusinessData'
import Loader from './components/Loader'
import Thanks from './components/Thanks'
import { Toaster } from './components/ui/Toaster'
import Intro from './components/feedback/Intro';
import { CustomerRole } from './types/customer';
import HootersCustomForm from './components/feedback/customForms/HootersCustomForm';
import HootersCustomIntro from "@/app/components/feedback/customForms/HootersCustomIntro";
import HootersThanks from "@/app/components/HootersThanks";
import SimpleForm from './components/feedback/customForms/SimpleForm';
import SimpleThanks from './components/SimpleThanks';
import { DSC_SOLUTIONS_ID } from './constants/general';

const Hero = lazy(() => import('./components/Hero'))
const FeedbackForm = lazy(() => import('./components/feedback/FeedbackForm'))
const CUSTOM_HOOTERS_FORM = 'hooters'

export default function Home() {
  const { business, loading, businessId } = useGetBusinessData()
  const [customerType, setCustomerType] = useState<CustomerRole | null>(null)
  const toggleCustomer = (customerType: CustomerRole) => {
    setCustomerType(customerType)
  }
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState('')
  const [isQr, setIsQr] = useState(false)
  const isHootersForm = businessId === CUSTOM_HOOTERS_FORM
  const isDscSolutions = businessId === DSC_SOLUTIONS_ID
  const [customerName, setCustomerName] = useState('')

  if ((isSubmitted && !isQr) || (isSubmitted && rating !== '4' && rating !== '5')) {
    if (isHootersForm) {
      return <HootersThanks businessCountry={business?.Country || 'EC'} />
    }
    if (isDscSolutions) {
      return <SimpleThanks />
    }

    else
      return <Thanks
        businessCountry={business?.Country || 'EC'}
        businessName={business?.Name || ''}
        customerName={customerName} />
  }

  return (
    <div>
      {
        loading === 'loading' || loading === 'requesting'
          ? (
            <Loader />
          )
          : (
            <>
              {
                !isDscSolutions ? (
                  <>
                    <Hero business={business} />
                    {!customerType && (
                      isHootersForm ? (
                        <HootersCustomIntro
                          business={business}
                          toogleCustomerType={toggleCustomer}
                        />
                      ) : (
                        <Intro
                          business={business}
                          toogleCustomerType={toggleCustomer}
                        />
                      )
                    )}
                    {customerType && (
                      isHootersForm ? (
                        <HootersCustomForm
                          business={business}
                          setIsSubmitted={setIsSubmitted}
                          setRating={setRating}
                          customerType={customerType}
                        />
                      ) : (
                        <FeedbackForm
                          business={business}
                          setIsSubmitted={setIsSubmitted}
                          setRating={setRating}
                          customerType={customerType}
                          setCustomerName={setCustomerName}
                        />
                      )
                    )}
                  </>
                ) : (
                  <SimpleForm
                    business={business}
                    setIsSubmitted={setIsSubmitted}
                    setRating={setRating}
                    setIsQr={setIsQr}
                  />
                )
              }
            </>
          )
      }
      <Toaster />
    </div>
  )
}
