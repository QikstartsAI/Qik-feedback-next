import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {UseFormReturn} from "react-hook-form";
import {HootersFeedbackProps} from "@/app/validators/hootersFeedbackSchema";
import React, {useState} from "react";
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
	const [isYesSelected, setIsYesSelected] = useState(false);
	const [isNoSelected, setIsNoSelected] = useState(false);

	return (
		<>
			<FormField
				control={form.control}
				name='Recommending'
				render={({ field }) => (
					<FormItem className='md:grid md:space-y-0 md:items-center md:gap-12'>
						<Stack spacing={2}>
							<FormLabel className='col-span-3 text-question text-lg' >
								{question}
							</FormLabel>

							<FormControl>
								<div className="flex justify-center space-x-4">
									<Button variant={isYesSelected ? 'hootersPrimary' : 'hootersSecondary'} size={'hootersPrimary'} type={'button'} onClick={() => {
										setIsYesSelected(!isYesSelected);
										setIsNoSelected(false);
										isRecommendingClicked.current = true;
										field.onChange(true);
										handleResponse(true);
									}}>
										{yesButton}
									</Button>
									<Button variant={isNoSelected ? 'hootersPrimary' : 'hootersSecondary'} size={'hootersPrimary'} type={'button'} onClick={() => {
										setIsNoSelected(!isNoSelected);
										setIsYesSelected(false);
										isRecommendingClicked.current = false;
										field.onChange(false);
										handleResponse(false);
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