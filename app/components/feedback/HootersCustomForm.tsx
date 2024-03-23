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
import { Dispatch, SetStateAction, useState } from 'react'
import {
  ratingOptionsFrom1To10
} from '@/app/constants/form'
import { CustomerRole } from '@/app/types/customer'
import getFormTranslations from '@/app/constants/formTranslations';
import StartsRatingGroup from '../form/StartsRatingGroup';

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
      <div className='mx-auto py-12 lg:py-24 max-w-3xl px-6 min-h-screen' id='form'>
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
                  {/* name */}
                  <FormField
                    control={form.control}
                    name='FullName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {fullNameQuestion}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Ej: Juan Pérez' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='Email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {emailQuestion}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Ej: juan@gmail.com'
                            {...field}
                            type='email'
                            onBlur={async () => {
                              const email = field.value
                              if (email) {
                                const customerData = await findCustomerDataByEmail(email)
                                if (customerData) {
                                  form.setValue('FullName', customerData.name)
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='WaiterService'
                    render={({ field }) => (
                      <FormItem className='md:grid md:grid-cols-4 md:space-y-0 md:items-center md:gap-12'>
                        <FormLabel className='col-span-3' >  
                            {waiterServiceQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='PlaceCleanness'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {placeCleannessQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='Quickness'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {quicknessQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='FoodQuality'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {foodQualityQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='Ambience'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {ambienceQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='Courtesy'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {courtesyQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='LatelySeen'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {latelySeenQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='Spending'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {spendingQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='Recommending'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {recommendingQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name='Experience'
                    render={({ field }) => (
                      <FormItem className='md:grid grid-cols-4 space-y-0 items-center gap-12'>
                        <FormLabel className='col-span-3' >  
                            {experienceQuestion}
                        </FormLabel>
                        <div className='pt-2 md:pb-0 col-span-1' >
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <StartsRatingGroup value={field.value} items={ratingOptionsFrom1To10} className='grid-cols-5' />
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
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
