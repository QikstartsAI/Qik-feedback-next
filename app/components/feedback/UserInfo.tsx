'use client'

import {cn, lastFeedbackFilledIsGreaterThanOneDay} from "@/app/lib/utils";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {Input} from "@/app/components/ui/Input";
import { HootersFeedbackProps } from '@/app/validators/hootersFeedbackSchema';
import {findCustomerDataByEmail, findIsCustomerInBusiness, getCustomerDataInBusiness} from "@/app/lib/handleEmail";
import {UseFormReturn} from "react-hook-form";
import { useState } from "react";
import Modal from "../ui/Modal";
import { useSearchParams } from "next/navigation";
import getFormTranslations from "@/app/constants/formTranslations";

interface UserInfoProps {
	form: UseFormReturn<HootersFeedbackProps>
	fullNameQuestion: string
	emailQuestion: string
  businessCountry: string
  businessId: string
  setIsLastFeedbackMoreThanOneDay: (value: boolean) => void
}

export default function UserInfo({ form, fullNameQuestion, emailQuestion, setIsLastFeedbackMoreThanOneDay, businessCountry, businessId }: UserInfoProps) {
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
				name='Email'
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
								onBlur={async () => {
									const email = field.value
									if (email) {
										const customerData = await findCustomerDataByEmail(email)
                    const customerDataInBusiness = await getCustomerDataInBusiness(email, businessId, branchId, waiterId)
                    const lastFeedbackFilledInBusiness = customerDataInBusiness?.lastFeedbackFilled
                    const lastFeedbackGreaterThanOneDay = lastFeedbackFilledIsGreaterThanOneDay(lastFeedbackFilledInBusiness)
                    setShowLastFeedbackFilledModal(lastFeedbackGreaterThanOneDay)
                    setIsLastFeedbackMoreThanOneDay(lastFeedbackGreaterThanOneDay)
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
			{/* name */}
			<FormField
				control={form.control}
				name='FullName'
				render={({ field }) => (
					<FormItem>
						<FormLabel className={'text-colorText'}>
							{fullNameQuestion}
						</FormLabel>
						<FormControl>
							<Input placeholder='Ej: Juan Pérez' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	)
}