'use client'

import { cn } from "@/app/lib/utils"
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/Form"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { simpleFeedbackSchema } from "@/app/validators/simpleFeedbackSchema"
import { SimpleFeedbackProps } from "@/app/validators/simpleFeedbackSchema"
import { CardHeader, CardTitle } from "../../ui/Card"
import { RadioGroup } from "../../ui/RadioGroup"
import SimpleRatingRadioGroup from "../../form/SimpleRatingGroup"
import { Business } from "@/app/types/business"
import Modal from "../../ui/Modal"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "../../ui/Button"
import SimpleContactInfo from "./SimpleContactInfo"
import handleSimpleFeedbackSubmit from "@/app/lib/handleSimpleFormSubmit"
import { Ratings } from "@/app/types/feedback"

interface SimpleFormProps {
  business: Business | null
  branchId: string | null
  waiterId: string | null
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
  setRating: Dispatch<SetStateAction<string>>
  setIsQr: Dispatch<SetStateAction<boolean>>
}

const SimpleForm = ({ business, setIsSubmitted, setRating, setIsQr, branchId, waiterId }: SimpleFormProps) => {
  const [showMoreFeedbackConfirmation, setShowMoreFeedbackConfirmation] = useState<boolean>(false)
  const [showContactInfo, setShowContactInfo] = useState<boolean>(false)

  const feedbackType = business?.Waiter?.feedbackType

  const searchParams = new URLSearchParams(document.location.search)

  const businessId = business?.BusinessId
  const isQr = searchParams.get('isQr')

  const form = useForm<SimpleFeedbackProps>({
    resolver: zodResolver(
      simpleFeedbackSchema(feedbackType)
    ),
    defaultValues: {
      FullName: '',
      Email: '',
      Rating: undefined,
      ProvideMoreFeedback: false,
      ImproveText: '',
      AcceptTerms: true,
      StartTime: new Date(),
    }
  })

  const handleRedirect = () => {
    window.location.replace(business?.MapsUrl || '')
  }

  const onSubmit = async (data: SimpleFeedbackProps) => {
    try {
      setRating(data.Rating)
      await handleSimpleFeedbackSubmit(
        data,
        businessId || '',
        branchId || '',
        waiterId || '',
        isQr ? true : false,
        feedbackType
      )
      if (isQr && ((data.Rating === Ratings.Bueno || data.Rating === Ratings.Excelente))) {
        setIsQr(true)
        handleRedirect()
      }
      setIsSubmitted(true)
    } catch (error) {
      console.log(error)
    } finally {
      form.reset()
    }
  }

  return (
    <>
      <div className='w-full px-6 text-colorText' id='form'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 md:space-y-6 my-6'
            noValidate
          >
            {showMoreFeedbackConfirmation && feedbackType !== "inspection" && (
              <Modal isOpen={true} onClose={() => setShowMoreFeedbackConfirmation(false)}>
                <FormField
                  control={form.control}
                  name='ProvideMoreFeedback'
                  render={({ field }) => (
                    <FormItem className='space-y-0'>
                      <FormControl>
                        <div className="flex flex-col justify-center items-center space-y-3">
                          <p className="text-2xl font-semibold text-gray-700 text-center">
                            Would you like to provide more feedback?
                          </p>
                          <div className="flex flex-row justify-center items-center space-x-4 mt-4">
                            <Button onClick={
                              () => {
                                form.setValue('ProvideMoreFeedback', true)
                                setShowContactInfo(true)
                                setShowMoreFeedbackConfirmation(false)
                              }
                            }>
                              Yes
                            </Button>
                            <Button
                              variant="secondary"
                              type="submit"
                            >
                              No
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Modal>
            )}
            {
              (showContactInfo || feedbackType === "inspection") && (showMoreFeedbackConfirmation) ? (
                <SimpleContactInfo
                  form={form}
                  feedbackType={feedbackType}
                />
              ) : (
                <div
                  className={cn('space-y-3 mb-3 flex-row items-center justify-center', {})}
                >
                  <CardHeader>
                    <h1 className="text-center font-bold text-5xl md:text-8xl">
                      {feedbackType === "inspection"
                        ? "Please rate this inspection point"
                        : "Please rate our services today"
                      }
                    </h1>
                  </CardHeader>
                  <FormField
                    control={form.control}
                    name='Rating'
                    render={({ field }) => (
                      <FormItem className='space-y-0'>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              setShowMoreFeedbackConfirmation(true);
                            }}
                            defaultValue={field.value}
                          >
                            <SimpleRatingRadioGroup value={field.value} />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )
            }
          </form>
        </Form>
      </div>
    </>
  )
}

export default SimpleForm
