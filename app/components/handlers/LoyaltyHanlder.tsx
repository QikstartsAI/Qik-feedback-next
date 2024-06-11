import React from 'react';

interface LoyaltyHandlerProps {
  userHasBirthdayBenefit: boolean;
}

const LoyaltyHandler = ({ userHasBirthdayBenefit }: LoyaltyHandlerProps) => {
  if (userHasBirthdayBenefit) {
    return <div>User has benefit</div>;
  }
  return null;
};

export default LoyaltyHandler;
