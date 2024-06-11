import React from 'react';
import Thanks from '../Thanks';
import HootersThanks from '../HootersThanks';
import SimpleThanks from '../SimpleThanks';

interface ThanksHandlerProps {
  business: any;
  isSubmitted: boolean;
  rating: string;
  isQr: boolean;
  customerName: string;
  isHootersForm: boolean
  isGusForm: boolean
  isDscSolutions: boolean
}

const ThanksHandler = ({
  business,
  isSubmitted,
  rating,
  isQr,
  customerName,
  isHootersForm,
  isGusForm,
  isDscSolutions
}: ThanksHandlerProps) => {
  if (isSubmitted && rating !== '4' && rating !== '5' && !isDscSolutions) {
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
