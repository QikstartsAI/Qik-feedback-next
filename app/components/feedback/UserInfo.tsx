import {cn} from "@/app/lib/utils";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/app/components/ui/Form";
import {Input} from "@/app/components/ui/Input";
import { HootersFeedbackProps } from '@/app/validators/hootersFeedbackSchema';
import {findCustomerDataByEmail} from "@/app/lib/handleEmail";
import {UseFormReturn} from "react-hook-form";

interface UserInfoProps {
	form: UseFormReturn<HootersFeedbackProps>
	fullNameQuestion: string
	emailQuestion: string
}

export default function UserInfo({ form, fullNameQuestion, emailQuestion }: UserInfoProps) {
	return (
		<>
			{/* name */}
			<FormField
				control={form.control}
				name='FullName'
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							{fullNameQuestion}
						</FormLabel>
						<FormControl>
							<Input placeholder='Ej: Juan Pérez' {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name='Email'
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							{emailQuestion}
						</FormLabel>
						<FormControl>
							<Input
								placeholder='Ej: juan@gmail.com'
								{...field}
								type='email'
								onBlur={async () => {
									const email = field.value
									if (email) {
										const customerData = await findCustomerDataByEmail(email)
										if (customerData) {
											form.setValue('FullName', customerData.name)
										}
									}
								}}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</>
	)
}