import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {RadioGroup} from "@/app/components/ui/RadioGroup";
import StartsRatingGroup from "@/app/components/form/StartsRatingGroup";
import {ratingOptionsFrom1To10} from "@/app/constants/form";
import {UseFormReturn} from "react-hook-form";
import {HootersFeedbackProps} from "@/app/validators/hootersFeedbackSchema";
import React from "react";
import {Button} from "@/app/components/ui/Button";

interface RecommendingQuestionProps {
	form: UseFormReturn<HootersFeedbackProps>
	question: string
	yesButton: string
	noButton: string
	handleResponse: (answer: boolean) => void
}

export default function RecommendingQuestion({ form, question, yesButton, noButton, handleResponse }: RecommendingQuestionProps) {
	let recommended: boolean;

	return (
		<>
			<FormField
				control={form.control}
				name='Recommending'
				render={({ field }) => (
					<FormItem className='md:grid md:grid-cols-4 md:space-y-0 md:items-center md:gap-12'>
						<FormLabel className='col-span-3' >
							{question}
						</FormLabel>
						<div className='pt-2 md:pb-0 col-span-1' >
							<FormControl>
								<div className="flex justify-center space-x-4">
									<Button type={'button'} onClick={() => {
										field.onChange(true);
										handleResponse(true);
									}}>
										{yesButton}
									</Button>
									<Button type={'button'} onClick={() => {
										field.onChange(false);
										handleResponse(false);
									}}>
										{noButton}
									</Button>
								</div>
							</FormControl>
							<FormMessage/>
						</div>
					</FormItem>
				)}
			/>
		</>
	)
}