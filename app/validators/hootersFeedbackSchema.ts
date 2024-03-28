import { RatingsFiveStars } from '@/app/types/feedback'
import { z } from 'zod'

export const hootersFeedbackSchema = (businessCountry: string) =>
  z.object({
    FullName: z.string().nonempty({
      message:
        businessCountry === 'US'
          ? 'Please tell us your name'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il vous plaît dites-nous votre nom"
            : 'Por favor dinos tu nombre'
    }),

    AcceptTerms: z.boolean(),
    Email: z
      .string({
        required_error:
          businessCountry === 'US'
            ? 'Please tell us your email'
            : businessCountry === 'CA' || businessCountry === 'FR'
              ? "S'il vous plaît dites-nous votre email"
              : 'Por favor dinos tu correo electrónico'
      })
      .email(
        businessCountry === 'US'
          ? 'Please type a correct email'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? 'Veuillez entrer un email valide'
            : 'Por favor ingresa un correo electrónico válido'
      ),

    Courtesy: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    PlaceCleanness: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Quickness: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    FoodQuality: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Climate: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Experience: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
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
        message:
          businessCountry === 'US'
            ? 'Please tell us why you would recommend us'
            : businessCountry === 'CA' || businessCountry === 'FR'
              ? 'Veuillez nous dire pourquoi vous nous recommanderiez'
              : 'Por favor dinos por qué nos recomendarías'
      })
      .max(
        500,
        businessCountry === 'US'
          ? 'You cannot exceed 500 characters'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? 'Vous ne pouvez pas dépasser 500 caractères'
            : 'No puedes exceder los 500 caracteres'
      ),

      ComeBackText: z
      .string()
      .max(
        500,
        businessCountry === 'US'
          ? 'You cannot exceed 500 characters'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? 'Vous ne pouvez pas dépasser 500 caractères'
            : 'No puedes exceder los 500 caracteres'
      ),

      Food: z.boolean(),

      Service: z.boolean(),
  
      Ambience: z.boolean(),

      ImproveText: z
      .string()
      .max(
        500,
        businessCountry === 'US'
          ? 'You cannot exceed 500 characters'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? 'Vous ne pouvez pas dépasser 500 caractères'
            : 'No puedes exceder los 500 caracteres'
      ),

      hiddenInput: z.boolean().optional().nullable()



  })

export type HootersFeedbackProps = z.infer<ReturnType<typeof hootersFeedbackSchema>>
