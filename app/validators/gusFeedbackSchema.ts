import { Origins, RatingsFiveStars } from '@/app/types/feedback'
import { z } from 'zod'

export const gusFeedbackSchema = () =>
  z.object({
    FullName: z.string().nonempty({
      message: 'Por favor dinos tu nombre'
    }),
    AcceptTerms: z.boolean(),
    Email: z
      .string({
        required_error: 'Por favor dinos tu correo electrónico'
      })
      .email('Por favor ingresa un correo electrónico válido'),
      BirthdayDate: z.string().optional(),
      PhoneNumber: z
      .string({
        required_error: 'Por favor dinos tu número de teléfono'
      })
      .max(13, 'Por favor ingresa un número de teléfono válido')
      .optional(),
      AcceptPromotions: z.boolean(),
      Origin: z.nativeEnum(Origins, {
        required_error: 'Por favor dinos de dónde nos conoces'
      }),

    Treatment: z.nativeEnum(RatingsFiveStars, {
      required_error:'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Reception: z.boolean(),
    ReceptionText: z
      .string()
      .max(
        500,
        'No puedes exceder los 500 caracteres'
      ),
    ProductTaste: z.nativeEnum(RatingsFiveStars, {
      required_error: 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    CashServiceSpeed: z.nativeEnum(RatingsFiveStars, {
      required_error:'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    ProductDeliverySpeed: z.nativeEnum(RatingsFiveStars, {
      required_error:'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    PlaceCleanness: z.nativeEnum(RatingsFiveStars, {
      required_error:'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Satisfaction: z.nativeEnum(RatingsFiveStars, {
      required_error:'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Recommending: z.boolean(),
    ComeBack: z.boolean(),

    StartTime: z.coerce
      .date()
      .optional()
      .default(() => new Date()),

    RecommendingText: z
      .string()
      .nonempty({
        message:'Por favor dinos por qué nos recomendarías'
      })
      .max(
        500,
        'No puedes exceder los 500 caracteres'
      ),

      ComeBackText: z
      .string()
      .max(
        500,
        'No puedes exceder los 500 caracteres'
      ),
      Food: z.boolean().optional(),
      Service: z.boolean().optional(),
      Ambience: z.boolean().optional(),
      ImproveText: z
      .string()
      .max(
        500,
        'No puedes exceder los 500 caracteres'
      ),
      hiddenInput: z.boolean().optional().nullable()
  })
  .superRefine((values, context) => {
    if (values.AcceptPromotions && !values.PhoneNumber) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Por favor dinos tu número de teléfono',
        path: ["PhoneNumber"]
      })
    }
  })

export type GusFeedbackProps = z.infer<ReturnType<typeof gusFeedbackSchema>>
