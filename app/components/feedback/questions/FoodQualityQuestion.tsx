import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {RadioGroup} from "@/app/components/ui/RadioGroup";
import StartsRatingGroup from "@/app/components/form/StartsRatingGroup";
import {getRatingOptions} from "@/app/constants/form";
import {UseFormReturn} from "react-hook-form";
import {HootersFeedbackProps} from "@/app/validators/hootersFeedbackSchema";
import Stack from "@mui/material/Stack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";

interface FoodQualityQuestionProps {
	form: UseFormReturn<HootersFeedbackProps>
	question: string
	nextStep: () => void
	prevStep: () => void
	businessCountry: string
}

export default function FoodQualityQuestion({ form, question, nextStep, prevStep, businessCountry }: FoodQualityQuestionProps) {

	return (
		<>
			<FormField
				control={form.control}
				name='FoodQuality'
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
										onChange={(e) => {
											field.onChange(e)
											nextStep()
										}}
									>
										<StartsRatingGroup
											value={field.value}
											items={getRatingOptions(businessCountry)}
											className='grid-cols-5'
										/>
									</RadioGroup>
								</FormControl>

								<span>
									<a style={{cursor: "pointer", marginTop: "30px"}} onClick={nextStep}>
										<ChevronRightIcon className="text-hooters" style={{fontSize: 54, fontWeight: "bolder"}}/>
									</a>
								</span>
							</div>
							<FormMessage/>
						</Stack>
					</FormItem>
				)}
			/>
		</>
	)
}