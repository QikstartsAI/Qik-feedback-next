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
import PlaceCleannessQuestion from "@/app/components/feedback/questions/PlaceCleannessQuestion";
import QuicknessQuestion from "@/app/components/feedback/questions/QuicknessQuestion";
import FoodQualityQuestion from "@/app/components/feedback/questions/FoodQualityQuestion";
import AmbienceQuestion from "@/app/components/feedback/questions/AmbienceQuestion";
import CourtesyQuestion from "@/app/components/feedback/questions/CourtesyQuestion";
import RecommendingQuestion from './questions/RecommendingQuestion'
import ExperienceQuestion from "@/app/components/feedback/questions/ExperienceQuestion";
import ComeBackQuestion from "@/app/components/feedback/questions/ComeBackQuestion";
import {Step, StepLabel, Stepper} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import {Textarea} from "@/app/components/ui/TextArea";

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

  const businessCountry = business?.Country || 'EC'
  const questionsNumber = 8

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
  } = getFormTranslations({businessCountry})

  const {
    nextStep,
    goTo,
    currentStepIndex,
  } = useMultistepForm(questionsNumber);

  const steps = ['', '', '', '', '', '', '', ''];

  const handleStepChange = (event: React.ChangeEvent<unknown>, value: number) => {
    goTo(value-1)
  }

  const handleRecommendingQuestion = (answer: boolean) => {
    setRecommending(answer)
  }

  const handleComeBackQuestion = (answer: boolean) => {
    setComeBack(answer)
  }

  async function onSubmit(data: HootersFeedbackProps) {
    setRating(data.Courtesy)

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
                      <CourtesyQuestion form={form} question={courtesyQuestion} nextStep={nextStep}>
                      </CourtesyQuestion>
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
                      <ExperienceQuestion form={form} question={experienceQuestion} nextStep={nextStep}>
                      </ExperienceQuestion>
                    )}

                    {currentStepIndex === 6 && (
                      <RecommendingQuestion
                        form={form}
                        question={recommendingQuestion}
                        yesButton={yesButton}
                        noButton={noButton}
                        handleResponse={handleRecommendingQuestion}
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
                      >
                      </ComeBackQuestion>
                    )}
                  </div>

                  <a onClick={() => {
                    if(currentStepIndex > 0) goTo(currentStepIndex-1);
                  }}>
                    <ChevronLeftIcon color={'primary'}></ChevronLeftIcon>
                  </a>

                  <Stack spacing={1}>
                    <Stepper activeStep={0} alternativeLabel>
                      {steps.map((label, index) => (
                        <Step key={label} active={index <= currentStepIndex}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Stack>

                  {
                    currentStepIndex === 6 && recommending === true && (
                      <div>
                        <h2>
                          { whyText }
                        </h2>
                        <Textarea
                          aria-label="minimum height"
                          minLength={3}
                          placeholder={recommendingPlaceholder}
                        />
                      </div>
                    )
                  }

                  {
                    currentStepIndex === 6 && recommending === false && (
                      <div>
                        <h2>
                          { whyText }
                        </h2>
                        <Textarea aria-label="minimum height" minLength={3} placeholder={noRecommendingPlaceholder} />
                      </div>
                    )
                  }

                  {
                    currentStepIndex === 7 && comeBack === true && (
                      <div>
                        <h2>
                          { whyText }
                        </h2>
                        <Textarea
                          aria-label="minimum height"
                          minLength={3}
                          placeholder={recommendingPlaceholder}
                        />

                        <p>
                          <b>RICARDO</b> { submitText1 } <b>{ submitButton }</b> { submitText2 } <b>Google</b>
                          { submitText3 } <b>{ submitText4 }</b> { submitText5 }
                        </p>
                      </div>
                    )
                  }

                  {
                    currentStepIndex === 7 && comeBack === false && (
                      <div className={'space-y-3'}>
                        <h4>{ toImproveText }</h4>
                        <Stack direction={'row'} spacing={1}>
                          <Button type={'button'}>
                            <div>
                              <RestaurantIcon />
                              <p>{ foodButton }</p>
                            </div>
                          </Button>
                          <Button type={'button'}>
                            <div>
                              <PeopleOutlinedIcon />
                              <p>{ serviceButton }</p>
                            </div>
                          </Button>
                          <Button type={'button'}>
                            <div>
                              <StorefrontOutlinedIcon />
                              <p>{ ambienceButton }</p>
                            </div>
                          </Button>
                        </Stack>
                        <h4>{ shareDetailsText } <b>Hooters</b></h4>
                        <Textarea aria-label="minimum height" minLength={3} placeholder={shareDetailsPlaceholder} />
                      </div>
                    )
                  }

                  {
                    // "Next" button is only shown on question 7
                    currentStepIndex === 6 && (
                      <div>
                        <Button
                          type='button'
                          onClick={() => {nextStep()}}
                        >
                          {nextButton}
                        </Button>
                      </div>
                    )
                  }
                </div>
                {
                  currentStepIndex === 7 && (
                    <a href={'https://g.co/kgs/KJSCBCu'} target={'_blank'} rel={'noopener noreferrer'}>
                      <Button
                        type='submit' disabled={
                        !isTermsChecked
                          ? true
                          : form.formState.isSubmitting
                      }
                      >
                        {submitButton}
                      </Button>
                    </a>
                  )
                }

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
