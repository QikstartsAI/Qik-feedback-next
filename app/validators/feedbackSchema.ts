import { Origins, Ratings } from '@/app/types/feedback'
import { z } from 'zod'

export const feedbackSchema = (averageTicket: [string, ...string[]], businessCountry: string) =>
  z.object({
    UserApprovesLoyalty: z.boolean().optional(),
    FullName: z.string().nonempty({
      message:
        businessCountry === 'US'
          ? 'Please tell us your name'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il vous plaît dites-nous votre nom"
            : 'Por favor dinos tu nombre'
    }),

    PhoneNumber: z
      .string({
        required_error:
          businessCountry === 'US'
            ? 'Please tell us your phone number'
            : businessCountry === 'CA' || businessCountry === 'FR'
              ? "S'il vous plaît dites-nous votre numéro de téléphone"
              : 'Por favor dinos tu número de teléfono'
      })
      .max(
        13,
        businessCountry === 'US'
          ? 'Please type a correct phone number'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il vous plaît entrer un numéro de téléphone valide"
            : 'Por favor ingresa un número de teléfono válido'
      )
      .optional(),

    AcceptPromotions: z.boolean(),
    AcceptTerms: z.boolean(),
    BirthdayDate: z.string().optional(),
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

    Origin: z.nativeEnum(Origins, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us where you know us'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il vous plaît dites-nous d'où vous nous connaissez"
            : 'Por favor dinos de dónde nos conoces'
    }),

    Dinners: z.enum(
      [
        '1-2',
        '2-4',
        '+4',
        businessCountry === 'US' ? 'To go' : businessCountry === 'CA' || businessCountry === 'FR' ? 'Pour emporter' : 'Para llevar',
        businessCountry === 'US' ? 'For delivery' : businessCountry === 'CA' || businessCountry === 'FR' ? 'Pour livraison' : 'Domicilio'
      ],
      {
        required_error:
          businessCountry === 'US'
            ? 'Please tell us how many people had dinner with you'
            : businessCountry === 'CA' || businessCountry === 'FR'
              ? "S'il vous plaît dites-nous combien de personnes ont dîné avec vous"
              : 'Por favor dinos cuántas personas cenaron contigo'
      }
    ),

    AverageTicket: z.enum(averageTicket, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how much did you spend today per person?'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "Veuillez nous dire combien vous avez dépensé aujourd'hui par personne"
            : 'Por favor dinos cuánto gastaste hoy por persona'
    }),

    Rating: z.nativeEnum(Ratings, {
      required_error:
        businessCountry === 'US'
          ? 'Please tell us how were we today'
          : businessCountry === 'CA' || businessCountry === 'FR'
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : 'Por favor cuentanos cómo estuvimos el día de hoy'
    }),

    StartTime: z.coerce
      .date()
      .optional()
      .default(() => new Date()),

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
  .superRefine((values, context) => {
    if (values.AcceptPromotions && !values.PhoneNumber) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: businessCountry === 'US'
        ? 'Please tell us your phone number'
        : businessCountry === 'CA' || businessCountry === 'FR'
          ? "S'il vous plaît dites-nous votre numéro de téléphone"
          : 'Por favor dinos tu número de teléfono',
        path: ["PhoneNumber"]
      })
    }
    if (values.UserApprovesLoyalty && !values.PhoneNumber) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: businessCountry === 'US'
        ? 'Please tell us your phone number to be part of the loyalty program'
        : businessCountry === 'CA' || businessCountry === 'FR'
          ? "Merci de nous indiquer votre numéro de téléphone pour faire partie du programme de fidélité"
          : 'Por favor dinos tu número de teléfono para formar parte del programa de lealtad',
        path: ["UserApprovesLoyalty"]
      })
    }
    if (values.UserApprovesLoyalty && !values.BirthdayDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: businessCountry === 'US'
        ? 'Please tell us your birthday to be part of the loyalty program'
        : businessCountry === 'CA' || businessCountry === 'FR'
          ? "Merci de nous communiquer votre anniversaire pour faire partie du programme de fidélité"
          : 'Por favor dinos tu fecha de cumpleaños para formar parte del programa de lealtad',
        path: ["UserApprovesLoyalty"]
      })
    }
  })

export type FeedbackProps = z.infer<ReturnType<typeof feedbackSchema>>
