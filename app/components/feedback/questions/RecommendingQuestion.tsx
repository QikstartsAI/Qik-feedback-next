import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {UseFormReturn} from "react-hook-form";
import {HootersFeedbackProps} from "@/app/validators/hootersFeedbackSchema";
import React from "react";
import {Button} from "@/app/components/ui/Button";
import Stack from "@mui/material/Stack";

interface RecommendingQuestionProps {
	form: UseFormReturn<HootersFeedbackProps>
	question: string
	yesButton: string
	noButton: string
	handleResponse: (answer: boolean) => void
	isRecommendingClicked: React.MutableRefObject<boolean | null>
}

export default function RecommendingQuestion({ form, question, yesButton, noButton, handleResponse,isRecommendingClicked }: RecommendingQuestionProps) {
	let recommended: boolean;

	return (
		<>
			<FormField
				control={form.control}
				name='Recommending'
				render={({ field }) => (
					<FormItem className='md:grid md:space-y-0 md:items-center md:gap-12'>
						<Stack spacing={2}>
							<FormLabel className='col-span-3 text-xl' >
								{question}
							</FormLabel>

							<FormControl>
								<div className="flex justify-center space-x-4">
									<Button variant={'hootersPrimary'} size={'hootersPrimary'} type={'button'} onClick={() => {
										field.onChange(true);
										handleResponse(true);
										isRecommendingClicked.current = true;
									}}>
										{yesButton}
									</Button>
									<Button variant={'hootersSecondary'} size={'hootersPrimary'} type={'button'} onClick={() => {
										field.onChange(false);
										handleResponse(false);
										isRecommendingClicked.current = false;
									}}>
										{noButton}
									</Button>
								</div>
							</FormControl>
							<FormMessage/>
						</Stack>
					</FormItem>
				)}
			/>
		</>
	)
}