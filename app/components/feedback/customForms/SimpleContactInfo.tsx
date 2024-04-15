import { SimpleFeedbackProps } from "@/app/validators/simpleFeedbackSchema"
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/Form"
import { Input } from "../../ui/Input"
import { Textarea } from "../../ui/TextArea"
import { Button } from "../../ui/Button"
import { useState } from "react"
import { CardFooter } from "../../ui/Card"

interface SimpleContactInfoProps {
  form: UseFormReturn<SimpleFeedbackProps>
}

const SimpleContactInfo = ({ form }: SimpleContactInfoProps) => {
  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(true)

  return (
    <div className="p-10">
      <h2 className="text-3xl font-semibold text-gray-700 text-center mb-5">
        We value your opinion 😍, it will take you less than
        <span className="text-primary"> 5 seconds</span>
      </h2>
      <FormField
        control={form.control}
        name='FullName'
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel className="text-xl font-semibold">
              Your name <span
                className="text-xs text-gray-400 font-normal"
              >
                (important but optional)
              </span>
            </FormLabel>
            <FormControl>
              <Input placeholder='Ex: Juan Perez' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='Email'
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel className="text-xl font-semibold">
              Your email <span
                className="text-xs text-gray-400 font-normal"
              >
                (important but optional)
              </span>
            </FormLabel>
            <FormControl>
              <Input placeholder='Ex: example@example.com' type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='ExperienceText'
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel className="text-xl font-semibold">
              Share details about your experience in this place <span
                className="text-xs text-gray-400 font-normal"
              >
                (mandatory)
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="It was good but..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        className='w-full mt-6'
        type='submit' disabled={
          !isTermsChecked
            ? true
            : form.formState.isSubmitting
        }
      >
        Send
      </Button>
      <CardFooter className="mt-3">
        <FormField
          control={form.control}
          name='AcceptTerms'
          render={() => (
            <FormControl>
              <>
                <input
                  type='checkbox'
                  className='form-checkbox min-h-[12px] min-w-[12px] text-green-500'
                  onChange={() => setIsTermsChecked(!isTermsChecked)}
                  checked={isTermsChecked}
                />
                <small className='text-gray-500'>
                  By pressing &quot;Submit&quot;, I declare that I accept the
                  <a
                    className='text-primary hover:underline'
                    href='https://qikstarts.com/terms-of-service'
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    Terms and Cons
                  </a>
                  and the
                  <a className='text-primary hover:underline' href='https://qikstarts.com/privacy-policy' rel='noopener noreferrer' target='_blank'>
                    Privacy Policies
                  </a>
                  .
                </small>
              </>
            </FormControl>
          )}
        />
      </CardFooter>
    </div>
  )
}

export default SimpleContactInfo
