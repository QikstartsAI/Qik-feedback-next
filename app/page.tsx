'use client';

import { lazy, useState } from 'react'

import useGetBusinessData from './hooks/useGetBusinessData'
import Loader from './components/Loader'
import Thanks from './components/Thanks'
import { Toaster } from './components/ui/Toaster'
import Intro from './components/feedback/Intro';
import { CustomerRole } from './types/customer';
import GusCustomForm from './components/feedback/customForms/GusCustomForm';
import HootersCustomForm from './components/feedback/customForms/HootersCustomForm';
import CustomIntro from "@/app/components/feedback/customForms/CustomIntro";
import HootersThanks from "@/app/components/HootersThanks";
import SimpleForm from './components/feedback/customForms/SimpleForm';
import SimpleThanks from './components/SimpleThanks';
import { DSC_SOLUTIONS_ID } from './constants/general';

const Hero = lazy(() => import('./components/Hero'))
const FeedbackForm = lazy(() => import('./components/feedback/FeedbackForm'))
const CUSTOM_HOOTERS_FORM_ID = 'hooters'
const CUSTOM_GUS_FORM_ID = 'pollo-gus'

export default function Home() {
  const { business, loading, businessId } = useGetBusinessData()
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
  const [userHasBirthdayBenefit, setUserHasBirthdayBenefit] = useState(false)

  if (userHasBirthdayBenefit) {
    return <div>User has benefit</div>
  }

  if ((isSubmitted && rating !== '4' && rating !== '5') && !isDscSolutions) {
    if (isHootersForm || isGusForm) {
      return <HootersThanks businessCountry={business?.Country || 'EC'} />
    }
    else
      return <Thanks
        businessCountry={business?.Country || 'EC'}
        businessName={business?.Name || ''}
        customerName={customerName} />
  }
  if (!isQr && isSubmitted && isDscSolutions) {
    return <SimpleThanks />
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
                      isHootersForm || isGusForm ? (
                        <CustomIntro
                          business={business}
                          toogleCustomerType={toggleCustomer}
                          variant={isHootersForm ? 'hooters' : 'gus'}
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
                      ) : isGusForm
                        ? (
                          <GusCustomForm
                            business={business}
                            setIsSubmitted={setIsSubmitted}
                            setRating={setRating}
                            customerType={customerType}
                          />
                        )
                        : (
                        <FeedbackForm
                          business={business}
                          setIsSubmitted={setIsSubmitted}
                          setRating={setRating}
                          customerType={customerType}
                          setCustomerName={setCustomerName}
                          setUserHasBirthdayBenefit={setUserHasBirthdayBenefit}
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
