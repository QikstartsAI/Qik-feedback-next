import { Dispatch, SetStateAction, lazy } from 'react';
import Intro from '../feedback/Intro';
import CustomIntro from '../feedback/customForms/CustomIntro';
import FeedbackForm from '../feedback/FeedbackForm';
import GusCustomForm from '../feedback/customForms/GusCustomForm';
import HootersCustomForm from '../feedback/customForms/HootersCustomForm';
import SimpleForm from '../feedback/customForms/SimpleForm';
import { Customer, CustomerRole } from '../../types/customer';
import { Business } from '@/app/types/business';

interface FormsHandlerProps {
  business: Business | null;
  branchId: string | null;
  waiterId: string | null;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
  rating: string;
  setRating: Dispatch<SetStateAction<string>>
  customerType: CustomerRole | null;
  toggleCustomer: (customerType: CustomerRole) => void;
  setCustomerName: Dispatch<SetStateAction<string>>
  setUserHasBirthdayBenefit: Dispatch<SetStateAction<boolean>>
  setIsQr: Dispatch<SetStateAction<boolean>>
  setCustomerData: Dispatch<SetStateAction<Customer | null>>
  setBusinessSelectedGifts: Dispatch<SetStateAction<string[] | null>>
  isHootersForm: boolean
  isGusForm: boolean
  isDscSolutions: boolean
}

const Hero = lazy(() => import('../Hero'))

const FormsHandler = ({
  business,
  branchId,
  waiterId,
  setIsSubmitted,
  setRating,
  customerType,
  toggleCustomer,
  setCustomerName,
  setCustomerData,
  setUserHasBirthdayBenefit,
  setIsQr,
  setBusinessSelectedGifts,
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
                  setCustomerData={setCustomerData}
                  setBusinessSelectedGifts={setBusinessSelectedGifts}
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
