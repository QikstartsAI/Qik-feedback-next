/* eslint-disable react/jsx-handler-names */
import { Button } from '../ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/Form'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/Card'

import 'react-phone-number-input/style.css'

import { Input } from '../ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/app/lib/utils'
import { useToast } from '@/app/hooks/useToast'
import { HootersFeedbackProps, hootersFeedbackSchema } from '@/app/validators/hootersFeedbackSchema';
import { RadioGroup } from '../ui/RadioGroup'
import handleSubmitHootersForm from '@/app/lib/handleSubmitHootersForm'
import { findCustomerDataByEmail } from '@/app/lib/handleEmail'
import { Business } from '@/app/types/business'
import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  ratingOptionsFrom1To10
} from '@/app/constants/form'
import { CustomerRole } from '@/app/types/customer'
import getFormTranslations from '@/app/constants/formTranslations';
import StartsRatingGroup from '../form/StartsRatingGroup';
import UserInfo from "@/app/components/feedback/UserInfo";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import {useMultistepForm} from "@/app/hooks/useMultistepForm";
import WaiterServiceQuestion from "@/app/components/feedback/questions/WaiterServiceQuestion";
import PlaceCleannessQuestion from "@/app/components/feedback/questions/PlaceCleannessQuestion";
import QuicknessQuestion from "@/app/components/feedback/questions/QuicknessQuestion";
import FoodQualityQuestion from "@/app/components/feedback/questions/FoodQualityQuestion";
import AmbienceQuestion from "@/app/components/feedback/questions/AmbienceQuestion";
import CourtesyQuestion from "@/app/components/feedback/questions/CourtesyQuestion";
import LatelySeenQuestion from "@/app/components/feedback/questions/LatelySeenQuestion";
import SpendingQuestion from './questions/SpendingQuestion'
import RecommendingQuestion from './questions/RecommendingQuestion'
import ExperienceQuestion from "@/app/components/feedback/questions/ExperienceQuestion";
import {styled} from "@mui/material";

interface HootersCustomFormProps {
  business: Business | null
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
  setRating: Dispatch<SetStateAction<string>>
  customerType: CustomerRole
}

export default function HootersCustomForm({ business, setIsSubmitted, setRating, customerType }: HootersCustomFormProps) {
  const [isTermsChecked, setIsTermsChecked] = useState(true)
  const businessCountry = business?.Country || 'EC'

  const { toast } = useToast()

  const form = useForm<HootersFeedbackProps>({
    resolver: zodResolver(
      hootersFeedbackSchema(
        businessCountry
      )
    ),
    defaultValues: {
      FullName: '',
      AcceptTerms: isTermsChecked,
      Email: '',
      StartTime: new Date(),
      WaiterService: undefined,
    }
  })

  const resetForm = () => {
    form.reset()
  }

  const { watch } = form
  const waiterName = business?.Waiter?.name || ''
  const attendantName = waiterName ? waiterName : 'Matriz';

  const {
    title,
    subTitle,
    fullNameQuestion,
    emailQuestion,
    waiterServiceQuestion,
    placeCleannessQuestion,
    quicknessQuestion,
    foodQualityQuestion,
    ambienceQuestion,
    courtesyQuestion,
    latelySeenQuestion,
    spendingQuestion,
    recommendingQuestion,
    experienceQuestion,
    submitButton,
    termsAndConditions1,
    termsAndConditions2,
    termsAndConditions3,
    termsAndConditions4,
    formErrorMessage,
  } = getFormTranslations({businessCountry})

  const {
    nextStep,
    goTo,
    currentStepIndex,
  } = useMultistepForm(10);

  const handleStepChange = (event: React.ChangeEvent<unknown>, value: number) => {
    goTo(value-1)
  }

  async function onSubmit(data: HootersFeedbackProps) {
    setRating(data.WaiterService)

    try {
      await handleSubmitHootersForm(data, customerType, attendantName)
    } catch (error) {
      console.log(error)
      toast({
        title: formErrorMessage,
        variant: 'destructive'
      })
    } finally {
      resetForm()
      setIsSubmitted(true)
    }
  }

  return (
    <>
      <div className='mx-auto py-12 lg:py-24 max-w-4xl px-6 min-h-screen' id='form'>
        <Card>
          <CardHeader>
            <CardTitle>
            {title}
              <span className='text-sky-500 font-medium'>
                {subTitle}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 md:space-y-6'
                noValidate
              >
                <div
                  className={cn('space-y-3 mb-3', {})}
                >
                  <UserInfo
                    form={form}
                    emailQuestion={emailQuestion}
                    fullNameQuestion={fullNameQuestion}
                  >
                  </UserInfo>

                  <div className='flex flex-col gap-2' >
                    {currentStepIndex === 0 && (
                      <WaiterServiceQuestion form={form} question={waiterServiceQuestion} nextStep={nextStep}>
                      </WaiterServiceQuestion>
                    )}

                    {currentStepIndex === 1 && (
                      <PlaceCleannessQuestion form={form} question={placeCleannessQuestion} nextStep={nextStep}>
                      </PlaceCleannessQuestion>
                    )}

                    {currentStepIndex === 2 && (
                      <QuicknessQuestion form={form} question={quicknessQuestion} nextStep={nextStep}>
                      </QuicknessQuestion>
                    )}

                    {currentStepIndex === 3 && (
                      <FoodQualityQuestion form={form} question={foodQualityQuestion} nextStep={nextStep}>
                      </FoodQualityQuestion>
                    )}

                    {currentStepIndex === 4 && (
                      <AmbienceQuestion form={form} question={ambienceQuestion} nextStep={nextStep}>
                      </AmbienceQuestion>
                    )}

                    {currentStepIndex === 5 && (
                      <CourtesyQuestion form={form} question={courtesyQuestion} nextStep={nextStep}>
                      </CourtesyQuestion>
                    )}

                    {currentStepIndex === 6 && (
                      <LatelySeenQuestion form={form} question={latelySeenQuestion} nextStep={nextStep}>
                      </LatelySeenQuestion>
                    )}

                    {currentStepIndex === 7 && (
                      <SpendingQuestion form={form} question={spendingQuestion} nextStep={nextStep}>
                      </SpendingQuestion>
                    )}

                    {currentStepIndex === 8 && (
                      <RecommendingQuestion form={form} question={recommendingQuestion} nextStep={nextStep}>
                      </RecommendingQuestion>
                    )}

                    {currentStepIndex === 9 && (
                      <ExperienceQuestion form={form} question={experienceQuestion} nextStep={nextStep}>
                      </ExperienceQuestion>
                    )}
                  </div>

                  <Stack spacing={2}>
                    <Pagination
                      count={10}
                      color={'primary'}
                      size={'small'}
                      page={currentStepIndex+1}
                      boundaryCount={0}
                      onChange={handleStepChange}
                    />
                  </Stack>
                </div>
                <Button
                  type='submit' disabled={
                    !isTermsChecked
                      ? true
                      : form.formState.isSubmitting
                  }
                >
                  {submitButton}
                </Button>
                <CardFooter>
                  <FormField
                    control={form.control}
                    name='AcceptTerms'
                    render={() => (
                      <FormControl>
                        <>
                          <input
                            type='checkbox'
                            className='form-checkbox min-h-[12px] min-w-[12px] text-green-500'
                            onChange={() => setIsTermsChecked(!isTermsChecked)}
                            checked={isTermsChecked}
                          />
                          <small className='text-gray-500'>
                            {termsAndConditions1}
                            <a
                              className='text-primary hover:underline'
                              href='https://qikstarts.com/terms-of-service'
                              rel='noopener noreferrer'
                              target='_blank'
                            >
                              {termsAndConditions2}
                            </a> {termsAndConditions3} <a className='text-primary hover:underline' href='https://qikstarts.com/privacy-policy' rel='noopener noreferrer' target='_blank'>{termsAndConditions4}</a>.
                          </small>
                        </>
                      </FormControl>
                    )}
                  />
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
