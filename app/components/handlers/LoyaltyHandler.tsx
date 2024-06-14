import React from 'react';
import CongratulationsBirthday from '../loyalty/qik-cumple/CongratulationsBirthday';
import { Customer } from '@/app/types/customer';

interface LoyaltyHandlerProps {
  userHasBirthdayBenefit: boolean;
  customerData: Customer | null
}

const LoyaltyHandler = ({ userHasBirthdayBenefit, customerData }: LoyaltyHandlerProps) => {
  if (userHasBirthdayBenefit) {
    return <CongratulationsBirthday customerData={customerData} />
  }
  return null;
};

export default LoyaltyHandler;
