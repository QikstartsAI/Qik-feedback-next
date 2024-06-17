import React from 'react';
import CongratulationsBirthday from '../loyalty/qik-cumple/CongratulationsBirthday';
import { Customer } from '@/app/types/customer';

interface LoyaltyHandlerProps {
  userHasBirthdayBenefit: boolean
  customerData: Customer | null
  businessIcon: string
}

const LoyaltyHandler = ({ userHasBirthdayBenefit, customerData, businessIcon }: LoyaltyHandlerProps) => {
  if (userHasBirthdayBenefit) {
    return <CongratulationsBirthday
    customerData={customerData}
    businessIcon={businessIcon}
    />
  }
  return null;
};

export default LoyaltyHandler;
