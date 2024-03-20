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

import { currencyPrices } from '@/app/constants/prices'

import 'react-phone-number-input/style.css'

import { Input } from '../ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/app/lib/utils'
import { useToast } from '@/app/hooks/useToast'
import { FeedbackProps, feedbackSchema } from '@/app/validators/feedbackSchema'
import { RadioGroup } from '../ui/RadioGroup'
import { Ratings } from '@/app/types/feedback'
import handleSubmitFeedback from '@/app/lib/handleSubmit'
import { findCustomerDataByEmail } from '@/app/lib/handleEmail'
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert'
import { Business } from '@/app/types/business'
import { Dispatch, SetStateAction, useState } from 'react'
import CustomRadioGroup from '../form/CustomRadioGroup'
import {
  getImprovements,
  ratingOptionsFrom1To10
} from '@/app/constants/form'
import { SelectedOption } from '@/app/types/general'
import { CustomerRole } from '@/app/types/customer'
import getFormTranslations from '@/app/constants/formTranslations';

interface HootersCustomFormProps {
  business: Business | null
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
  setRating: Dispatch<SetStateAction<string>>
  customerType: CustomerRole
}

export default function HootersCustomForm({ business, setIsSubmitted, setRating, customerType }: HootersCustomFormProps) {
  const [isChecked, setIsChecked] = useState(false)
  const [isTermsChecked, setIsTermsChecked] = useState(true)
  const businessCountry = business?.Country || 'EC'

  const { toast } = useToast()

  const form = useForm<FeedbackProps>({
    resolver: zodResolver(
      feedbackSchema(
        currencyPrices[businessCountry],
        businessCountry
      )
    ),
    defaultValues: {
      FullName: '',
      PhoneNumber: '',
      AcceptPromotions: isChecked,
      AcceptTerms: isTermsChecked,
      BirthdayDate: '',
      Email: '',
      Origin: undefined,
      Rating: undefined,
      StartTime: new Date(),
      Ambience: false,
      Food: false,
      Service: false,
      ImproveText: '',
      hiddenInput: null
    }
  })

  const resetForm = () => {
    form.reset()
  }

  const { watch } = form
  const watchRating = watch('Rating')
  const isLowRating = watchRating === Ratings.Mal || watchRating === Ratings.Regular
  const isUsCountry = businessCountry === 'US'
  const isCaCountry = businessCountry === 'CA'
  const isFrCountry = businessCountry === 'FR'
  const watchFullName = watch('FullName')
  const waiterName = business?.Waiter?.name || ''
  const attendantName = waiterName ? waiterName : 'Matriz';

  const handleRedirect = () => {
    window.location.replace(business?.MapsUrl || '')
  }

  async function onSubmit(data: FeedbackProps) {
    setRating(data.Rating)
    const { Ambience, Service, Food, ImproveText } = data
    if (isLowRating && (!Ambience && !Service && !Food)) {
      form.setError('hiddenInput', {
        type: 'manual',
        message: isUsCountry
          ? 'Select at least one option'
          : isCaCountry || isFrCountry
            ? 'Sélectionnez au moins une option'
            : 'Selecciona al menos una opción'
      })
      return
    }

    if (isLowRating && ImproveText.length === 0) {
      form.setError('ImproveText', {
        type: 'manual',
        message: isUsCountry
          ? 'Please tell us how can we improve'
          : isCaCountry || isFrCountry
            ? 'Veuillez écrire comment nous pouvons améliorer'
            : 'Por favor, escribe en que podemos mejorar'
      })
      return
    }

    try {
      const updatedData = data
      updatedData.ImproveText = isLowRating ? ImproveText : ''
      updatedData.AcceptPromotions = isChecked
      const improveOptions = isLowRating ? getImprovements({ Ambience, Service, Food, business }) : []
      await handleSubmitFeedback(updatedData, improveOptions, customerType, attendantName)
      if ((data.Rating === Ratings.Bueno || data.Rating === Ratings.Excelente) && business?.MapsUrl) {
        handleRedirect()
      }
    } catch (error) {
      console.log(error)
      toast({
        title: isUsCountry
          ? 'An error occurred, try again'
          : isCaCountry || isFrCountry
            ? "Une erreur s'est produite, réessayez"
            : 'Ocurrio un error, intenta nuevamente',
        variant: 'destructive'
      })
    } finally {
      resetForm()
      setIsSubmitted(true)
    }
  }

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
  } = getFormTranslations({businessCountry})

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
                                  form.setValue('PhoneNumber', customerData.phoneNumber || '')
                                  form.setValue('BirthdayDate', customerData.birthdayDate || '')
                                  setIsChecked(customerData.acceptPromotions || false)
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
                    name='Dinners'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <FormLabel>  
                          {waiterServiceQuestion}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className=''
                          >
                            <CustomRadioGroup value={field.value} items={ratingOptionsFrom1To10} className='sm:grid-cols-10' />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!isLowRating && watchFullName
                  ? (
                    <Alert>
                      <AlertTitle className={cn('text-xs sm:text-sm')}>
                        {
                          isUsCountry
                            ? 'Last favor'
                            : isCaCountry || isFrCountry
                              ? 'Une dernière faveur'
                              : 'Un último favor'
                        }, {watchFullName}!
                      </AlertTitle>
                      <AlertDescription className={cn('text-xs sm:text-sm')}>
                        {
                          isUsCountry
                            ? 'When you submit, you will be directed to Google to rate our business with stars 🌟.'
                            : isCaCountry || isFrCountry
                              ? "L'envoyer sera dirigé vers Google pour améliorer notre emploi avec des étoiles 🌟."
                              : 'Al enviar, serás dirigido a Google, para calificar nuestro emprendimiento con estrellas 🌟.'
                        }
                        <br />
                        {
                          isUsCountry
                            ? 'Your opinion helps us so that more people know about us and we stand out in the sector. Thank you! 😍'
                            : isCaCountry || isFrCountry
                              ? 'Votre avis nous aide à ce que les plus grandes personnes connaissent nos gens et nous dévastent le secteur. Merci ! 😍'
                              : 'Tu opinión nos ayuda a que más personas conozcan de nosotros y destaquemos en el sector. ¡Gracias! 😍'
                        }
                      </AlertDescription>
                    </Alert>
                  )
                  : null}
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
