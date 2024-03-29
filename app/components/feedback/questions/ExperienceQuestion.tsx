import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {RadioGroup} from "@/app/components/ui/RadioGroup";
import StartsRatingGroup from "@/app/components/form/StartsRatingGroup";
import {getRatingOptions} from "@/app/constants/form";
import {UseFormReturn} from "react-hook-form";
import {HootersFeedbackProps} from "@/app/validators/hootersFeedbackSchema";
import Stack from "@mui/material/Stack";

interface ExperienceQuestionProps {
	form: UseFormReturn<HootersFeedbackProps>
	question: string
	nextStep: () => void
	businessCountry: string
}

export default function ExperienceQuestion({ form, question, nextStep, businessCountry }: ExperienceQuestionProps) {

	return (
		<>
			<FormField
				control={form.control}
				name='Experience'
				render={({ field }) => (
					<FormItem className='md:grid md:space-y-0 md:items-center md:gap-12'>
						<Stack spacing={2}>
							<FormLabel className='col-span-3 text-xl' >
								{ question }
							</FormLabel>

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
							<FormMessage />
						</Stack>
					</FormItem>
				)}
			/>
		</>
	)
}