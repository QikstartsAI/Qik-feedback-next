'use client';

import { lazy, useState } from 'react'

import useGetBusinessData from './hooks/useGetBusinessData'
import Loader from './components/Loader'
import Thanks from './components/Thanks'
import { Toaster } from './components/ui/Toaster'
import Intro from './components/feedback/Intro';

const Hero = lazy(() => import('./components/Hero'))
const FeedbackForm = lazy(() => import('./components/feedback/FeedbackForm'))

export default function Home() {
  const { business, loading } = useGetBusinessData()
  const [startTest, setStartTest] = useState(false)
  const toggleStartTest = () => setStartTest(!startTest)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState('')
  if (isSubmitted && rating !== '4' && rating !== '5') {
    return <Thanks businessCountry={business?.Country || 'EC'} />
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
              { !startTest && <Intro business={business} toggleStartTest={toggleStartTest} /> }
              { startTest && <FeedbackForm business={business} setIsSubmitted={setIsSubmitted} setRating={setRating} /> }
            </>
          )
      }
      <Toaster />
    </div>
  )
}
