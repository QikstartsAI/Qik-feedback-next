import { Dispatch, SetStateAction } from 'react';
import Hero from '../Hero';
import Intro from '../feedback/Intro';
import CustomIntro from '../feedback/customForms/CustomIntro';
import FeedbackForm from '../feedback/FeedbackForm';
import GusCustomForm from '../feedback/customForms/GusCustomForm';
import HootersCustomForm from '../feedback/customForms/HootersCustomForm';
import SimpleForm from '../feedback/customForms/SimpleForm';
import { CustomerRole } from '../../types/customer';
import { Business } from '@/app/types/business';

interface FormsHandlerProps {
  business: Business;
  branchId: string;
  waiterId: string;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
  rating: string;
  setRating: Dispatch<SetStateAction<string>>
  customerType: CustomerRole | null;
  toggleCustomer: (customerType: CustomerRole) => void;
  setCustomerName: Dispatch<SetStateAction<string>>
  setUserHasBirthdayBenefit: Dispatch<SetStateAction<boolean>>
  setIsQr: Dispatch<SetStateAction<boolean>>
  isHootersForm: boolean
  isGusForm: boolean
  isDscSolutions: boolean
}

const FormsHandler = ({
  business,
  branchId,
  waiterId,
  setIsSubmitted,
  setRating,
  customerType,
  toggleCustomer,
  setCustomerName,
  setUserHasBirthdayBenefit,
  setIsQr,
  isHootersForm,
  isGusForm,
  isDscSolutions
}: FormsHandlerProps) => {
  return (
    <>
      {
        !isDscSolutions ? (
          <>
            <Hero business={business} />
            {!customerType && (
              isHootersForm || isGusForm ? (
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
              )
            )}
            {customerType && (
              isHootersForm ? (
                <HootersCustomForm
                  business={business}
                  setIsSubmitted={setIsSubmitted}
                  setRating={setRating}
                  customerType={customerType}
                  branchId={branchId}
                  waiterId={waiterId}
                />
              ) : isGusForm
                ? (
                  <GusCustomForm
                    business={business}
                    setIsSubmitted={setIsSubmitted}
                    setRating={setRating}
                    customerType={customerType}
                    branchId={branchId}
                  />
                )
                : (
                <FeedbackForm
                  business={business}
                  setIsSubmitted={setIsSubmitted}
                  setRating={setRating}
                  customerType={customerType}
                  setCustomerName={setCustomerName}
                  setUserHasBirthdayBenefit={setUserHasBirthdayBenefit}
                  branchId={branchId}
                  waiterId={waiterId}
                />
              )
            )}
          </>
        ) : (
          <SimpleForm
            business={business}
            setIsSubmitted={setIsSubmitted}
            setRating={setRating}
            setIsQr={setIsQr}
          />
        )
      }
    </>
  );
};

export default FormsHandler;
