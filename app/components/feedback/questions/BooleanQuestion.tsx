import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/Form";
import { Path, UseFormReturn } from "react-hook-form";
import { HootersFeedbackProps } from "@/app/validators/hootersFeedbackSchema";
import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import Stack from "@mui/material/Stack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { GusFeedbackProps } from "@/app/validators/gusFeedbackSchema";

interface BooleanQuestionProps<T extends GusFeedbackProps> {
  form: UseFormReturn<T>
  question: string
  yesButton: string
  noButton: string
  handleResponse: (answer: boolean) => void
  prevStep: () => void
  nextStep?: () => void
  isQuestionClicked: React.MutableRefObject<boolean | null>
  formName: Path<T>
}

export default function BooleanQuestion<T extends GusFeedbackProps>({
  form,
  question,
  yesButton,
  noButton,
  handleResponse,
  prevStep,
  nextStep,
  isQuestionClicked,
  formName
}: BooleanQuestionProps<T>) {
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [isNoSelected, setIsNoSelected] = useState(false);

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
                <span className='self-start'>
                  <a style={{ cursor: "pointer", marginTop: "30px" }} onClick={prevStep}>
                    <ChevronLeftIcon className='text-hooters' style={{ fontSize: 54, fontWeight: 'bolder' }} />
                  </a>
                </span>

                <FormControl>
                  <div className="flex justify-center space-x-4">

                    <Button
                      variant={isQuestionClicked.current !== null && isQuestionClicked.current ? 'hootersPrimary' : 'hootersSecondary'}
                      size={'hootersPrimary'} type={'button'} onClick={() => {
                        setIsYesSelected(!isYesSelected);
                        setIsNoSelected(false);
                        isQuestionClicked.current = true;
                        field.onChange(true);
                        handleResponse(true);
                      }}>
                      {yesButton}
                    </Button>
                    <Button
                      variant={isQuestionClicked.current !== null && !isQuestionClicked.current ? 'hootersPrimary' : 'hootersSecondary'}
                      size={'hootersPrimary'} type={'button'} onClick={() => {
                        setIsNoSelected(!isNoSelected);
                        setIsYesSelected(false);
                        isQuestionClicked.current = false;
                        field.onChange(false);
                        handleResponse(false);
                      }}>
                      {noButton}
                    </Button>
                  </div>
                </FormControl>
                {
                  nextStep && (
                    <span>
                      <a style={{ cursor: "pointer", marginTop: "30px" }} onClick={nextStep}>
                        <ChevronRightIcon className="text-hooters" style={{ fontSize: 54, fontWeight: "bolder" }} />
                      </a>
                    </span>
                  )
                }
              </div>
              <FormMessage />
            </Stack>
          </FormItem>
        )}
      />
    </>
  )
}