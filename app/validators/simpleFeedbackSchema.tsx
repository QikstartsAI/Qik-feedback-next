import { Ratings } from '@/app/types/feedback'
import { z } from 'zod'

export const simpleFeedbackSchema = (feedbackType: string | undefined) =>
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
    ImproveText: z
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
      if (values.ProvideMoreFeedback && !values.ImproveText) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please tell us your experience',
          path: ['ImproveText']
        })
      }
      if (feedbackType && feedbackType === "inspection" && !values.FullName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please tell us your name',
          path: ['FullName']
        })
      }
      if (feedbackType && feedbackType === "inspection" && !values.Email) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please tell us your email',
          path: ['Email']
        })
      }
      if (feedbackType && feedbackType === "inspection" && !values.ImproveText) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please share details about this inspection',
          path: ['ImproveText']
        })
      }
    })

export type SimpleFeedbackProps = z.infer<ReturnType<typeof simpleFeedbackSchema>>
