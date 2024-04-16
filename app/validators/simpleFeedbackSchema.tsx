import { Origins, Ratings } from '@/app/types/feedback'
import { z } from 'zod'

export const simpleFeedbackSchema = () =>
  z.object({
    FullName: z.string()
    .optional(),
    Email: z
      .string()
      .email({
        message: 'Please type a correct email'
      })
      .optional()
      .or(z.literal('')),
    Rating: z.nativeEnum(Ratings, {
      required_error: 'Please tell us how were we today'
    }),
    ProvideMoreFeedback: z.boolean(),
    ExperienceText: z
      .string()
      .max(
        500,
        'You cannot exceed 500 characters'
      )
      .optional(),

    StartTime: z.coerce
      .date()
      .optional()
      .default(() => new Date()),
    AcceptTerms: z.boolean()
  })
    .superRefine((values, context) => {
      if (values.ProvideMoreFeedback && !values.ExperienceText) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please tell us your experience',
          path: ['ExperienceText']
        })
      }
    })

export type SimpleFeedbackProps = z.infer<ReturnType<typeof simpleFeedbackSchema>>
