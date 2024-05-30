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
import { GusFeedbackProps, gusFeedbackSchema } from '@/app/validators/gusFeedbackSchema';
import handleSubmitHootersForm from '@/app/lib/handleSubmitHootersForm'
import handleGusFeedbackSubmit from '@/app/lib/handleGusFeedbackSubmit'
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
import { Step, StepLabel, Stepper } from "@mui/material";
import { Textarea } from "@/app/components/ui/TextArea";
import { Checkbox } from '../../ui/Checkbox'
import { IconToolsKitchen } from '@tabler/icons-react';
import { IconUserScan } from '@tabler/icons-react';
import { IconBuildingStore } from '@tabler/icons-react';
import CustomStepperIcons, { CustomStepperIconsGus } from "@/app/components/form/CustomStepperIcons";
import CustomStepperConnector from "@/app/components/form/CustomStepperConnector";
import StarRatingQuestion from '../questions/StarRatingQuestion'
import BooleanQuestion from '../questions/BooleanQuestion'
import { useSearchParams } from 'next/navigation'

interface GusCustomFormProps {
  business: Business | null
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
  setRating: Dispatch<SetStateAction<string>>
  customerType: CustomerRole
}

export default function GusCustomForm({ business, setIsSubmitted, setRating, customerType }: GusCustomFormProps) {
  const [isTermsChecked, setIsTermsChecked] = useState(true)
  const [recommending, setRecommending] = useState<boolean | null>(null)
  const [comeBack, setComeBack] = useState<boolean | null>(null)
  const [reception, setReception] = useState<boolean | null>(true)
  const [isLastFeedbackMoreThanOneDay, setIsLastFeedbackMoreThanOneDay] = useState<boolean | undefined>(false)
  const searchParams = useSearchParams()

  const businessId = searchParams.get('id')
  const businessCountry = business?.Country || 'EC'
  const questionsNumber = 9

  const isReceptiongClicked = React.useRef(null);
  const isRecommendingClicked = React.useRef(null);
  const isComeBackClicked = React.useRef(null);

  const { toast } = useToast()

  const form = useForm<GusFeedbackProps>({
    resolver: zodResolver(gusFeedbackSchema()),
    defaultValues: {
      FullName: '',
      AcceptTerms: isTermsChecked,
      Email: '',
      Treatment: undefined,
      Reception: false,
      ReceptionText: '',
      ProductTaste: undefined,
      CashServiceSpeed: undefined,
      ProductDeliverySpeed: undefined,
      PlaceCleanness: undefined,
      Satisfaction: undefined,
      Recommending: false,
      ComeBack: false,
      StartTime: new Date(),
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
    fullNameQuestion,
    emailQuestion,
    nextButton,
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

  const steps = ['', '', '', '', '', '', '', '', ''];

  const handleReceptionQuestion = (answer: boolean) => {
    setReception(answer)
  }

  const handleRecommendingQuestion = (answer: boolean) => {
    setRecommending(answer)
  }

  const handleComeBackQuestion = (answer: boolean) => {
    setComeBack(answer)
  }

  const handleRedirect = () => {
    window.location.replace(business?.MapsUrl || '')
  }


  async function onSubmit(data: GusFeedbackProps) {
    const { Ambience, Service, Food, ImproveText, ComeBackText, } = data
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
      await handleGusFeedbackSubmit(updatedData, improveOptions, customerType, attendantName, customerNumberOfVisits, feedbackNumberOfVisit)
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
  const isRecommendingTextEmpty = form.watch('RecommendingText') === ''
  return (
    <>
      <div className='mx-auto py-8 lg:py-18 max-w-xl px-6 min-h-screen text-colorText' id='form'>
        <h4 className={'text-center font-medium text-colorText'}>
          Valoramos tu opinión 😊, te llevará menos de
          <span className='text-gus font-medium'>
            <b> 1 minuto</b>
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
                  <UserInfo<GusFeedbackProps>
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
                  className='SeparatorRoot bg-gus h-1.5 rounded-full mb-4'
                  style={{ width: '15%' }}
                />

                {currentStepIndex === 0 && (
                  <StarRatingQuestion<GusFeedbackProps>
                    form={form}
                    question='¿Cómo califica el trato recibido el dia de hoy?'
                    nextStep={() => {
                      if (!form.watch('Treatment')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      if (!form.watch('FullName') || !form.watch('Email')) {
                        toast({
                          title: 'Ayúdanos con tus datos antes de seguir',
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    businessCountry={businessCountry}
                    formName='Treatment'
                    variant='gus'
                  />
                )}
                {currentStepIndex === 1 && (
                  <BooleanQuestion
                    form={form}
                    question='¿Recibió correctamente todo lo que solicitó? (evaluar todo: producto, servilletas, salsas, sabor y tamaño de bebidas, etc.)'
                    yesButton='Sí'
                    noButton='No'
                    handleResponse={handleReceptionQuestion}
                    nextStep={() => {
                      if (!form.watch('Reception')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    isQuestionClicked={isReceptiongClicked}
                    formName='Reception'
                  />
                )}
                {
                  currentStepIndex === 1 && !reception && (
                    <FormField
                      control={form.control}
                      name='ReceptionText'
                      render={({ field }) => (
                        <FormItem className='pt-5 md:grid md:space-y-0 items-center text-center md:gap-12'>
                          <Stack spacing={2}>
                            <FormLabel className='col-span-3 text-xl'>
                              <h4 className={'text-gus'}>
                                <b>¿Que no recibió correctamente?</b>
                              </h4>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Ej: se equivocaron en el tamaño de...'
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
                {currentStepIndex === 2 && (
                  <StarRatingQuestion<GusFeedbackProps>
                    form={form}
                    question='¿Cuánto le gustó el producto que consumió?'
                    nextStep={() => {
                      if (!form.watch('ProductTaste')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='ProductTaste'
                    variant='gus'
                  />
                )}

                {currentStepIndex === 3 && (
                  <StarRatingQuestion<GusFeedbackProps>
                    form={form}
                    question='¿Cómo califica la velocidad del servicio en caja?'
                    nextStep={() => {
                      if (!form.watch('CashServiceSpeed')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='CashServiceSpeed'
                    variant='gus'
                  />
                )}

                {currentStepIndex === 4 && (
                  <StarRatingQuestion<GusFeedbackProps>
                    form={form}
                    question='¿Cómo califica la velocidad en la entrega del producto (despacho)?'
                    nextStep={() => {
                      if (!form.watch('ProductDeliverySpeed')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='ProductDeliverySpeed'
                    variant='gus'
                  />
                )}
                {currentStepIndex === 5 && (
                  <StarRatingQuestion<GusFeedbackProps>
                    form={form}
                    question='¿Cómo califica la limpieza general del local? (salón, suelo, mesas y sillas, baños)'
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
                    variant='gus'
                  />
                )}
                {currentStepIndex === 6 && (
                  <StarRatingQuestion<GusFeedbackProps>
                    form={form}
                    question='En base a sus experiencia en Gus ¿Cuán satisfecho se encuentra?'
                    nextStep={() => {
                      if (!form.watch('Satisfaction')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    businessCountry={businessCountry}
                    formName='Satisfaction'
                    variant='gus'
                  />
                )}
                {currentStepIndex === 7 && (
                  <BooleanQuestion
                    form={form}
                    question='¿Recomendaría a Gus a amigos y familiares?'
                    yesButton='Sí'
                    noButton='No'
                    handleResponse={handleRecommendingQuestion}
                    nextStep={() => {
                      if (!form.watch('Recommending')) {
                        toast({
                          title: formErrorMessage,
                          variant: 'hootersDestructive'
                        })
                      }
                      else goTo(currentStepIndex + 1)
                    }}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    isQuestionClicked={isRecommendingClicked}
                    formName='Recommending'
                  />
                )}
                {
                  currentStepIndex === 7 && recommending != null && (
                    <FormField
                      control={form.control}
                      name='RecommendingText'
                      render={({ field }) => (
                        <FormItem className='pt-5 md:grid md:space-y-0 items-center text-center md:gap-12 w-full'>
                          <Stack spacing={2}>
                            <FormLabel className='col-span-3 text-xl'>
                              <h4 className={'text-gus'}><b>{whyText}</b></h4>
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
                {currentStepIndex === 8 && (
                  <BooleanQuestion
                    form={form}
                    question='¿Regresaría a Gus?'
                    yesButton='Sí'
                    noButton='No'
                    handleResponse={handleComeBackQuestion}
                    prevStep={() => { goTo(currentStepIndex - 1) }}
                    isQuestionClicked={isComeBackClicked}
                    formName='ComeBack'
                  />
                )}
              </div>
              <div className={'md:grid md:space-y-0 items-center'}>
                <Stepper activeStep={0} alternativeLabel connector={<CustomStepperConnector />}>
                  {steps.map((label, index) => (
                    <Step
                      key={index}
                      onClick={() => {
                        if (index < 8 && index <= currentStepIndex) goTo(index)
                      }}
                      active={index === currentStepIndex}
                      completed={index < currentStepIndex}>
                      <StepLabel StepIconComponent={CustomStepperIconsGus}>
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
              {
                currentStepIndex === 8 && comeBack === true && (
                  <>
                    <FormField
                      control={form.control}
                      name='ComeBackText'
                      render={({ field }) => (
                        <FormItem className='pt-5 md:grid md:space-y-0 items-center text-center md:gap-12'>
                          <Stack spacing={2}>
                            <FormLabel className='col-span-3 text-xl'>
                              <h4 className={'text-gus'}><b>{whyText}</b></h4>
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
                        <b className={'text-gus uppercase'}>{watchFullName}</b>, {submitText1}
                        <b className={'text-gus uppercase'}>{submitButton}</b>{submitText2}
                        <b className={'text-gus uppercase'}>Google</b> {submitText3}
                        <b className={'text-gus uppercase'}>{submitText4}</b> {submitText5}
                      </p>
                    )}
                  </>
                )
              }

              {
                currentStepIndex === 8 && comeBack === false && (
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
                              className={cn(' items-center rounded-md border py-1 sm:py-2 shadow hover:border-hooters hover:text-gus transition-all', {
                                'border-hooters text-gus': field.value
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
                                className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer hover:border-hooters hover:text-gus transition-all', {
                                  'border-hooters text-gus': field.value
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
                              className={cn(' items-center rounded-md border py-1 sm:py-2 shadow hover:border-hooters hover:text-gus transition-all', {
                                'border-hooters text-gus': field.value
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
                                className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer hover:border-hooters hover:text-gus transition-all', {
                                  'border-hooters text-gus': field.value
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
                              className={cn(' items-center rounded-md border py-1 sm:py-2 shadow hover:border-hooters hover:text-gus transition-all', {
                                'border-hooters text-gus': field.value
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
                                className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer hover:border-hooters hover:text-gus transition-all', {
                                  'border-hooters text-gus': field.value
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
                              {shareDetailsText} <b className={'text-gus'}>Hooters</b>
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
            </div>
            {
              currentStepIndex === 8 && comeBack != null && (
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
