/* eslint-disable react/jsx-handler-names */
import { Button } from "../ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";

import { currencyPrices } from "@/app/constants/prices";
import { phoneNumbersPlaceholders } from "@/app/constants/placeholders";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Input } from "../ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/app/lib/utils";
import {
  IconToolsKitchen,
  IconBuildingStore,
  IconUsers,
} from "@tabler/icons-react";
import { useToast } from "@/app/hooks/useToast";
import { FeedbackProps, feedbackSchema } from "@/app/validators/feedbackSchema";
import { RadioGroup } from "../ui/RadioGroup";
import { Origins, Ratings } from "@/app/types/feedback";
import handleSubmitFeedback, { formattedName } from "@/app/lib/handleSubmit";
import {
  findCustomerDataByEmail,
  findCustomerFeedbackDataInBusiness,
  findIsCustomerInBusiness,
} from "@/app/lib/handleEmail";
import { Checkbox } from "../ui/Checkbox";
import { Textarea } from "../ui/TextArea";
import { Business } from "@/app/types/business";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomRadioGroup from "../form/CustomRadioGroup";
import Modal from "../ui/Modal";
import {
  getCustomersQuantity,
  getKnownOrigins,
  getAverageTicket,
  getImprovements,
  getOthersText,
  getOtherOptions,
  getOtherOriginValues,
  getOriginLabel,
  getWalletByCountry,
  getGoodFeedbackOptions,
} from "@/app/constants/form";
import RatingRadioGroup from "../form/RatingRadioGroup";
import { SelectedOption } from "@/app/types/general";
import { CustomerRole } from "@/app/types/customer";
import GoogleReviewMessage from "../form/GoogleReviewMessage";
import { lastFeedbackFilledIsGreaterThanOneDay } from "@/app/lib/utils";
import { getCustomerDataInBusiness } from "@/app/lib/handleEmail";
import { useSearchParams } from "next/navigation";
import {
  walletsByCountry,
  walletsIdsByCountryWithCommon,
} from "@/app/constants/wallets";
import { IconCopy } from "@tabler/icons-react";

import Image from "next/image";
import useGetBusinessData from "@/app/hooks/useGetBusinessData";

interface FeedbackFormProps {
  business: Business | null;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setRating: Dispatch<SetStateAction<string>>;
  customerType: CustomerRole;
  setCustomerName: Dispatch<SetStateAction<string>>;
  branchId: string | null;
  waiterId: string | null;
}

export default function FeedbackForm({
  business,
  setIsSubmitted,
  setRating,
  setCustomerName,
  customerType,
  branchId,
  waiterId,
}: FeedbackFormProps) {
  const { brandColor } = useGetBusinessData();

  const searchParams = useSearchParams();

  const [loadingPercentage, setLoadingPercentage] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(true);
  const [showOtherOptionsModal, setShowOtherOptionsModal] =
    useState<boolean>(false);
  const [showGoodFeedbackModal, setShowGoodFeedbackModal] =
    useState<boolean>(false);
  const [selectedOtherOption, setSelectedOtherOption] =
    useState<SelectedOption | null>(null);

  const [isCustomerInBusiness, setIsCustomerInBusiness] =
    useState<boolean>(false);
  const [isLastFeedbackMoreThanOneDay, setIsLastFeedbackMoreThanOneDay] =
    useState<boolean | undefined>(false);
  const [showLastFeedbackFilledModal, setShowLastFeedbackFilledModal] =
    useState<boolean | undefined>(false);

  const businessId = searchParams.get("id");

  const { toast } = useToast();

  const form = useForm<FeedbackProps>({
    resolver: zodResolver(
      feedbackSchema(
        currencyPrices[business?.Country || "EC"],
        walletsIdsByCountryWithCommon(business?.Country || "EC"),
        business?.Country || "EC"
      )
    ),
    defaultValues: {
      FullName: "",
      PhoneNumber: "",
      AcceptPromotions: isChecked,
      AcceptTerms: isTermsChecked,
      BirthdayDate: "",
      Email: "",
      Origin: undefined,
      Rating: undefined,
      StartTime: new Date(),
      Ambience: false,
      Food: false,
      Service: false,
      ImproveText: "",
      hiddenInput: null,
    },
  });

  const resetForm = () => {
    form.reset();
  };

  const { watch } = form;
  const watchRating = watch("Rating");
  const isLowRating =
    watchRating === Ratings.Mal || watchRating === Ratings.Regular;
  const isUsCountry = business?.Country === "US" || business?.Country === "HK";
  const isCaCountry = business?.Country === "CA";
  const isFrCountry = business?.Country === "FR";
  const isItCountry = business?.Country === "IT";
  const watchFullName = watch("FullName");
  const waiterName = business?.Waiter?.name || "";
  const attendantName = waiterName ? waiterName : "Matriz";

  const [goodFeedback, setGoodFeedback] = useState("");

  const writeReviewURL = () => {
    if (!business?.MapsUrl) return "";
    if (business?.MapsUrl?.includes("https")) {
      return business?.MapsUrl;
    }
    return `https://search.google.com/local/writereview?placeid=${business?.MapsUrl}`;
  };

  const handleRedirect = () => {
    copyToClipboard(finalGoodFeedback());
    setLoadingPercentage(100);
    window.location.replace(writeReviewURL());
  };

  async function onSubmit(data: FeedbackProps) {
    setRating(data.Rating);
    setCustomerName(data.FullName);
    const { Ambience, Service, Food, ImproveText } = data;
    if (isLowRating && !Ambience && !Service && !Food) {
      form.setError("hiddenInput", {
        type: "manual",
        message: isUsCountry
          ? "Select at least one option"
          : isCaCountry || isFrCountry
          ? "Sélectionnez au moins une option"
          : isItCountry
          ? "Seleziona almeno un'opzione"
          : "Selecciona al menos una opción",
      });
      return;
    }

    if (isLowRating && ImproveText.length === 0) {
      form.setError("ImproveText", {
        type: "manual",
        message: isUsCountry
          ? "Please tell us how can we improve"
          : isCaCountry || isFrCountry
          ? "Veuillez écrire comment nous pouvons améliorer"
          : isItCountry
          ? "Per favore dicci come possiamo migliorare"
          : "Por favor, escribe en que podemos mejorar",
      });
      return;
    }
    if (!isLowRating && !showGoodFeedbackModal) {
      setShowGoodFeedbackModal(true);
      return;
    }
    setLoadingPercentage(20);

    try {
      const updatedData = data;
      updatedData.ImproveText = isLowRating ? ImproveText : "";
      updatedData.AcceptPromotions = isChecked;
      const improveOptions = isLowRating
        ? getImprovements({
            Ambience,
            Service,
            Food,
            businessCountry: business?.Country,
          })
        : [];
      let customerNumberOfVisits = 0;
      let feedbackNumberOfVisit = 0;
      const customerFeedbackInBusinesData =
        await findCustomerFeedbackDataInBusiness(
          data.Email,
          formattedName(businessId) || ""
        );
      setLoadingPercentage(60);

      if (customerFeedbackInBusinesData) {
        const feedbackVisits =
          customerFeedbackInBusinesData.customerNumberOfVisits;
        customerNumberOfVisits = feedbackVisits + 1;
        feedbackNumberOfVisit = feedbackVisits + 1;
      } else {
        customerNumberOfVisits = 1;
        feedbackNumberOfVisit = 1;
      }

      await handleSubmitFeedback(
        updatedData,
        improveOptions,
        customerType,
        attendantName,
        customerNumberOfVisits,
        feedbackNumberOfVisit,
        businessId,
        branchId,
        waiterId
      );
      setLoadingPercentage(70);
      if (!isLowRating && business?.MapsUrl) {
        handleRedirect();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: isUsCountry
          ? "An error occurred, try again"
          : isCaCountry || isFrCountry
          ? "Une erreur s'est produite, réessayez"
          : isItCountry
          ? "Si è verificato un errore, riprova"
          : "Ocurrio un error, intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      if (!isLowRating && !showGoodFeedbackModal) {
        return;
      }
      resetForm();
      setIsSubmitted(true);
    }
  }

  const handleOthersSelecteOption = (option: SelectedOption) => {
    form.setValue("Origin", option?.value as Origins);
    setSelectedOtherOption(option);
  };

  const finalGoodFeedback = () => {
    if (!walletsByCountry[business?.Country || "EC"]) return goodFeedback;
    const paymentMethodName =
      walletsByCountry[business?.Country || "EC"].find(
        (method) => method.id === form.getValues().PaymentMethod
      )?.name ?? "";
    const textByCountry = paymentMethodName
      ? isUsCountry
        ? "I paid with "
        : isCaCountry || isFrCountry
        ? "J'ai payé avec "
        : isItCountry
        ? "Ho pagato con "
        : "✅ Pagué con "
      : "";

    const feedbackWithPayment = `${textByCountry}${paymentMethodName} 🔰`;
    if (!goodFeedback.includes(feedbackWithPayment)) {
      return `${goodFeedback} \n ${feedbackWithPayment}`;
    }
    return goodFeedback;
  };

  const [showIsCopied, setShowIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setShowIsCopied(true);
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
    } else {
      console.error("Clipboard API not available");
    }
  };

  useEffect(() => {
    setShowIsCopied(false);
    let timeout: ReturnType<typeof setTimeout>;
    if (showGoodFeedbackModal) {
      timeout = setTimeout(() => {
        copyToClipboard(finalGoodFeedback());
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [showGoodFeedbackModal, goodFeedback]);

  return (
    <>
      <div
        className="mx-auto py-12 lg:py-24 max-w-xl px-6 min-h-screen"
        id="form"
      >
        {showOtherOptionsModal && (
          <Modal isOpen={true} onClose={() => setShowOtherOptionsModal(false)}>
            <ul className="flex flex-row flex-wrap justify-center items-center gap-3 text-sm font-medium text-gray-900 mt-5">
              {getOtherOptions(business?.Country).map((option) => (
                <li key={option.value} className="list-none">
                  <button
                    className={cn(
                      "flex justify-center items-center w-full px-3 bg-white border border-gray-200 rounded-lg py-1 cursor-pointer shadow hover:border-sky-500 hover:text-sky-500 transition-all",
                      {
                        "border-sky-500 text-sky-500":
                          selectedOtherOption?.value === option.value,
                      }
                    )}
                    onClick={() => handleOthersSelecteOption(option)}
                  >
                    <p className="text-[10px]">{option.label}</p>
                  </button>
                </li>
              ))}
            </ul>
          </Modal>
        )}

        {showLastFeedbackFilledModal && (
          <Modal
            isOpen={true}
            onClose={() => setShowLastFeedbackFilledModal(false)}
          >
            <div className="text-center">
              <p>
                {isUsCountry
                  ? "Thank you! "
                  : isCaCountry || isFrCountry
                  ? "Merci!"
                  : isItCountry
                  ? "Grazie!"
                  : "¡Gracias!"}
              </p>
              <p>
                {isUsCountry
                  ? "✌🏻 You have reached the daily survey limit. Until your next visit! 😉"
                  : isCaCountry || isFrCountry
                  ? "✌🏻 Vous avez atteint la limite quotidienne d'enquêtes. A votre prochaine visite ! 😉"
                  : isItCountry
                  ? "✌🏻 Hai raggiunto il limite giornaliero di sondaggi. Alla tua prossima visita! 😉"
                  : "✌🏻 Has alcanzado el límite diario de encuestas. ¡Hasta tu próxima visita! 😉"}
              </p>
            </div>
          </Modal>
        )}
        <Card>
          <CardHeader>
            <CardTitle>
              {isUsCountry
                ? "We value your opinion 😊, it will take you less than "
                : isCaCountry || isFrCountry
                ? "Nous apprécions votre avis 😊, cela vous prendra moins de "
                : isItCountry
                ? "Apprezziamo la tua opinione 😊, ci vorrà meno di "
                : "Valoramos tu opinión 😊, te tomará menos de "}
              <span
                className="font-medium"
                style={{ color: `hsl(${brandColor || "var(--qik)"}` }}
              >
                {isUsCountry
                  ? "1 minute"
                  : isCaCountry || isFrCountry
                  ? "1 minute"
                  : isItCountry
                  ? "1 minuto"
                  : "1 minutos"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 md:space-y-6"
                noValidate
              >
                <div className={cn("space-y-3 mb-3", {})}>
                  {/*<Wizard/>*/}
                  <FormField
                    control={form.control}
                    name="Email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isUsCountry
                            ? "Email"
                            : isCaCountry || isFrCountry
                            ? "Courrier électronique"
                            : isItCountry
                            ? "Email"
                            : "Correo electrónico"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              isItCountry
                                ? "Esempio: stefano@gmail.com"
                                : "Ej: juan@gmail.com"
                            }
                            {...field}
                            type="email"
                            onBlur={async () => {
                              const email = field.value;
                              if (email) {
                                const customerData =
                                  await findCustomerDataByEmail(email);
                                const customerDataInBusiness =
                                  await getCustomerDataInBusiness(
                                    email,
                                    businessId,
                                    branchId,
                                    waiterId
                                  );
                                const lastFeedbackFilledInBusiness =
                                  customerDataInBusiness?.lastFeedbackFilled;
                                const lastFeedbackGreaterThanOneDay =
                                  lastFeedbackFilledIsGreaterThanOneDay(
                                    lastFeedbackFilledInBusiness
                                  );
                                setIsCustomerInBusiness(
                                  await findIsCustomerInBusiness(
                                    email,
                                    formattedName(business?.BusinessId)
                                  )
                                );
                                setShowLastFeedbackFilledModal(
                                  lastFeedbackGreaterThanOneDay
                                );
                                setIsLastFeedbackMoreThanOneDay(
                                  lastFeedbackGreaterThanOneDay
                                );
                                if (customerData) {
                                  form.setValue("FullName", customerData.name);
                                  form.setValue(
                                    "PhoneNumber",
                                    customerData.phoneNumber || ""
                                  );
                                  form.setValue(
                                    "BirthdayDate",
                                    customerData.birthdayDate || ""
                                  );
                                  setIsChecked(
                                    customerData.acceptPromotions || false
                                  );
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* name */}
                  <FormField
                    control={form.control}
                    name="FullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isUsCountry
                            ? "Full name"
                            : isCaCountry || isFrCountry
                            ? "Nom complet"
                            : isItCountry
                            ? "Nome completo"
                            : "Nombre completo"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={
                              isItCountry
                                ? "Esempio: Stefano Grassi"
                                : "Ej: Juan Pérez"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="PhoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isUsCountry
                            ? "Phone"
                            : isCaCountry || isFrCountry
                            ? "Téléphone"
                            : isItCountry
                            ? "Telefono"
                            : "Teléfono"}
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            {...field}
                            placeholder={`Ej: ${
                              phoneNumbersPlaceholders[
                                business?.Country || "EC"
                              ]
                            }`}
                            defaultCountry={business?.Country}
                            onChange={(value) => {
                              form.setValue("PhoneNumber", value);
                              setIsChecked(!!value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="AcceptPromotions"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <input
                              type="checkbox"
                              className="form-checkbox h-3 w-3 text-green-500"
                              onChange={() => {
                                const newChecked = !isChecked;
                                setIsChecked(newChecked);
                                form.setValue("AcceptPromotions", newChecked);
                              }}
                              checked={isChecked}
                            />
                            <span className="ml-2 text-gray-700 text-xs">
                              {isUsCountry
                                ? "I agree to receive promotions"
                                : isCaCountry || isFrCountry
                                ? "J'accepte de recevoir des promotions"
                                : isItCountry
                                ? "Accetto di ricevere promozioni"
                                : "Acepto recibir promociones"}
                            </span>
                          </>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="BirthdayDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isUsCountry
                            ? "Your birthday? 🎂 (optional)"
                            : isCaCountry || isFrCountry
                            ? "Ton anniversaire? 🎂 (facultatif)"
                            : isItCountry
                            ? "Il tuo compleanno? 🎂 (opzionale)"
                            : "¿Tu fecha de cumpleaños? 🎂 (opcional)"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder="Ej: 29/10/1999"
                            max="2005-12-31"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* origin */}
                  <FormField
                    control={form.control}
                    name="Origin"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          {" "}
                          {getOriginLabel(
                            isUsCountry,
                            isCaCountry,
                            isFrCountry,
                            isItCountry,
                            customerType
                          )}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (
                                value === getOthersText(business?.Country) ||
                                value === selectedOtherOption?.value
                              ) {
                                setShowOtherOptionsModal(true);
                              }
                            }}
                            defaultValue={field.value}
                            className=""
                          >
                            <CustomRadioGroup
                              className="sm:grid-cols-5"
                              value={field.value}
                              items={getKnownOrigins(business?.Country).concat(
                                !selectedOtherOption
                                  ? getOtherOriginValues(business?.Country)
                                  : selectedOtherOption
                              )}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Dinners */}
                  <FormField
                    control={form.control}
                    name="Dinners"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          {" "}
                          {isUsCountry
                            ? "People at the table?"
                            : isCaCountry || isFrCountry
                            ? "Du monde à table ?"
                            : isItCountry
                            ? "Persone al tavolo?"
                            : "¿Personas en la mesa?"}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className=""
                          >
                            <CustomRadioGroup
                              className="sm:grid-cols-5"
                              value={field.value}
                              items={getCustomersQuantity(business?.Country)}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* AverageTicket */}
                  <FormField
                    control={form.control}
                    name="AverageTicket"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          {" "}
                          {isUsCountry
                            ? "How much did you spend today per person?"
                            : isCaCountry || isFrCountry
                            ? "Qu'est-ce que tu as à manger aujourd'hui par personne ?"
                            : isItCountry
                            ? "Quanto hai speso oggi a persona?"
                            : "¿Cuánto gastaste hoy por persona?"}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className=""
                          >
                            <CustomRadioGroup
                              className="sm:grid-cols-5"
                              value={field.value}
                              items={getAverageTicket(business?.Country)}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="PaymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          {" "}
                          {isUsCountry
                            ? "What was your payment method?"
                            : isCaCountry || isFrCountry
                            ? "Quelle était votre méthode de paiement ?"
                            : isItCountry
                            ? "Qual è stato il tuo metodo di pagamento?"
                            : "¿Cuál fue tu forma de pago?"}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className=""
                          >
                            <CustomRadioGroup
                              className="sm:grid-cols-5 !py-0"
                              value={field.value}
                              items={getWalletByCountry(business?.Country)}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Rating */}
                  <FormField
                    control={form.control}
                    name="Rating"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel>
                          {" "}
                          {isUsCountry
                            ? "How were we today?"
                            : isCaCountry || isFrCountry
                            ? "Comment sommes-nous le jour d'aujourd'hui ?"
                            : isItCountry
                            ? "Come siamo stati oggi?"
                            : "¿Cómo estuvimos el dia de hoy?"}
                        </FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange}>
                            <RatingRadioGroup
                              value={field.value}
                              business={business}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Fields required when rating is low */}
                  {isLowRating ? (
                    <>
                      <FormItem>
                        <FormLabel>
                          {isUsCountry
                            ? "What can we improve?"
                            : isCaCountry || isFrCountry
                            ? "Et qu'est-ce que nous pourrions améliorer?"
                            : isItCountry
                            ? "Cosa possiamo migliorare?"
                            : "¿En qué podemos mejorar?"}
                        </FormLabel>
                      </FormItem>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 text-sm font-medium text-gray-900">
                        <FormField
                          control={form.control}
                          name="Food"
                          render={({ field }) => (
                            <FormItem
                              className={cn(
                                "flex flex-row items-start space-y-0 rounded-md border py-1 sm:py-2 shadow hover:border-sky-500 hover:text-sky-500 transition-all",
                                {
                                  "border-sky-500 text-sky-500": field.value,
                                }
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  "text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1 hover:border-sky-500 hover:text-sky-500 transition-all",
                                  {
                                    "border-sky-500 text-sky-500": field.value,
                                  }
                                )}
                              >
                                <IconToolsKitchen />
                                <p className="w-full text-[10px] sm:text-[11px]">
                                  {isUsCountry
                                    ? "Food"
                                    : isCaCountry || isFrCountry
                                    ? "Cuisine"
                                    : isItCountry
                                    ? "Cibo"
                                    : "Comida"}
                                </p>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Service"
                          render={({ field }) => (
                            <FormItem
                              className={cn(
                                "flex flex-row items-start space-y-0 rounded-md border py-1 sm:py-2 shadow hover:border-sky-500 hover:text-sky-500 transition-all",
                                {
                                  "border-sky-500 text-sky-500": field.value,
                                }
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  "text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1",
                                  {
                                    "text-sky-500": field.value,
                                  }
                                )}
                              >
                                <IconUsers />
                                <p className="w-full text-[10px] sm:text-[11px]">
                                  {isUsCountry
                                    ? "Service"
                                    : isCaCountry || isFrCountry
                                    ? "Service"
                                    : isItCountry
                                    ? "Servizio"
                                    : "Servicio"}
                                </p>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="Ambience"
                          render={({ field }) => (
                            <FormItem
                              className={cn(
                                "flex flex-row items-start space-y-0 rounded-md border py-1 sm:py-2 shadow hover:border-sky-500 hover:text-sky-500 transition-all",
                                {
                                  "border-sky-500 text-sky-500": field.value,
                                }
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="sr-only"
                                />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  "text-center w-full font-normal flex flex-col items-center cursor-pointer space-y-1",
                                  {
                                    "text-sky-500": field.value,
                                  }
                                )}
                              >
                                <IconBuildingStore />
                                <p className="w-full text-[10px] sm:text-[11px]">
                                  {isUsCountry
                                    ? "Atmosphere"
                                    : isCaCountry || isFrCountry
                                    ? "Ambiance"
                                    : isItCountry
                                    ? "Atmosfera"
                                    : "Ambiente"}
                                </p>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      {form.formState.errors.hiddenInput ? (
                        <FormMessage>
                          {isUsCountry
                            ? "Please select at least one option"
                            : isCaCountry
                            ? "Veuillez sélectionner au moins une option"
                            : isItCountry
                            ? "Seleziona almeno un'opzione"
                            : "Por favor selecciona al menos una opción"}
                        </FormMessage>
                      ) : null}
                      <FormField
                        control={form.control}
                        name="ImproveText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {isUsCountry
                                ? "Share details about your experience in this place"
                                : isCaCountry || isFrCountry
                                ? "Partagez des détails sur votre expérience dans ce lieu"
                                : isItCountry
                                ? "Condividi i dettagli della tua esperienza in questo posto"
                                : "Compartenos detalles sobre tu experiencia en este lugar"}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={
                                  isUsCountry
                                    ? "Ej:the food was very good, but the service was slow."
                                    : isCaCountry || isFrCountry
                                    ? "Fr: La nourriture était très bonne, mais le service était lent."
                                    : isItCountry
                                    ? "Es: Il cibo era molto buono, ma il servizio era lento."
                                    : "Ej: La comida estuvo muy buena, pero el servicio fue lento."
                                }
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : null}
                </div>
                {!isCustomerInBusiness ? (
                  (watchRating == Ratings.Excelente ||
                    watchRating === Ratings.Bien) &&
                  watchFullName ? (
                    <GoogleReviewMessage
                      customerFullName={watchFullName}
                      isCaCountry={isCaCountry}
                      isFrCountry={isFrCountry}
                      isUsCountry={isUsCountry}
                      isItCountry={isItCountry}
                    />
                  ) : null
                ) : null}
                <Button
                  className="w-full"
                  type={"submit"}
                  color={`hsl(${brandColor || "var(--qik)"})`}
                  disabled={
                    isTermsChecked === false || isLastFeedbackMoreThanOneDay
                      ? true
                      : form.formState.isSubmitting
                  }
                >
                  {isUsCountry
                    ? "Send"
                    : isCaCountry || isFrCountry
                    ? "Envoyer"
                    : isItCountry
                    ? "Inviare"
                    : "Enviar"}
                </Button>
                <CardFooter>
                  <FormField
                    control={form.control}
                    name="AcceptTerms"
                    render={() => (
                      <FormControl>
                        <>
                          <input
                            type="checkbox"
                            className="form-checkbox min-h-[12px] min-w-[12px] text-green-500"
                            onChange={() => setIsTermsChecked(!isTermsChecked)}
                            checked={isTermsChecked}
                          />
                          <small className="text-gray-500">
                            {isUsCountry
                              ? 'By pressing "Submit", I declare that I accept the'
                              : isCaCountry || isFrCountry
                              ? 'En pressant "Enviar", déclarez que vous acceptez les'
                              : isItCountry
                              ? 'Premendo "Inviare", dichiaro di accettare i'
                              : 'Al presionar "Enviar", declaro que acepto los'}{" "}
                            <a
                              className="text-primary hover:underline"
                              href="https://qikstarts.com/terms-of-service"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {isUsCountry
                                ? "Terms and Cons"
                                : isCaCountry || isFrCountry
                                ? "Conditions et conditions"
                                : isItCountry
                                ? "Termini e condizioni"
                                : "Términos y Condiciones"}
                            </a>{" "}
                            {isUsCountry
                              ? " and the "
                              : isCaCountry || isFrCountry
                              ? " et là "
                              : isItCountry
                              ? " e le "
                              : " y las "}{" "}
                            <a
                              className="text-primary hover:underline"
                              href="https://qikstarts.com/privacy-policy"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {isUsCountry
                                ? "Privacy Policies"
                                : isCaCountry
                                ? "Politiques de confidentialité"
                                : isItCountry
                                ? "Politiche sulla riservatezza"
                                : "Políticas de Privacidad"}
                            </a>
                            .
                          </small>
                        </>
                      </FormControl>
                    )}
                  />
                </CardFooter>
                {showGoodFeedbackModal && (
                  <Modal
                    isOpen={true}
                    onClose={() => setShowGoodFeedbackModal(false)}
                  >
                    <div className="p-6 flex flex-col items-center gap-4">
                      <p className="text-center">
                        {isUsCountry
                          ? "Almost there!"
                          : isCaCountry || isFrCountry
                          ? "Presque là !"
                          : isItCountry
                          ? "Quasi fatto!"
                          : "¡Ya casi!"}
                        <br />
                        {isUsCountry
                          ? "You will be redirected to"
                          : isCaCountry || isFrCountry
                          ? "Vous allez être redirigé vers"
                          : isItCountry
                          ? "Sarai reindirizzato a"
                          : "Te estaremos redireccionando a"}
                      </p>
                      <Image
                        src="/google.png"
                        alt="experiencia bueno"
                        className="w-[60%]"
                        width={668}
                        height={657}
                      />
                      <p className="font-bold">
                        {isUsCountry
                          ? "What was the best part of your visit?"
                          : isCaCountry || isFrCountry
                          ? "Qu'est-ce qui s'est le mieux passé pendant votre visite ?"
                          : isItCountry
                          ? "Qual è stata la parte migliore della tua visita?"
                          : "¿Qué fue lo mejor de tu visita?"}
                      </p>
                      <RadioGroup
                        onValueChange={(value) =>
                          setGoodFeedback(
                            getGoodFeedbackOptions(business?.Country).find(
                              (option) => option.value === value
                            )?.label ?? ""
                          )
                        }
                        defaultValue=""
                      >
                        <CustomRadioGroup
                          className="!grid-cols-2"
                          value={"field.value"}
                          items={getGoodFeedbackOptions(business?.Country)}
                        />
                      </RadioGroup>
                      <div className="w-full flex gap-3 items-center">
                        <Textarea
                          placeholder={
                            isUsCountry
                              ? "Ex: The food was very good, recommended."
                              : isCaCountry || isFrCountry
                              ? "Ex: La nourriture était très bonne, recommandée."
                              : isItCountry
                              ? "Es: Il cibo era molto buono, consigliato."
                              : "Ej: La comida estuvo muy buena, recomendado."
                          }
                          onChange={(event) =>
                            setGoodFeedback(event.target.value)
                          }
                          value={goodFeedback}
                        />
                        <IconCopy
                          className="text-qik"
                          cursor="pointer"
                          onClick={() => copyToClipboard(finalGoodFeedback())}
                        />
                      </div>

                      <p
                        className={cn(
                          "transition-all font-bold text-[#ff0000]",
                          goodFeedback ? "opacity-100" : "opacity-0"
                        )}
                      >
                        {isUsCountry
                          ? "Text copied! Just paste it into Google and you're done. 😍"
                          : isCaCountry || isFrCountry
                          ? "Texte copié ! Il suffit de le coller sur Google et c'est fait. 😍"
                          : isItCountry
                          ? "Testo copiato! Basta incollarlo su Google e il gioco è fatto. 😍"
                          : "¡Texto copiado! Solo pégalo en Google y listo. 😍"}
                      </p>
                      {loadingPercentage > 0 && (
                        <div className="flex flex-col gap-3 w-full">
                          <div className="w-full bg-neutral-200 rounded-xl">
                            <div
                              className="bg-primary p-0.5 text-center text-xs font-medium leading-none transition-all ease-in-out text-primary-100 rounded-xl text-white"
                              style={{ width: `${loadingPercentage}%` }}
                            >
                              {loadingPercentage}%
                            </div>
                          </div>
                          <p>Te estamos enviando a Google ...</p>
                        </div>
                      )}
                      <Button
                        className="w-full"
                        type="submit"
                        color={`hsl(${brandColor || "var(--qik)"})`}
                        disabled={
                          isTermsChecked === false ||
                          isLastFeedbackMoreThanOneDay
                            ? true
                            : form.formState.isSubmitting
                        }
                      >
                        {isUsCountry
                          ? "COPY TO GOOGLE"
                          : isCaCountry || isFrCountry
                          ? "ALLER SUR GOOGLE"
                          : isItCountry
                          ? "COPIA SU GOOGLE"
                          : "PEGAR EN GOOGLE"}
                      </Button>
                      <div className="flex gap-3">
                        <input
                          type="checkbox"
                          className="form-checkbox min-h-[12px] min-w-[12px] text-green-500"
                          onChange={() => setIsTermsChecked(!isTermsChecked)}
                          checked={isTermsChecked}
                        />
                        <small className="text-gray-500">
                          {isUsCountry
                            ? 'By pressing "Submit", I declare that I accept the'
                            : isCaCountry || isFrCountry
                            ? 'En pressant "Enviar", déclarez que vous acceptez les'
                            : isItCountry
                            ? 'Premendo "Inviare", dichiaro di accettare i'
                            : 'Al presionar "Enviar", declaro que acepto los'}{" "}
                          <a
                            className="text-primary hover:underline"
                            href="https://qikstarts.com/terms-of-service"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {isUsCountry
                              ? "Terms and Cons"
                              : isCaCountry || isFrCountry
                              ? "Conditions et conditions"
                              : isItCountry
                              ? "Termini e condizioni"
                              : "Términos y Condiciones"}
                          </a>{" "}
                          {isUsCountry
                            ? " and the "
                            : isCaCountry || isFrCountry
                            ? " et là "
                            : isItCountry
                            ? " e le "
                            : " y las "}{" "}
                          <a
                            className="text-primary hover:underline"
                            href="https://qikstarts.com/privacy-policy"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {isUsCountry
                              ? "Privacy Policies"
                              : isCaCountry
                              ? "Politiques de confidentialité"
                              : isItCountry
                              ? "Politiche sulla riservatezza"
                              : "Políticas de Privacidad"}
                          </a>
                          .
                        </small>
                      </div>
                    </div>
                  </Modal>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
