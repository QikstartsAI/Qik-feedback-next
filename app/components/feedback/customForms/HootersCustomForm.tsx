/* eslint-disable react/jsx-handler-names */
'use client'

import { Button } from '../../ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../ui/Form'
import {
  CardFooter,
} from '../../ui/Card'

import 'react-phone-number-input/style.css'

import * as Separator from '@radix-ui/react-separator';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/app/lib/utils'
import { useToast } from '@/app/hooks/useToast'
import { HootersFeedbackProps, hootersFeedbackSchema } from '@/app/validators/hootersFeedbackSchema';
import handleSubmitHootersForm from '@/app/lib/handleSubmitHootersForm'
import { findCustomerFeedbackDataInBusiness } from '@/app/lib/handleEmail'
import { Business } from '@/app/types/business'
import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  getImprovements,
} from '@/app/constants/form'
import { CustomerRole } from '@/app/types/customer'
import getFormTranslations from '@/app/constants/formTranslations';
import UserInfo from "@/app/components/feedback/UserInfo";
import Stack from '@mui/material/Stack';

import { useMultistepForm } from "@/app/hooks/useMultistepForm";
import PlaceCleannessQuestion from "@/app/components/feedback/questions/PlaceCleannessQuestion";
import QuicknessQuestion from "@/app/components/feedback/questions/QuicknessQuestion";
import FoodQualityQuestion from "@/app/components/feedback/questions/FoodQualityQuestion";
import AmbienceQuestion from "@/app/components/feedback/questions/AmbienceQuestion";
import CourtesyQuestion from "@/app/components/feedback/questions/CourtesyQuestion";
import RecommendingQuestion from '../questions/RecommendingQuestion'
import ExperienceQuestion from "@/app/components/feedback/questions/ExperienceQuestion";
import ComeBackQuestion from "@/app/components/feedback/questions/ComeBackQuestion";
import { Step, StepLabel, Stepper } from "@mui/material";
import { Textarea } from "@/app/components/ui/TextArea";
import { Checkbox } from '../../ui/Checkbox'
import { IconToolsKitchen } from '@tabler/icons-react';
import { IconUserScan } from '@tabler/icons-react';
import { IconBuildingStore } from '@tabler/icons-react';
import CustomStepperIcons, { CustomStepperIconsHooters } from "@/app/components/form/CustomStepperIcons";
import CustomStepperConnector from "@/app/components/form/CustomStepperConnector";
import { useSearchParams } from 'next/navigation'
import StarRatingQuestion from '../questions/StarRatingQuestion'

interface HootersCustomFormProps {
  business: Business | null
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
  setRating: Dispatch<SetStateAction<string>>
  customerType: CustomerRole
}

export default function HootersCustomForm({ business, setIsSubmitted, setRating, customerType }: HootersCustomFormProps) {
  const [isTermsChecked, setIsTermsChecked] = useState(true)
  const [recommending, setRecommending] = useState<boolean | null>(null)
  const [comeBack, setComeBack] = useState<boolean | null>(null)
  const [isLastFeedbackMoreThanOneDay, setIsLastFeedbackMoreThanOneDay] = useState<boolean | undefined>(false)
  const searchParams = useSearchParams()

  const businessId = searchParams.get('id')
  const businessCountry = business?.Country || 'EC'
  const questionsNumber = 8

  const isRecommendingClicked = React.useRef(null);
  const isComeBackClicked = React.useRef(null);

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
      Courtesy: undefined,
      RecommendingText: '',
      ComeBackText: '',
      ImproveText: '',
      hiddenInput: null,
      Ambience: false,
      Food: false,
      Service: false
    }
  })

  const resetForm = () => {
    form.reset()
  }

  const { watch } = form
  const waiterName = business?.Waiter?.name || ''
  const attendantName = waiterName ? waiterName : 'Matriz';
  const watchFullName = watch('FullName');

  const {
    title,
    subTitle,
    fullNameQuestion,
    emailQuestion,
    courtesyQuestion,
    placeCleannessQuestion,
    quicknessQuestion,
    foodQualityQuestion,
    ambienceQuestion,
    experienceQuestion,
    recommendingQuestion,
    comeBackQuestion,
    nextButton,
    yesButton,
    noButton,
    submitButton,
    whyText,
    recommendingPlaceholder,
    noRecommendingPlaceholder,
    submitText1,
    submitText2,
    submitText3,
    submitText4,
    submitText5,
    toImproveText,
    foodButton,
    serviceButton,
    ambienceButton,
    shareDetailsText,
    shareDetailsPlaceholder,
    termsAndConditions1,
    termsAndConditions2,
    termsAndConditions3,
    termsAndConditions4,
    formErrorMessage,
    formUserDataErrorMessage,
    emptyRecommendingError,
    emptyNoRecommendingError,
    chooseOneOptionError,
    howToImprovementError,
    whyComeBackError,
  } = getFormTranslations({ businessCountry })

  const {
    goTo,
    currentStepIndex,
  } = useMultistepForm(questionsNumber);

  const steps = ['', '', '', '', '', '', '', ''];

  const handleRecommendingQuestion = (answer: boolean) => {
    setRecommending(answer)
  }

  const handleComeBackQuestion = (answer: boolean) => {
    setComeBack(answer)
  }

  const handleRedirect = () => {
    window.location.replace(business?.MapsUrl || '')
  }


  async function onSubmit(data: HootersFeedbackProps) {
    const { Ambience, Service, Food, ImproveText, ComeBackText } = data
    if (((Ambience === undefined || !Ambience) &&
      (Service === undefined || !Service) &&
      (Food === undefined || !Food) &&
      comeBack === false)) {
      toast({
        title: chooseOneOptionError,
        variant: 'hootersDestructive'
      })
      return
    }


    if (!comeBack && ImproveText.length === 0) {
      toast({
        title: howToImprovementError,
        variant: 'hootersDestructive'
      })
      return
    }

    if (comeBack && ComeBackText.length === 0) {
      toast({
        title: whyComeBackError,
        variant: 'hootersDestructive'
      })
      return
    }

    try {
      const updatedData = data;

      updatedData.ImproveText = !comeBack ? ImproveText : ''
      updatedData.ComeBackText = comeBack ? ComeBackText : ''
      const improveOptions = !comeBack ? getImprovements({ Ambience, Service, Food, business }) : []
      let customerNumberOfVisits = 0
      let feedbackNumberOfVisit = 0
      const customerFeedbackInBusinesData = await findCustomerFeedbackDataInBusiness(data.Email, business?.BusinessId || '')
      if (customerFeedbackInBusinesData) {
        const feedbackVisits = customerFeedbackInBusinesData.customerNumberOfVisits
        customerNumberOfVisits = feedbackVisits + 1
        feedbackNumberOfVisit = feedbackVisits + 1
      } else {
        customerNumberOfVisits = 1
        feedbackNumberOfVisit = 1
      }
      await handleSubmitHootersForm(updatedData, improveOptions, customerType, attendantName, customerNumberOfVisits, feedbackNumberOfVisit)
      if (comeBack) {
        handleRedirect()
      }
    } catch (error) {
      console.log(error)
      toast({
        title: formErrorMessage,
        variant: 'hootersDestructive',
      })
    } finally {
      resetForm()
      setIsSubmitted(true)
    }
  }

  // validate if RecommendingText is empty cannot go to next step
  const isRecommendingTextEmpty = form.watch('RecommendingText') === '';

  const handleNextStep = () => {
    if (recommending != null && isRecommendingTextEmpty) {
      toast({
        title: recommending ? emptyRecommendingError : emptyNoRecommendingError,
        variant: 'hootersDestructive'
      })
      return;
    }
    goTo(currentStepIndex + 1)
  }

  return (
    <>
      <div className='mx-auto py-8 lg:py-18 max-w-xl px-6 min-h-screen text-colorText' id='form'>
        <h4 className={'text-center font-medium text-colorText'}>
          {title}
          <span className='text-hooters font-medium'>
            <b>{subTitle}</b>
          </span>
        </h4>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 md:space-y-6 my-6'
            noValidate
          >
            <div
              className={cn('space-y-3 mb-3 flex-row items-center justify-center', {})}
            >
              {
                currentStepIndex === 0 && (
                  <UserInfo<HootersFeedbackProps>
                    form={form}
                    emailQuestion={emailQuestion}
                    fullNameQuestion={fullNameQuestion}
                    businessCountry={businessCountry}
                    setIsLastFeedbackMoreThanOneDay={setIsLastFeedbackMoreThanOneDay}
                    businessId={businessId || ''}
                  />
                )
              }
              <div className='flex flex-col gap-2 text-center items-center justify-center py-2'>
                <Separator.Root
                  className='SeparatorRoot bg-hooters h-1.5 rounded-full mb-4'
                  style={{ width: '15%' }}
                />

                {currentStepIndex === 0 && (
                  <StarRatingQuestion<HootersFeedbackProps>
                    form={form}
                    question={courtesyQuestion}
                    nextStep={() => {
                      if (!form.watch('Courtesy')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      if (!form.watch('FullName') || !form.watch('Email')) {
                        console.log(formUserDataErrorMessage)
                        toast({
                          title: formUserDataErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    businessCountry={businessCountry}
                    formName='Courtesy'
                    variant='hooters'
                  />
                )}

                {currentStepIndex === 1 && (
                  <StarRatingQuestion<HootersFeedbackProps>
                    form={form}
                    question={courtesyQuestion}
                    nextStep={() => {
                      if (!form.watch('PlaceCleanness')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='PlaceCleanness'
                    variant='hooters'
                  />
                )}

                {currentStepIndex === 2 && (
                  <StarRatingQuestion<HootersFeedbackProps>
                    form={form}
                    question={courtesyQuestion}
                    nextStep={() => {
                      if (!form.watch('Quickness')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='Quickness'
                    variant='hooters'
                  />
                )}

                {currentStepIndex === 3 && (
                  <StarRatingQuestion<HootersFeedbackProps>
                    form={form}
                    question={courtesyQuestion}
                    nextStep={() => {
                      if (!form.watch('FoodQuality')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='FoodQuality'
                    variant='hooters'
                  />
                )}

                {currentStepIndex === 4 && (
                  <StarRatingQuestion<HootersFeedbackProps>
                    form={form}
                    question={courtesyQuestion}
                    nextStep={() => {
                      if (!form.watch('Climate')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='Climate'
                    variant='hooters'
                  />
                )}

                {currentStepIndex === 5 && (
                  <StarRatingQuestion<HootersFeedbackProps>
                    form={form}
                    question={courtesyQuestion}
                    nextStep={() => {
                      if (!form.watch('Experience')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='Experience'
                    variant='hooters'
                  />
                )}

                {currentStepIndex === 6 && (
                  <RecommendingQuestion
                    form={form}
                    question={recommendingQuestion}
                    yesButton={yesButton}
                    noButton={noButton}
                    handleResponse={handleRecommendingQuestion}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    isRecommendingClicked={isRecommendingClicked}
                  >
                  </RecommendingQuestion>
                )}

                {currentStepIndex === 7 && (
                  <ComeBackQuestion
                    form={form}
                    question={comeBackQuestion}
                    yesButton={yesButton}
                    noButton={noButton}
                    handleResponse={handleComeBackQuestion}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    isComeBackClicked={isComeBackClicked}
                  >
                  </ComeBackQuestion>
                )}
              </div>

              <div className={'md:grid md:space-y-0 items-center'}>
                <Stepper activeStep={0} alternativeLabel connector={<CustomStepperConnector />}>
                  {steps.map((label, index) => (
                    <Step
                      key={index}
                      onClick={() => {
                        if (index < 7 && index <= currentStepIndex) goTo(index)
                      }}
                      active={index === currentStepIndex}
                      completed={index < currentStepIndex}>
                      <StepLabel StepIconComponent={CustomStepperIconsHooters}>
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>

              {
                currentStepIndex === 6 && recommending != null && (
                  <FormField
                    control={form.control}
                    name='RecommendingText'
                    render={({ field }) => (
                      <FormItem className='pt-5 md:grid md:space-y-0 items-center text-center md:gap-12'>
                        <Stack spacing={2}>
                          <FormLabel className='col-span-3 text-xl'>
                            <h4 className={'text-hooters'}><b>{whyText}</b></h4>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={recommending ? recommendingPlaceholder : noRecommendingPlaceholder}
                              className={'border-2 border-gray-300 rounded-lg focus:border-gray-500'}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </Stack>
                      </FormItem>
                    )}
                  />
                )
              }
              {
                currentStepIndex === 7 && comeBack === true && (
                  <>
                    <FormField
                      control={form.control}
                      name='ComeBackText'
                      render={({ field }) => (
                        <FormItem className='pt-5 md:grid md:space-y-0 items-center text-center md:gap-12'>
                          <Stack spacing={2}>
                            <FormLabel className='col-span-3 text-xl'>
                              <h4 className={'text-hooters'}><b>{whyText}</b></h4>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={recommendingPlaceholder}
                                className={'border-2 border-gray-300 rounded-lg focus:border-gray-500'}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </Stack>
                        </FormItem>
                      )}
                    />
                    {watchFullName && (
                      <p className='text-center mt-2 text-lg'>
                        <b className={'text-hooters uppercase'}>{watchFullName}</b>, {submitText1}
                        <b className={'text-hooters uppercase'}>{submitButton}</b>{submitText2}
                        <b className={'text-hooters uppercase'}>Google</b> {submitText3}
                        <b className={'text-hooters uppercase'}>{submitText4}</b> {submitText5}
                      </p>
                    )}
                  </>
                )
              }
              {
                currentStepIndex === 7 && comeBack === false && (
                  <div
                    className='pt-5 grid-rows-3 sm:space-y-1 items-center text-center gap-5 md:gap-4 sm:gap-5 justify-center text-gray-900'>
                    <>
                      <FormItem>
                        <FormLabel className='col-span-3 text-question text-lg'>
                          {toImproveText}
                        </FormLabel>
                      </FormItem>
                      <div
                        className='grid grid-cols-3 gap-1 sm:gap-2 text-question font-medium my-3 md:py-3 sm:py-1 md:mx-28 sm:mx-5'>
                        <FormField
                          control={form.control}
                          name='Food'
                          render={({ field }) => (
                            <FormItem
                              className={cn(' items-center rounded-md border py-1 sm:py-2 shadow hover:border-hooters hover:text-hooters transition-all', {
                                'border-hooters text-hooters': field.value
                              })}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className='sr-only'
                                />
                              </FormControl>
                              <FormLabel
                                className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer hover:border-hooters hover:text-hooters transition-all', {
                                  'border-hooters text-hooters': field.value
                                })}
                              >
                                <IconToolsKitchen />
                                <p className='w-full text-[10px] sm:text-[11px]'>
                                  {foodButton}
                                </p>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='Service'
                          render={({ field }) => (
                            <FormItem
                              className={cn(' items-center rounded-md border py-1 sm:py-2 shadow hover:border-hooters hover:text-hooters transition-all', {
                                'border-hooters text-hooters': field.value
                              })}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className='sr-only'
                                />
                              </FormControl>
                              <FormLabel
                                className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer hover:border-hooters hover:text-hooters transition-all', {
                                  'border-hooters text-hooters': field.value
                                })}
                              >
                                <IconUserScan />
                                <p className='w-full text-[10px] sm:text-[11px]'>
                                  {serviceButton}
                                </p>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='Ambience'
                          render={({ field }) => (
                            <FormItem
                              className={cn(' items-center rounded-md border py-1 sm:py-2 shadow hover:border-hooters hover:text-hooters transition-all', {
                                'border-hooters text-hooters': field.value
                              })}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className='sr-only'
                                />
                              </FormControl>
                              <FormLabel
                                className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer hover:border-hooters hover:text-hooters transition-all', {
                                  'border-hooters text-hooters': field.value
                                })}
                              >
                                <IconBuildingStore />
                                <p className='w-full text-[10px] sm:text-[11px]'>
                                  {ambienceButton}
                                </p>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      {
                        form.formState.errors.hiddenInput
                          ? <FormMessage>{chooseOneOptionError}</FormMessage>
                          : null
                      }
                      <FormField
                        control={form.control}
                        name='ImproveText'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='col-span-3 text-question text-lg'>
                              {shareDetailsText} <b className={'text-hooters'}>Hooters</b>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className={'border-2 border-gray-300 rounded-lg focus:border-gray-500'}
                                placeholder={shareDetailsPlaceholder}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  </div>
                )
              }
              {
                // "Next" button is only shown on question 7
                currentStepIndex === 6 && isRecommendingClicked.current != null && (
                  <div>
                    <Button
                      type='button'
                      variant={'hootersPrimary'}
                      size={'hootersLarge'}
                      onClick={handleNextStep}
                    >
                      {nextButton}
                    </Button>
                  </div>
                )
              }
            </div>
            {
              currentStepIndex === 7 && comeBack != null && (
                <>
                  <Button
                    variant={'hootersPrimary'}
                    size={'hootersLarge'}
                    type='submit' disabled={
                      !isTermsChecked || isLastFeedbackMoreThanOneDay
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
                              </a> {termsAndConditions3} <a className='text-primary hover:underline'
                                href='https://qikstarts.com/privacy-policy'
                                rel='noopener noreferrer'
                                target='_blank'>{termsAndConditions4}</a>.
                            </small>
                          </>
                        </FormControl>
                      )}
                    />
                  </CardFooter>
                </>
              )
            }
          </form>
        </Form>
      </div>
    </>
  )
}
