import React from 'react';
import CongratulationsBirthday from '../loyalty/qik-cumple/CongratulationsBirthday';
import { Customer } from '@/app/types/customer';

interface LoyaltyHandlerProps {
  userHasBirthdayBenefit: boolean
  customerData: Customer | null
  businessIcon: string
  businessSelectedGifts: string[] | null
}

const LoyaltyHandler = ({
  userHasBirthdayBenefit,
  customerData,
  businessIcon,
  businessSelectedGifts
}: LoyaltyHandlerProps) => {
  if (userHasBirthdayBenefit) {
    return <CongratulationsBirthday
    customerData={customerData}
    businessIcon={businessIcon}
    businessSelectedGifts={businessSelectedGifts}
    />
  }
  return null;
};

export default LoyaltyHandler;
