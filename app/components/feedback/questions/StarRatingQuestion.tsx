import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Form";
import { RadioGroup } from "@/app/components/ui/RadioGroup";
import StartsRatingGroup from "@/app/components/form/StartsRatingGroup";
import { getRatingOptions } from "@/app/constants/form";
import { Path, UseFormReturn } from "react-hook-form";
import Stack from "@mui/material/Stack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import React from "react";
import { GusFeedbackProps } from "@/app/validators/gusFeedbackSchema";
import { HootersFeedbackProps } from "@/app/validators/hootersFeedbackSchema";

interface StarRatingQuestionProps<T extends HootersFeedbackProps | GusFeedbackProps> {
  form: UseFormReturn<T>
  question: string
  nextStep: () => void
  prevStep?: () => void
  businessCountry: string,
  formName: Path<T>
  variant: "hooters" | "gus"
}

export default function StarRatingQuestion<T extends HootersFeedbackProps | GusFeedbackProps>({
  form,
  question,
  nextStep,
  prevStep,
  businessCountry,
  formName,
  variant
}: StarRatingQuestionProps<T>) {

  return (
    <>
      <FormField
        control={form.control}
        name={formName}
        render={({ field }) => (
          <FormItem className='md:grid md:space-y-0 md:items-center md:gap-12'>
            <Stack spacing={2}>
              <FormLabel className='col-span-3 text-question text-lg'>
                {question}
              </FormLabel>

              <div className='flex items-start justify-center'>
                {
                  prevStep && (
                    <span>
                      <a style={{ cursor: "pointer", marginTop: "30px" }} onClick={prevStep}>
                        <ChevronLeftIcon className={`text-${variant}`} style={{ fontSize: 54, fontWeight: 'bolder' }} />
                      </a>
                    </span>
                  )
                }
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    onChange={(e) => {
                      field.onChange(e)
                      nextStep()
                    }}
                  >
                    <StartsRatingGroup
                      value={field.value as string}
                      items={getRatingOptions(businessCountry)}
                      className='grid-cols-5'
                      variant={variant}
                    />
                  </RadioGroup>
                </FormControl>

                <span>
                  <a style={{ cursor: "pointer", marginTop: "30px" }} onClick={nextStep}>
                    <ChevronRightIcon className={`text-${variant}`} style={{ fontSize: 54, fontWeight: "bolder" }} />
                  </a>
                </span>
              </div>
              <FormMessage />
            </Stack>
          </FormItem>
        )}
      />
    </>
  )
}