import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/Form";
import { UseFormReturn } from "react-hook-form";
import { HootersFeedbackProps } from "@/app/validators/hootersFeedbackSchema";
import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import Stack from "@mui/material/Stack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import useGetBusinessData from "@/app/hooks/useGetBusinessData";

interface RecommendingQuestionProps {
  form: UseFormReturn<HootersFeedbackProps>;
  question: string;
  yesButton: string;
  noButton: string;
  handleResponse: (answer: boolean) => void;
  prevStep: () => void;
  isRecommendingClicked: React.MutableRefObject<boolean | null>;
}

export default function RecommendingQuestion({
  form,
  question,
  yesButton,
  noButton,
  handleResponse,
  prevStep,
  isRecommendingClicked,
}: RecommendingQuestionProps) {
  const { brandColor } = useGetBusinessData();
  const [isYesSelected, setIsYesSelected] = useState(false);
  const [isNoSelected, setIsNoSelected] = useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name="Recommending"
        render={({ field }) => (
          <FormItem className="md:grid md:space-y-0 md:items-center md:gap-12">
            <Stack spacing={2}>
              <FormLabel className="col-span-3 text-question text-lg">
                {question}
              </FormLabel>

              <div className="flex items-start justify-center">
                <span className="self-start">
                  <a
                    style={{ cursor: "pointer", marginTop: "30px" }}
                    onClick={prevStep}
                  >
                    <ChevronLeftIcon
                      className="text-hooters"
                      style={{ fontSize: 54, fontWeight: "bolder" }}
                    />
                  </a>
                </span>

                <FormControl>
                  <div className="flex justify-center space-x-4">
                    <Button
                      color={`hsl(${brandColor || "var(--qik)"})`}
                      type={"button"}
                      onClick={() => {
                        setIsYesSelected(!isYesSelected);
                        setIsNoSelected(false);
                        isRecommendingClicked.current = true;
                        field.onChange(true);
                        handleResponse(true);
                      }}
                    >
                      {yesButton}
                    </Button>
                    <Button
                      color={`hsl(${brandColor || "var(--qik)"})`}
                      type={"button"}
                      onClick={() => {
                        setIsNoSelected(!isNoSelected);
                        setIsYesSelected(false);
                        isRecommendingClicked.current = false;
                        field.onChange(false);
                        handleResponse(false);
                      }}
                    >
                      {noButton}
                    </Button>
                  </div>
                </FormControl>

                <span className="self-end">
                  <a style={{ marginTop: "30px" }}>
                    <ChevronRightIcon
                      className="text-transparent"
                      style={{ fontSize: 54, fontWeight: "bolder" }}
                    />
                  </a>
                </span>
              </div>
              <FormMessage />
            </Stack>
          </FormItem>
        )}
      />
    </>
  );
}
