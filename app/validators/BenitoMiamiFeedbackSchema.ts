import { Origins, Ratings } from "@/app/types/feedback";
import { z } from "zod";

export const benitoMiamoFeedbackSchema = () =>
  z
    .object({
      FullName: z.string().nonempty({
        message: "Please tell us your name",
      }),

      PhoneNumber: z
        .string({
          required_error: "Please tell us your phone number",
        })
        .max(13, "Please type a correct phone number")
        .optional(),

      AcceptPromotions: z.boolean(),
      AcceptTerms: z.boolean(),
      Email: z
        .string({
          required_error: "Please tell us your email",
        })
        .email("Please type a correct email"),

      Origin: z.nativeEnum(Origins, {
        required_error: "Please tell us where you know us",
      }),

      Rating: z.nativeEnum(Ratings, {
        required_error: "Please tell us how were we today",
      }),

      StartTime: z.coerce
        .date()
        .optional()
        .default(() => new Date()),

      Food: z.boolean(),

      Service: z.boolean(),

      Ambience: z.boolean(),

      ImproveText: z.string().max(500, "You cannot exceed 500 characters"),

      hiddenInput: z.boolean().optional().nullable(),
    })
    .superRefine((values, context) => {
      if (values.AcceptPromotions && !values.PhoneNumber) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please tell us your phone number",
          path: ["PhoneNumber"],
        });
      }
    });

export type FeedbackProps = z.infer<
  ReturnType<typeof benitoMiamoFeedbackSchema>
>;
