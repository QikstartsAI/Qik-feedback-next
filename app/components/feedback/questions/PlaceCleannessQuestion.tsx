import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {RadioGroup} from "@/app/components/ui/RadioGroup";
import StartsRatingGroup from "@/app/components/form/StartsRatingGroup";
import {getRatingOptions} from "@/app/constants/form";
import {UseFormReturn} from "react-hook-form";
import {HootersFeedbackProps} from "@/app/validators/hootersFeedbackSchema";
import Stack from "@mui/material/Stack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import React from "react";

interface PlaceCleannessQuestionProps {
	form: UseFormReturn<HootersFeedbackProps>
	question: string
	nextStep: () => void
	prevStep: () => void
	businessCountry: string
}

export default function PlaceCleannessQuestion({ form, question, nextStep, prevStep, businessCountry }: PlaceCleannessQuestionProps) {

	return (
		<>
			<FormField
				control={form.control}
				name='PlaceCleanness'
				render={({ field }) => (
					<FormItem className='md:grid md:space-y-0 md:items-center md:gap-12'>
							<Stack spacing={2}>
								<FormLabel className='col-span-3 text-question text-lg'>
									{question}
								</FormLabel>

								<div className='flex items-start justify-center'>
									<span>
										<a style={{cursor: "pointer", marginTop: "30px"}} onClick={prevStep}>
											<ChevronLeftIcon className='text-hooters' style={{fontSize: 50}}/>
										</a>
									</span>

									<FormControl className='items-center justify-center'>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											onChange={nextStep}
										>
											<StartsRatingGroup
												value={field.value}
												items={getRatingOptions(businessCountry)}
												className='grid-cols-5'
											/>
										</RadioGroup>
									</FormControl>
									<FormMessage/>
								</div>

							</Stack>


					</FormItem>
				)}
			/>
		</>
	)
}