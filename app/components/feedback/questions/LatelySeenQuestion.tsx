import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {RadioGroup} from "@/app/components/ui/RadioGroup";
import StartsRatingGroup from "@/app/components/form/StartsRatingGroup";
import {ratingOptionsFrom1To10} from "@/app/constants/form";
import {UseFormReturn} from "react-hook-form";
import {HootersFeedbackProps} from "@/app/validators/hootersFeedbackSchema";

interface LatelySeenQuestionProps {
	form: UseFormReturn<HootersFeedbackProps>
	question: string
	nextStep: () => void
}

export default function LatelySeenQuestion({ form, question, nextStep }: LatelySeenQuestionProps) {

	return (
		<>
			<FormField
				control={form.control}
				name='LatelySeen'
				render={({ field }) => (
					<FormItem className='md:grid md:grid-cols-4 md:space-y-0 md:items-center md:gap-12'>
						<FormLabel className='col-span-3' >
							{question}
						</FormLabel>
						<div className='pt-2 md:pb-0 col-span-1' >
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									onChange={nextStep}
								>
									<StartsRatingGroup
										value={field.value}
										items={ratingOptionsFrom1To10}
										className='grid-cols-5'
									/>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</div>
					</FormItem>
				)}
			/>
		</>
	)
}