import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {UseFormReturn} from "react-hook-form";
import {HootersFeedbackProps} from "@/app/validators/hootersFeedbackSchema";
import React, {useState} from "react";
import {Button} from "@/app/components/ui/Button";
import Stack from "@mui/material/Stack";

interface ComeBackQuestionProps {
	form: UseFormReturn<HootersFeedbackProps>
	question: string
	yesButton: string
	noButton: string
	handleResponse: (answer: boolean) => void
}

export default function ComeBackQuestion({ form, question, yesButton, noButton, handleResponse }: ComeBackQuestionProps) {
	const [isYesSelected, setIsYesSelected] = useState(false);
	const [isNoSelected, setIsNoSelected] = useState(false);

	return (
		<>
			<FormField
				control={form.control}
				name='ComeBack'
				render={({ field }) => (
					<FormItem className='md:grid md:space-y-0 md:items-center md:gap-12'>
						<Stack spacing={2}>
							<FormLabel className='col-span-3 text-question text-xl' >
								{question}
							</FormLabel>

							<FormControl>
								<div className="flex justify-center space-x-4">
									<Button variant={isYesSelected ? 'hootersPrimary' : 'hootersSecondary'} size={'hootersPrimary'} type={'button'} onClick={() => {
										setIsYesSelected(!isYesSelected);
										setIsNoSelected(false);
										field.onChange(true);
										handleResponse(true);
									}}>
										{yesButton}
									</Button>
									<Button variant={isNoSelected ? 'hootersPrimary' : 'hootersSecondary'} size={'hootersPrimary'} type={'button'} onClick={() => {
										setIsNoSelected(!isNoSelected);
										setIsYesSelected(false);
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