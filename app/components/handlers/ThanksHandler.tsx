import React from 'react';
import Thanks from '../Thanks';
import HootersThanks from '../HootersThanks';
import SimpleThanks from '../SimpleThanks';

interface ThanksHandlerProps {
  business: any;
  isSubmitted: boolean;
  rating: string;
  isQr: boolean;
  customerName: string | null;
  isHootersForm: boolean
  isGusForm: boolean
  isDscSolutions: boolean
  userHasBirthdayBenefit: boolean
}

const ThanksHandler = ({
  business,
  isSubmitted,
  rating,
  isQr,
  customerName,
  isHootersForm,
  isGusForm,
  isDscSolutions,
  userHasBirthdayBenefit
}: ThanksHandlerProps) => {
  if (isSubmitted && rating !== '4' && rating !== '5' && !isDscSolutions && !userHasBirthdayBenefit) {
    if (isHootersForm || isGusForm) {
      return <HootersThanks businessCountry={business?.Country || 'EC'} />;
    }
    return <Thanks
    businessCountry={business?.Country || 'EC'}
    businessName={business?.Name || ''}
    customerName={customerName}
    />;
  }
  if (!isQr && isSubmitted && isDscSolutions) {
    return <SimpleThanks />;
  }
  return null;
};

export default ThanksHandler;
