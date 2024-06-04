/* eslint-disable react/jsx-handler-names */
import {Button} from '../ui/Button'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/Form'
import {Card, CardContent, CardFooter} from '../ui/Card'

import {currencyPrices} from '@/app/constants/prices'
import {phoneNumbersPlaceholders} from '@/app/constants/placeholders'

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import {Input} from '../ui/Input'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {cn, lastFeedbackFilledIsGreaterThanOneDay} from '@/app/lib/utils'
import {IconBuildingStore, IconToolsKitchen, IconUsers} from '@tabler/icons-react'
import {useToast} from '@/app/hooks/useToast'
import {FeedbackProps, feedbackSchema} from '@/app/validators/feedbackSchema'
import {RadioGroup} from '../ui/RadioGroup'
import {Origins, Ratings} from '@/app/types/feedback'
import handleSubmitFeedback from '@/app/lib/handleSubmit'
import {
  findCustomerDataByEmail,
  findCustomerFeedbackDataInBusiness,
  getCustomerDataInBusiness
} from '@/app/lib/handleEmail'
import {Checkbox} from '../ui/Checkbox'
import {Textarea} from '../ui/TextArea'
import {Business} from '@/app/types/business'
import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react'
import CustomRadioGroup from '../form/CustomRadioGroup'
import Modal from '../ui/Modal'
import {
  getAverageTicket,
  getCustomersQuantity,
  getImprovements,
  getKnownOrigins,
  getOriginLabel,
  getOtherOptions,
  getOtherOriginValues,
  getOthersText
} from '@/app/constants/form'
import RatingRadioGroup from '../form/RatingRadioGroup'
import RewardsApproval from '../form/RewardsApproval';
import {SelectedOption} from '@/app/types/general'
import {Customer, CustomerRole} from '@/app/types/customer'
import GoogleReviewMessage from '../form/GoogleReviewMessage'
import {useSearchParams} from 'next/navigation'
import loyaltyService from "@/app/services/loyaltyService";
import {DocumentData, DocumentSnapshot} from 'firebase/firestore'
import {BirthdayOption} from "@/app/types/loyalty";


interface FeedbackFormProps {
  business: Business | null
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
  setRating: Dispatch<SetStateAction<string>>
  customerType: CustomerRole
  setCustomerName: Dispatch<SetStateAction<string>>
}

export default function FeedbackForm({ business, setIsSubmitted, setRating, setCustomerName, customerType }: FeedbackFormProps) {
  const searchParams = useSearchParams()

  const [isChecked, setIsChecked] = useState(false)
  const [isTermsChecked, setIsTermsChecked] = useState(true)

  const [showOtherOptionsModal, setShowOtherOptionsModal] = useState<boolean>(false)
  const [selectedOtherOption, setSelectedOtherOption] = useState<SelectedOption | null>(null)

  const [isCustomerInBusiness, setIsCustomerInBusiness] = useState<boolean>(false)
  const [isLastFeedbackMoreThanOneDay, setIsLastFeedbackMoreThanOneDay] = useState<boolean | undefined>(false)
  const [showLastFeedbackFilledModal, setShowLastFeedbackFilledModal] = useState<boolean | undefined>(false)

  const [showLoyaltyWelcomeModal, setShowLoyaltyWelcomeModal] = useState<boolean>(false)

  const [isRewardButtonClicked, setIsRewardButtonClicked] = useState<boolean>(false)

  const [customerData, setCustomerData] = useState<Customer | null>();
  const [customerDataInBusiness, setCustomerDataInBusiness] = useState<Customer | null>();
  const [userApprovesLoyalty, setUserApprovesLoyalty] = useState<boolean>(false)
  const businessId = searchParams.get('id')
  const branchId = searchParams.get('sucursal')
  const waiterId = searchParams.get('mesero')

  // Loyalty birthday benefits
  const hasUserBirthdayBenefits = useRef<boolean>(false);

  const { toast } = useToast()

  const form = useForm<FeedbackProps>({
    resolver: zodResolver(
      feedbackSchema(
        currencyPrices[business?.Country || 'EC'],
        business?.Country || 'EC'
      )
    ),
    defaultValues: {
      UserApprovesLoyalty: false,
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

  const { watch } = form
  const watchRating = watch('Rating')
  const watchEmail = watch('Email')

  const isLowRating = watchRating === Ratings.Mal || watchRating === Ratings.Regular
  const isUsCountry = business?.Country === 'US' || business?.Country === 'HK'
  const isCaCountry = business?.Country === 'CA'
  const isFrCountry = business?.Country === 'FR'
  const watchFullName = watch('FullName')
  const waiterName = business?.Waiter?.name || ''
  const attendantName = waiterName ? waiterName : 'Matriz';

  useEffect(() => {
    if (customerData) {
      form.setValue('FullName', customerData.name);
      form.setValue('PhoneNumber', customerData.phoneNumber || '');
      form.setValue('BirthdayDate', customerData.birthdayDate || '');
      setIsChecked(customerData.acceptPromotions || false);
      setUserApprovesLoyalty(customerData?.userApprovesLoyalty || false)
      if (customerData.userApprovesLoyalty) {
        setIsRewardButtonClicked(true)
      }
      if(userApprovesLoyalty) {
        loyaltyService.getBirthdayDataFromBusiness(business).then(docSnap => {
          if(docSnap) {
            verifyBirthdayBenefit(customerData.birthdayDate, docSnap?.data());
            console.log('Has birthday benefits? ', hasUserBirthdayBenefits.current)
  
            if(hasUserBirthdayBenefits) {
              console.log('Birthday benefits: ', docSnap?.data());
            }
          }
        });
      }
    }
  }, [business, customerData, form, userApprovesLoyalty]);

  const resetForm = () => {
    form.reset()
  }

  const handleRedirect = () => {
    window.location.replace(business?.MapsUrl || '')
  }

  const handleOthersSelecteOption = (option: SelectedOption) => {
    form.setValue("Origin", option?.value as Origins)
    setSelectedOtherOption(option)
  }

  const handleUserApprovesLoyalty = (value: boolean) => {
    form.setValue('UserApprovesLoyalty', value)
    setShowLoyaltyWelcomeModal(value)
  }

  const handleEmailField = async (email: string) => {
    if (email && customerType === 'frequent') {
      setCustomerData(await findCustomerDataByEmail(email, businessId || ''))
      setCustomerDataInBusiness(await getCustomerDataInBusiness(email, businessId, branchId, waiterId))
      const lastFeedbackFilledInBusiness = customerDataInBusiness?.lastFeedbackFilled
      const lastFeedbackGreaterThanOneDay = lastFeedbackFilledIsGreaterThanOneDay(lastFeedbackFilledInBusiness)
      setIsCustomerInBusiness(customerDataInBusiness ? true : false)
      setShowLastFeedbackFilledModal(lastFeedbackGreaterThanOneDay)
      setIsLastFeedbackMoreThanOneDay(lastFeedbackGreaterThanOneDay)
    }
  }

  const verifyBirthdayBenefit = (userBirthday?: string, birthdayConfig?: DocumentData) => {
    if(!userBirthday) return;
    if(!birthdayConfig) return;

    const birthdayOption = birthdayConfig?.birthdayOption;
    const today = new Date();
    const userBirthdayDate = new Date(userBirthday);

    if (today.getMonth() === userBirthdayDate.getMonth() && today.getDay() === userBirthdayDate.getDay()) {
      hasUserBirthdayBenefits.current = true;
      return;
    }
    else {
      userBirthdayDate.setFullYear(today.getFullYear());
      const difference = today.getTime() - userBirthdayDate.getTime();
      const differenceDays = Math.floor(difference / (1000 * 60 * 60 * 24));

      if(birthdayOption === BirthdayOption.onTheDayAndthirtyDaysAfter && differenceDays <= 30) {
        hasUserBirthdayBenefits.current = true;
        return;
      }
      else if(birthdayOption === BirthdayOption.upToSixtyDaysAfter && differenceDays <= 60) {
        hasUserBirthdayBenefits.current = true;
        return;
      }
    }
  }

  async function onSubmit(data: FeedbackProps) {
    if(userApprovesLoyalty) {
      loyaltyService.getBirthdayDataFromBusiness(business).then(docSnap => {
        if(docSnap) {
          verifyBirthdayBenefit(data.BirthdayDate, docSnap?.data());
          console.log('Has birthday benefits? ', hasUserBirthdayBenefits.current)

          if(hasUserBirthdayBenefits) {
            console.log('Birthday benefits: ', docSnap?.data());
          }
        }
      });
    }

    setRating(data.Rating)
    setCustomerName(data.FullName)
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
      let customerNumberOfVisits = 0
      let feedbackNumberOfVisit = 0
      if (customerData) {
        const feedbackVisits = customerData.customerNumberOfVisits || 0
        customerNumberOfVisits = feedbackVisits + 1
        feedbackNumberOfVisit = feedbackVisits + 1
      } else {
        customerNumberOfVisits = 1
        feedbackNumberOfVisit = 1
      }

      await handleSubmitFeedback(updatedData, improveOptions, customerType, attendantName, customerNumberOfVisits, feedbackNumberOfVisit)
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

  return (
    <>
      <div className='mx-auto py-12 lg:py-24 max-w-xl px-6 min-h-screen' id='form'>
        {showOtherOptionsModal && (
          <Modal isOpen={true} onClose={() => setShowOtherOptionsModal(false)}>
            <ul
              className='flex flex-row flex-wrap justify-center items-center gap-3 text-sm font-medium text-gray-900 mt-5'
            >
              {
                getOtherOptions(business).map((option) => (
                  <li
                    key={option.value}
                    className='list-none'
                  >
                    <button
                      className={cn('flex justify-center items-center w-full px-3 bg-white border border-gray-200 rounded-lg py-1 cursor-pointer shadow hover:border-sky-500 hover:text-sky-500 transition-all', {
                        'border-sky-500 text-sky-500': selectedOtherOption?.value === option.value
                      })}
                      onClick={
                        () => handleOthersSelecteOption(option)
                      }
                    >
                      <p className='text-[10px]'>{option.label}</p>
                    </button>
                  </li>
                ))
              }
            </ul>
          </Modal>
        )}
        {
          showLastFeedbackFilledModal && (
            <Modal isOpen={true} onClose={() => setShowLastFeedbackFilledModal(false)}>
              <div className='text-center'>
                <p>
                  {
                    isUsCountry
                      ? 'Thank you! '
                      : isCaCountry || isFrCountry
                        ? 'Merci!'
                        : '¡Gracias!'
                  }
                </p>
                <p>
                  {
                    isUsCountry
                      ? '✌🏻 You have reached the daily survey limit. Until your next visit! 😉'
                      : isCaCountry || isFrCountry
                        ? "✌🏻 Vous avez atteint la limite quotidienne d'enquêtes. A votre prochaine visite ! 😉"
                        : '✌🏻 Has alcanzado el límite diario de encuestas. ¡Hasta tu próxima visita! 😉'
                  }
                </p>
              </div>
            </Modal>
          )
        }
        {
          showLoyaltyWelcomeModal && (
            <Modal isOpen={true} onClose={() => setShowLoyaltyWelcomeModal(false)}>
              <div className='text-center my-4'>
                <p>
                  {
                    isUsCountry
                      ? `You are already part of the ${business?.Name} rewards program, every visit is a new experience 💫.`
                      : isCaCountry || isFrCountry
                        ? `Vous faites déjà partie du programme de récompenses ${business?.Name}, chaque visite est une nouvelle expérience 💫.`
                        : `Ya eres parte del programa de recompensas de ${business?.Name}, cada visita es una experiencia nueva 💫.`
                  }
                </p>
              </div>
            </Modal>
          )
        }
        <Card>
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
                  <FormField
                    control={form.control}
                    name='Email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {
                            isUsCountry
                              ? 'Email'
                              : isCaCountry || isFrCountry
                                ? 'Courrier électronique'
                                : 'Correo electrónico'
                          }
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Ej: juan@gmail.com'
                            {...field}
                            type='email'
                            onChange={async (e: { target: { value: any } }) => {
                              field.onChange(e)
                              const email = e.target.value
                              await handleEmailField(email)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {

                  (customerData && !userApprovesLoyalty && customerType === 'frequent')
                  || (!customerData && watchEmail.includes('@')) ? (
                    <RewardsApproval
                      handleUserApprovesLoyalty={handleUserApprovesLoyalty}
                      setIsRewardButtonClicked={setIsRewardButtonClicked}
                    />
                  ) : null
                }
                {
                  isRewardButtonClicked
                  ? (
                    <>
                      <div
                        className={cn('space-y-3 mb-3', {})}
                      >
                        <FormField
                          control={form.control}
                          name='FullName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {
                                  isUsCountry
                                    ? 'Full name'
                                    : isCaCountry || isFrCountry
                                      ? 'Nom complet'
                                      : 'Nombre completo'
                                }
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
                          name='PhoneNumber'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {
                                  isUsCountry
                                    ? 'Phone (optional)'
                                    : isCaCountry || isFrCountry
                                      ? 'Téléphone (facultatif)'
                                      : 'Teléfono (opcional)'
                                }
                              </FormLabel>
                              <FormControl>
                                <PhoneInput
                                  {...field}
                                  placeholder={`Ej: ${phoneNumbersPlaceholders[business?.Country || 'EC']}`}
                                  defaultCountry={business?.Country}
                                  onChange={
                                    (value) => {
                                      form.setValue("PhoneNumber", value)
                                      setIsChecked(!!value)
                                    }
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='AcceptPromotions'
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <>
                                  <input
                                    type='checkbox'
                                    className='form-checkbox h-3 w-3 text-green-500'
                                    onChange={() => {
                                      const newChecked = !isChecked
                                      setIsChecked(newChecked)
                                      form.setValue("AcceptPromotions", newChecked)
                                    }}
                                    checked={isChecked}
                                  />
                                  <span className='ml-2 text-gray-700 text-xs'>
                                    {
                                      isUsCountry
                                        ? 'I agree to receive promotions'
                                        : isCaCountry || isFrCountry
                                          ? "J'accepte de recevoir des promotions"
                                          : 'Acepto recibir promociones'
                                    }
                                  </span>
                                </>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='BirthdayDate'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {
                                  isUsCountry
                                    ? 'Your birthday? 🎂 (optional)'
                                    : isCaCountry || isFrCountry
                                      ? 'Ton anniversaire? 🎂 (facultatif)'
                                      : '¿Tu fecha de cumpleaños? 🎂 (opcional)'
                                }
                              </FormLabel>
                              <FormControl>
                                <Input type='date' placeholder='Ej: 29/10/1999' max='2005-12-31' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* origin */}
                        <FormField
                          control={form.control}
                          name='Origin'
                          render={({ field }) => (
                            <FormItem className='space-y-3'>
                              <FormLabel>   {
                                getOriginLabel(
                                  isUsCountry,
                                  isCaCountry,
                                  isFrCountry,
                                  customerType
                                )
                              }
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    if (value === getOthersText(business) || value === selectedOtherOption?.value) {
                                      setShowOtherOptionsModal(true);
                                    }
                                  }}
                                  defaultValue={field.value}
                                  className=''
                                >
                                  <CustomRadioGroup
                                    value={field.value}
                                    items={
                                      getKnownOrigins(business).concat(
                                        !selectedOtherOption
                                          ? getOtherOriginValues(business)
                                          : selectedOtherOption
                                      )
                                    }
                                  />
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Dinners */}
                        <FormField
                          control={form.control}
                          name='Dinners'
                          render={({ field }) => (
                            <FormItem className='space-y-3'>
                              <FormLabel>  {
                                isUsCountry
                                  ? 'People at the table?'
                                  : isCaCountry || isFrCountry
                                    ? 'Du monde à table ?'
                                    : '¿Personas en la mesa?'
                              }
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className=''
                                >
                                  <CustomRadioGroup value={field.value} items={getCustomersQuantity(business)} />
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* AverageTicket */}
                        <FormField
                          control={form.control}
                          name='AverageTicket'
                          render={({ field }) => (
                            <FormItem className='space-y-3'>
                              <FormLabel>       {
                                isUsCountry
                                  ? 'How much did you spend today per person?'
                                  : isCaCountry || isFrCountry
                                    ? "Qu'est-ce que tu as à manger aujourd'hui par personne ?"
                                    : '¿Cuánto gastaste hoy por persona?'
                              }
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className=''
                                >
                                  <CustomRadioGroup value={field.value} items={getAverageTicket(business)} />
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Rating */}
                        <FormField
                          control={form.control}
                          name='Rating'
                          render={({ field }) => (
                            <FormItem className='space-y-0'>
                              <FormLabel>  {
                                isUsCountry
                                  ? 'How were we today?'
                                  : isCaCountry || isFrCountry
                                    ? "Comment sommes-nous le jour d'aujourd'hui ?"
                                    : '¿Cómo estuvimos el dia de hoy?'
                              }
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                >
                                  <RatingRadioGroup value={field.value} business={business} />
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Fields required when rating is low */}
                        {isLowRating
                          ? (
                            <>
                              <FormItem>
                                <FormLabel>
                                  {
                                    isUsCountry
                                      ? 'What can we improve?'
                                      : isCaCountry || isFrCountry
                                        ? "Et qu'est-ce que nous pourrions améliorer?"
                                        : '¿En qué podemos mejorar?'
                                  }
                                </FormLabel>
                              </FormItem>
                              <div className='grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 text-sm font-medium text-gray-900'>
                                <FormField
                                  control={form.control}
                                  name='Food'
                                  render={({ field }) => (
                                    <FormItem className={cn('flex flex-row items-start space-y-0 rounded-md border py-1 sm:py-2 shadow hover:border-sky-500 hover:text-sky-500 transition-all', {
                                      'border-sky-500 text-sky-500': field.value
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
                                        className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1 hover:border-sky-500 hover:text-sky-500 transition-all', {
                                          'border-sky-500 text-sky-500': field.value
                                        })}
                                      >
                                        <IconToolsKitchen />
                                        <p className='w-full text-[10px] sm:text-[11px]'>
                                          {
                                            isUsCountry
                                              ? 'Food'
                                              : isCaCountry || isFrCountry
                                                ? 'Cuisine'
                                                : 'Comida'
                                          }
                                        </p>
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name='Service'
                                  render={({ field }) => (
                                    <FormItem className={cn('flex flex-row items-start space-y-0 rounded-md border py-1 sm:py-2 shadow hover:border-sky-500 hover:text-sky-500 transition-all', {
                                      'border-sky-500 text-sky-500': field.value
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
                                        className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1', {
                                          'text-sky-500': field.value
                                        })}
                                      >
                                        <IconUsers />
                                        <p className='w-full text-[10px] sm:text-[11px]'>
                                          {
                                            isUsCountry
                                              ? 'Service'
                                              : isCaCountry || isFrCountry
                                                ? 'Service'
                                                : 'Servicio'
                                          }
                                        </p>
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name='Ambience'
                                  render={({ field }) => (
                                    <FormItem className={cn('flex flex-row items-start space-y-0 rounded-md border py-1 sm:py-2 shadow hover:border-sky-500 hover:text-sky-500 transition-all', {
                                      'border-sky-500 text-sky-500': field.value
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
                                        className={cn('text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1', {
                                          'text-sky-500': field.value
                                        })}
                                      >
                                        <IconBuildingStore />
                                        <p className='w-full text-[10px] sm:text-[11px]'>
                                          {
                                            isUsCountry
                                              ? 'Atmosphere'
                                              : isCaCountry || isFrCountry
                                                ? 'Ambiance'
                                                : 'Ambiente'
                                          }
                                        </p>
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              {form.formState.errors.hiddenInput
                                ? <FormMessage>{isUsCountry ? 'Please select at least one option' : isCaCountry ? 'Veuillez sélectionner au moins une option' : 'Por favor selecciona al menos una opción'}</FormMessage>
                                : null}
                              <FormField
                                control={form.control}
                                name='ImproveText'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {
                                        isUsCountry
                                          ? 'Share details about your experience in this place'
                                          : isCaCountry || isFrCountry
                                            ? 'Partagez des détails sur votre expérience dans ce lieu'
                                            : 'Compartenos detalles sobre tu experiencia en este lugar'
                                      }
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder={
                                          isUsCountry
                                            ? 'Ej:the food was very good, but the service was slow.'
                                            : isCaCountry || isFrCountry
                                              ? 'Fr: La nourriture était très bonne, mais le service était lent.'
                                              : 'Ej: La comida estuvo muy buena, pero el servicio fue lento.'
                                        }
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )
                          : null}
                      </div>
                      {!isCustomerInBusiness
                        ? (watchRating == Ratings.Excelente || watchRating === Ratings.Bueno) && watchFullName
                          ? (
                            <GoogleReviewMessage
                              customerFullName={watchFullName}
                              isCaCountry={isCaCountry}
                              isFrCountry={isFrCountry}
                              isUsCountry={isUsCountry}
                            />
                          )
                          : null
                        : null
                      }
                      <Button
                        className='w-full'
                        type='submit' disabled={
                          isTermsChecked === false || isLastFeedbackMoreThanOneDay
                            ? true
                            : form.formState.isSubmitting
                        }
                      >
                        {
                          isUsCountry
                            ? 'Send'
                            : isCaCountry || isFrCountry
                              ? 'Envoyer'
                              : 'Enviar'
                        }
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
                                  {
                                    isUsCountry
                                      ? 'By pressing "Submit", I declare that I accept the'
                                      : isCaCountry || isFrCountry
                                        ? 'En pressant "Enviar", déclarez que vous acceptez les'
                                        : 'Al presionar "Enviar", declaro que acepto los'
                                  }
                                  {' '}
                                  <a
                                    className='text-primary hover:underline'
                                    href='https://qikstarts.com/terms-of-service'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                  >
                                    {
                                      isUsCountry
                                        ? 'Terms and Cons'
                                        : isCaCountry || isFrCountry
                                          ? 'Conditions et conditions'
                                          : 'Términos y Condiciones'
                                    }
                                  </a> {
                                    isUsCountry
                                      ? ' and the '
                                      : isCaCountry || isFrCountry
                                        ? ' et là '
                                        : ' y las '
                                  } <a className='text-primary hover:underline' href='https://qikstarts.com/privacy-policy' rel='noopener noreferrer' target='_blank'>{isUsCountry ? 'Privacy Policies' : isCaCountry ? 'Politiques de confidentialité' : 'Políticas de Privacidad'}</a>
                                  .
                                </small>
                              </>
                            </FormControl>
                          )}
                        />
                      </CardFooter>
                    </>
                  ) : null
                }

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
