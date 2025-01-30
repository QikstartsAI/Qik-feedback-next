import { Origins, Ratings } from "@/app/types/feedback";
import { z } from "zod";
import { Wallet } from "../constants/wallets";

export const feedbackSchema = (
  averageTicket: [string, ...string[]],
  paymentMethod: [string, ...string[]],
  businessCountry: string
) =>
  z
    .object({
      FullName: z.string().nonempty({
        message:
          businessCountry === "US" || businessCountry === "HK"
            ? "Please tell us your name"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "S'il vous plaît dites-nous votre nom"
            : businessCountry === "IT"
            ? "Per favore dicci il tuo nome"
            : "Por favor dinos tu nombre",
      }),

      PhoneNumber: z
        .string({
          required_error:
            businessCountry === "US" || businessCountry === "HK"
              ? "Please tell us your phone number"
              : businessCountry === "CA" || businessCountry === "FR"
              ? "S'il vous plaît dites-nous votre numéro de téléphone"
              : businessCountry === "IT"
              ? "Per favore dicci il tuo numero di telefono"
              : "Por favor dinos tu número de teléfono",
        })
        .max(
          13,
          businessCountry === "US" || businessCountry === "HK"
            ? "Please type a correct phone number"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "S'il vous plaît entrer un numéro de téléphone valide"
            : businessCountry === "IT"
            ? "Per favore inserisci un numero di telefono corretto"
            : "Por favor ingresa un número de teléfono válido"
        )
        .optional(),

      AcceptPromotions: z.boolean(),
      AcceptTerms: z.boolean(),
      BirthdayDate: z.string().optional(),
      Email: z
        .string({
          required_error:
            businessCountry === "US" || businessCountry === "HK"
              ? "Please tell us your email"
              : businessCountry === "CA" || businessCountry === "FR"
              ? "S'il vous plaît dites-nous votre email"
              : businessCountry === "IT"
              ? "Per favore dicci la tua email"
              : "Por favor dinos tu correo electrónico",
        })
        .email(
          businessCountry === "US" || businessCountry === "HK"
            ? "Please type a correct email"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Veuillez entrer un email valide"
            : businessCountry === "IT"
            ? "Per favore inserisci un email corretto"
            : "Por favor ingresa un correo electrónico válido"
        ),

      Origin: z.nativeEnum(Origins, {
        required_error:
          businessCountry === "US" || businessCountry === "HK"
            ? "Please tell us where you know us"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "S'il vous plaît dites-nous d'où vous nous connaissez"
            : businessCountry === "IT"
            ? "Per favore dicci da dove ci conosci"
            : "Por favor dinos de dónde nos conoces",
      }),

      Dinners: z.enum(
        [
          "1-2",
          "2-4",
          "+4",
          businessCountry === "US"
            ? "To go"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Pour emporter"
            : businessCountry === "IT"
            ? "Da asporto"
            : "Para llevar",
          businessCountry === "US"
            ? "For delivery"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Pour livraison"
            : businessCountry === "IT"
            ? "Per consegna"
            : "Domicilio",
        ],
        {
          required_error:
            businessCountry === "US" || businessCountry === "HK"
              ? "Please tell us how many people had dinner with you"
              : businessCountry === "CA" || businessCountry === "FR"
              ? "S'il vous plaît dites-nous combien de personnes ont dîné avec vous"
              : businessCountry === "IT"
              ? "Per favore dicci quante persone hanno cenato con te"
              : "Por favor dinos cuántas personas cenaron contigo",
        }
      ),

      AverageTicket: z.enum(averageTicket, {
        required_error:
          businessCountry === "US" || businessCountry === "HK"
            ? "Please tell us how much did you spend today per person?"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Veuillez nous dire combien vous avez dépensé aujourd'hui par personne"
            : businessCountry === "IT"
            ? "Per favore dicci quanto hai speso oggi per persona"
            : "Por favor dinos cuánto gastaste hoy por persona",
      }),

      PaymentMethod: z.enum(paymentMethod, {
        required_error:
          businessCountry === "US" || businessCountry === "HK"
            ? "Please tell us what was your payment method?"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Veuillez nous dire quelle était votre méthode de paiement?"
            : businessCountry === "IT"
            ? "Per favore dicci qual è stato il tuo metodo di pagamento"
            : "Por favor dinos cuál fue tu forma de pago",
      }),

      Rating: z.nativeEnum(Ratings, {
        required_error:
          businessCountry === "US" || businessCountry === "HK"
            ? "Please tell us how were we today"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "S'il te plaît, dis-nous comment nous étions aujourd'hui"
            : businessCountry === "IT"
            ? "Per favore dicci come siamo stati oggi"
            : "Por favor cuentanos cómo estuvimos el día de hoy",
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
          businessCountry === "US" || businessCountry === "HK"
            ? "You cannot exceed 500 characters"
            : businessCountry === "CA" || businessCountry === "FR"
            ? "Vous ne pouvez pas dépasser 500 caractères"
            : businessCountry === "IT"
            ? "Non puoi superare i 500 caratteri"
            : "No puedes exceder los 500 caracteres"
        ),

      hiddenInput: z.boolean().optional().nullable(),
    })
    .superRefine((values, context) => {
      if (values.AcceptPromotions && !values.PhoneNumber) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            businessCountry === "US" || businessCountry === "HK"
              ? "Please tell us your phone number"
              : businessCountry === "CA" || businessCountry === "FR"
              ? "S'il vous plaît dites-nous votre numéro de téléphone"
              : businessCountry === "IT"
              ? "Per favore dicci il tuo numero di telefono"
              : "Por favor dinos tu número de teléfono",
          path: ["PhoneNumber"],
        });
      }
    });

export type FeedbackProps = z.infer<ReturnType<typeof feedbackSchema>>;
