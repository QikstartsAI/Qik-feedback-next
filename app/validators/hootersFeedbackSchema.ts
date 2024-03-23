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

    WaiterService: z.nativeEnum(RatingsFiveStars, {
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
    Ambience: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Courtesy: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    LatelySeen: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Spending: z.nativeEnum(RatingsFiveStars, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuéntanos cómo estuvimos el día de hoy'
    }),
    Recommending: z.nativeEnum(RatingsFiveStars, {
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

    StartTime: z.coerce
      .date()
      .optional()
      .default(() => new Date()),


  })

export type HootersFeedbackProps = z.infer<ReturnType<typeof hootersFeedbackSchema>>
