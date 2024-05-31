'use client'

import {cn, lastFeedbackFilledIsGreaterThanOneDay} from "@/app/lib/utils";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {Input} from "@/app/components/ui/Input";
import { HootersFeedbackProps } from '@/app/validators/hootersFeedbackSchema';
import {findCustomerDataByEmail, findIsCustomerInBusiness, getCustomerDataInBusiness} from "@/app/lib/handleEmail";
import {FieldValues, Path, PathValue, UseFormReturn} from "react-hook-form";
import { useState } from "react";
import Modal from "../ui/Modal";
import { useSearchParams } from "next/navigation";
import getFormTranslations from "@/app/constants/formTranslations";
import { GusFeedbackProps } from "@/app/validators/gusFeedbackSchema";

interface UserInfoProps<T extends HootersFeedbackProps | GusFeedbackProps> {
	form: UseFormReturn<T>
	fullNameQuestion: string
	emailQuestion: string
  businessCountry: string
  businessId: string
  setIsLastFeedbackMoreThanOneDay: (value: boolean) => void
}

export default function UserInfo<T extends HootersFeedbackProps | GusFeedbackProps>({ form, fullNameQuestion, emailQuestion, setIsLastFeedbackMoreThanOneDay, businessCountry, businessId }: UserInfoProps<T>) {
  const [showLastFeedbackFilledModal, setShowLastFeedbackFilledModal] = useState<boolean | undefined>(false)

  const {
    feedbackLimit
  } = getFormTranslations({businessCountry})

  const searchParams = useSearchParams()
  const branchId = searchParams.get('sucursal')
  const waiterId = searchParams.get('mesero')

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
								onBlur={async () => {
									const email = field.value
									if (email) {
										const customerData = await findCustomerDataByEmail(email as string)
                    const customerDataInBusiness = await getCustomerDataInBusiness(email as string, businessId, branchId, waiterId)
                    const lastFeedbackFilledInBusiness = customerDataInBusiness?.lastFeedbackFilled
                    const lastFeedbackGreaterThanOneDay = lastFeedbackFilledIsGreaterThanOneDay(lastFeedbackFilledInBusiness)
                    setShowLastFeedbackFilledModal(lastFeedbackGreaterThanOneDay)
                    setIsLastFeedbackMoreThanOneDay(lastFeedbackGreaterThanOneDay)
										if (customerData) {
											form.setValue('FullName' as Path<T>, customerData.name as PathValue<T, Path<T>>)
										}
									}
								}}
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
		</>
	)
}