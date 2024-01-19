'use client';

import { lazy, useState } from 'react'

import useGetBusinessData from './hooks/useGetBusinessData'
import Loader from './components/Loader'
import Thanks from './components/Thanks'
import { Toaster } from './components/ui/Toaster'
import Intro from './components/feedback/Intro';
import { CustomerRole } from './types/customer';

const Hero = lazy(() => import('./components/Hero'))
const FeedbackForm = lazy(() => import('./components/feedback/FeedbackForm'))

export default function Home() {
  const { business, loading } = useGetBusinessData()
  const [customerType, setCustomerType] = useState<CustomerRole | null>(null)
  const toggleCustomer = (customerType: CustomerRole) => {
    setCustomerType(customerType)
  }
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState('')
  const [customerName, setCustomerName] = useState('')
  if (isSubmitted && rating !== '4' && rating !== '5') {
    return <Thanks
      businessCountry={business?.Country || 'EC'}
      businessName={business?.Name || ''}
      customerName={customerName}
    />
  }
  return (
    <div>
      {
        loading === 'loading'
          ? (
            <Loader />
          )
          : loading === 'requesting'
            ? (
              <Loader />
            ) : (
              <>
                <Hero business={business} />
                {!customerType && <Intro business={business} toogleCustomerType={toggleCustomer} />}
                {customerType && (
                  <FeedbackForm
                    business={business}
                    setIsSubmitted={setIsSubmitted}
                    setRating={setRating}
                    setCustomerName={setCustomerName}
                    customerType={customerType}
                  />
                )}
              </>
            )
      }
      <Toaster />
    </div>
  )
}
