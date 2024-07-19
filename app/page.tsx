'use client';

import { lazy, useEffect, useState } from 'react';

import useGetBusinessData from './hooks/useGetBusinessData';
import Loader from './components/Loader';
import Thanks from './components/Thanks';
import { Toaster } from './components/ui/Toaster';
import Intro from './components/feedback/Intro';
import { CustomerRole } from './types/customer';
import GusCustomForm from './components/feedback/customForms/GusCustomForm';
import HootersCustomForm from './components/feedback/customForms/HootersCustomForm';
import CustomIntro from '@/app/components/feedback/customForms/CustomIntro';
import HootersThanks from '@/app/components/HootersThanks';
import SimpleForm from './components/feedback/customForms/SimpleForm';
import SimpleThanks from './components/SimpleThanks';
import { DSC_SOLUTIONS_ID } from './constants/general';
import RequestLocationDialog from './components/RequestLocationDialog';
import { getCookie, setCookie } from './lib/utils';

const Hero = lazy(() => import('./components/Hero'));
const FeedbackForm = lazy(() => import('./components/feedback/FeedbackForm'));
const CUSTOM_HOOTERS_FORM_ID = 'hooters';
const CUSTOM_GUS_FORM_ID = 'pollo-gus';

export default function Home() {
  const { business, loading, businessId } = useGetBusinessData();
  const [customerType, setCustomerType] = useState<CustomerRole | null>(null);
  const toggleCustomer = (customerType: CustomerRole) => {
    setCustomerType(customerType);
  };
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isQr, setIsQr] = useState(false);
  const [rating, setRating] = useState('');
  const isHootersForm = businessId === CUSTOM_HOOTERS_FORM_ID;
  const isGusForm = businessId === CUSTOM_GUS_FORM_ID;
  const isDscSolutions = businessId === DSC_SOLUTIONS_ID;
  const [customerName, setCustomerName] = useState('');
  const [requestLocation, setRequestLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  function getLocation() {
    console.log('GETTING LOCATION', navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        grantPositionPermission,
        denyPositionPermission
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
    setRequestLocation(false);
  }

  function denyLocation() {
    setCookie('grantedLocation', 'no', 365);
    setRequestLocation(false);
  }

  function grantPositionPermission(position: any) {
    console.log('PERMISSIONS GRANTED', position);
    setLocationPermission(true);
    setRequestLocation(false);
    setCookie('grantedLocation', 'yes', 365);
  }

  function denyPositionPermission(position: any) {
    console.log('PERMISSIONS DENIED');
    setLocationPermission(false);
  }

  useEffect(() => {
    function checkFirstTime() {
      var c = getCookie('grantedLocation');
      if (c === 'yes') {
        getLocation();
      } else {
        setRequestLocation(true);
      }
    }

    if (loading === 'loaded') {
      checkFirstTime();
    }
  }, [loading]);

  if (isSubmitted && rating !== '4' && rating !== '5' && !isDscSolutions) {
    if (isHootersForm || isGusForm) {
      return <HootersThanks businessCountry={business?.Country || 'EC'} />;
    } else
      return (
        <Thanks
          businessCountry={business?.Country || 'EC'}
          businessName={business?.Name || ''}
          customerName={customerName}
        />
      );
  }
  if (!isQr && isSubmitted && isDscSolutions) {
    return <SimpleThanks />;
  }

  return (
    <>
      <div>
        {loading === 'loading' || loading === 'requesting' ? (
          <Loader />
        ) : (
          <>
            {!isDscSolutions ? (
              <div className="min-h-[calc(100vh-103px)]">
                <Hero
                  business={business}
                  locationPermission={!locationPermission}
                />
                {!customerType &&
                  (isHootersForm || isGusForm ? (
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
                  ))}
                {customerType &&
                  (isHootersForm ? (
                    <HootersCustomForm
                      business={business}
                      setIsSubmitted={setIsSubmitted}
                      setRating={setRating}
                      customerType={customerType}
                    />
                  ) : isGusForm ? (
                    <GusCustomForm
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
                  ))}
              </div>
            ) : (
              <SimpleForm
                business={business}
                setIsSubmitted={setIsSubmitted}
                setRating={setRating}
                setIsQr={setIsQr}
              />
            )}
          </>
        )}
        <Toaster />
      </div>
      <RequestLocationDialog
        branches={business?.sucursales}
        open={requestLocation}
        getLocation={getLocation}
        denyLocation={denyLocation}
      />
    </>
  );
}
