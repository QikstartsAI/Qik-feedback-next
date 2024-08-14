'use client'

import { cn, lastFeedbackFilledIsGreaterThanOneDay } from "@/app/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Form";
import { Input } from "@/app/components/ui/Input";
import { HootersFeedbackProps } from '@/app/validators/hootersFeedbackSchema';
import { findCustomerDataByEmail, findIsCustomerInBusiness, getCustomerDataInBusiness } from "@/app/lib/handleEmail";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { useState } from "react";
import Modal from "../ui/Modal";
import { useSearchParams } from "next/navigation";
import getFormTranslations from "@/app/constants/formTranslations";
import { GusFeedbackProps } from "@/app/validators/gusFeedbackSchema";
import { RadioGroup } from "../ui/RadioGroup";
import CustomRadioGroup from "../form/CustomRadioGroup";
import { getKnownOrigins, getOtherOriginValues, getOthersText } from "@/app/constants/form";
import { Country } from "react-phone-number-input";
import PhoneInput from 'react-phone-number-input'
import { SelectedOption } from "@/app/types/general";

interface UserInfoProps<T extends HootersFeedbackProps | GusFeedbackProps> {
  form: UseFormReturn<T>
  fullNameQuestion: string
  emailQuestion: string
  phoneNumberQuestion: string
  birthdayQuestion: string
  businessCountry: Country | undefined
  businessId: string
  isChecked: boolean
  selectedOtherOption: SelectedOption | null
  setIsLastFeedbackMoreThanOneDay: (value: boolean) => void
  setIsChecked: (value: boolean) => void
  setShowOtherOptionsModal: (value: boolean) => void
}

export default function UserInfo<T extends HootersFeedbackProps | GusFeedbackProps>({
  form,
  fullNameQuestion,
  emailQuestion,
  phoneNumberQuestion,
  birthdayQuestion,
  isChecked,
  setIsLastFeedbackMoreThanOneDay,
  setShowOtherOptionsModal,
  setIsChecked,
  selectedOtherOption,
  businessCountry,
  businessId
}: UserInfoProps<T>) {
  const [showLastFeedbackFilledModal, setShowLastFeedbackFilledModal] = useState<boolean | undefined>(false)

  const {
    feedbackLimit
  } = getFormTranslations({ businessCountry: businessCountry || '' })

  const handleUserData = async (email: PathValue<T, Path<T>>) => {
    if (email) {
      const customerData = await findCustomerDataByEmail(email as string)
      const lastFeedbackFilledInBusiness = customerData?.lastFeedbackFilled
      const lastFeedbackGreaterThanOneDay = lastFeedbackFilledIsGreaterThanOneDay(lastFeedbackFilledInBusiness)
      setShowLastFeedbackFilledModal(lastFeedbackGreaterThanOneDay)
      setIsLastFeedbackMoreThanOneDay(lastFeedbackGreaterThanOneDay)
      if (customerData) {
        form.setValue('FullName' as Path<T>, customerData.name as PathValue<T, Path<T>>)
        form.setValue('PhoneNumber' as Path<T>, customerData.phoneNumber as PathValue<T, Path<T>>)
        form.setValue('BirthdayDate' as Path<T>, customerData.birthdayDate as PathValue<T, Path<T>>)
        form.setValue('AcceptPromotions' as Path<T>, customerData.acceptPromotions as PathValue<T, Path<T>>)
        setIsChecked(customerData.acceptPromotions || false)
      }
    }
  }

  // const searchParams = useSearchParams()
  // const branchId = searchParams.get('sucursal')
  // const waiterId = searchParams.get('mesero')

  return (
    <>
      {
        showLastFeedbackFilledModal && (
          <Modal isOpen={true} onClose={() => setShowLastFeedbackFilledModal(false)}>
            <div className='text-center'>
              <p>
                {feedbackLimit}
              </p>
            </div>
          </Modal>
        )
      }
      <FormField
        control={form.control}
        name={'Email' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={'text-colorText'}>
              {emailQuestion}
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Ej: juan@gmail.com'
                {...field}
                type='email'
                value={field.value as string}
                onBlur={() => handleUserData(field.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* name */}
      <FormField
        control={form.control}
        name={'FullName' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className={'text-colorText'}>
              {fullNameQuestion}
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Ej: Juan Pérez'
                {...field}
                value={field.value as string}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'PhoneNumber' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {phoneNumberQuestion}
            </FormLabel>
            <FormControl>
              <PhoneInput
                {...field}
                placeholder='74787654321'
                defaultCountry='MX'
                onChange={
                  (value) => {
                    form.setValue("PhoneNumber" as Path<T>, value as PathValue<T, Path<T>>)
                    form.setValue("AcceptPromotions" as Path<T>, !!value as PathValue<T, Path<T>>)
                    setIsChecked(!!value)
                  }
                }
                value={field.value as string | undefined}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'AcceptPromotions' as Path<T>}
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
                    form.setValue("AcceptPromotions" as Path<T>, newChecked as PathValue<T, Path<T>>)
                  }}
                  checked={isChecked}
                />
                <span className='ml-2 text-gray-700 text-xs'>
                  Acepto recibir promociones
                </span>
              </>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'BirthdayDate' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {birthdayQuestion}
            </FormLabel>
            <FormControl>
              <Input
                type='date'
                placeholder='Ej: 29/10/1999'
                {...field}
                max='2005-12-31'
                value={
                  field.value instanceof Date
                    ? field.value.toISOString().substring(0, 10)
                    : (typeof field.value === 'string'
                      ? field.value
                      : '')
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'Origin' as Path<T>}
        render={({ field }) => (
          <FormItem className='space-y-3'>
            <FormLabel>
              ¿De dónde nos conoces?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value === 'Otros' || value === selectedOtherOption?.value) {
                    setShowOtherOptionsModal(true);
                  }
                }}
                defaultValue={field.value as string}
                className=''
              >
                <CustomRadioGroup
                  className='sm:grid-cols-5'
                  value={field.value as string}
                  items={
                    getKnownOrigins(businessCountry).concat(
                      !selectedOtherOption
                        ? getOtherOriginValues(businessCountry)
                        : selectedOtherOption
                    )
                  }
                  isHooters={true}
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}