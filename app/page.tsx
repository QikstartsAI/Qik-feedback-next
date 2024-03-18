'use client';

import { lazy, useState } from 'react'

import useGetBusinessData from './hooks/useGetBusinessData'
import Loader from './components/Loader'
import Thanks from './components/Thanks'
import { Toaster } from './components/ui/Toaster'
import Intro from './components/feedback/Intro';
import { CustomerRole } from './types/customer';
import HootersCustomForm from './components/feedback/HootersCustomForm';

const Hero = lazy(() => import('./components/Hero'))
const FeedbackForm = lazy(() => import('./components/feedback/FeedbackForm'))
const CUSTOM_HOOTERS_FORM = process.env.NEXT_PUBLIC_HOOTERS_FORM

export default function Home() {
  const { business, loading, businessId } = useGetBusinessData()
  const [customerType, setCustomerType] = useState<CustomerRole | null>(null)
  const toggleCustomer = (customerType: CustomerRole) => {
    setCustomerType(customerType)
  }
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState('')
  if (isSubmitted && rating !== '4' && rating !== '5') {
    return <Thanks businessCountry={business?.Country || 'EC'} />
  }

  const isHootersForm = businessId === CUSTOM_HOOTERS_FORM
  console.log('isHootersForm', isHootersForm)

  return (
    <div>
      {
        loading === 'loading' || loading === 'requesting'
          ? (
            <Loader />
          )
          : (
              <>
                <Hero business={business} />
                {!customerType && <Intro business={business} toogleCustomerType={toggleCustomer} />}
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
                    />
                  )  
                )}
              </>
            )
      }
      <Toaster />
    </div>
  )
}
