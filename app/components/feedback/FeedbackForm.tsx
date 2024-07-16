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

import PhoneInput, { Country } from "react-phone-number-input";
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
import { Ratings } from "@/app/types/feedback";
import handleSubmitFeedback from "@/app/lib/handleSubmit";
import { Checkbox } from "../ui/Checkbox";
import { Textarea } from "../ui/TextArea";
import { Alert, AlertDescription, AlertTitle } from "../ui/Alert";
import { Business } from "@/app/types/business";
import { Dispatch, SetStateAction, useState } from "react";
import CustomRadioGroup from "../form/CustomRadioGroup";
import {
  getCustomersQuantity,
  getKnownOrigins,
  getAverageTicket,
  getImprovements,
} from "@/app/constants/form";
import RatingRadioGroup from "../form/RatingRadioGroup";
import Footer from "./Footer";
import { useGetCurrentBusinessByIdImmutable } from "@/app/hooks/services/businesses";
import { useFormStore } from "@/app/stores/form";
import { useTranslation } from "react-i18next";

interface FeedbackFormProps {
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setRating: Dispatch<SetStateAction<string>>;
}

export default function FeedbackForm() {
  const { t } = useTranslation("form");
  const { setIsSubmitted, setRating, business } = useFormStore();

  const { isLoading: loadingBusiness } = useGetCurrentBusinessByIdImmutable();

  const [isChecked, setIsChecked] = useState(true);
  const [isTermsChecked, setIsTermsChecked] = useState(true);
  const { toast } = useToast();
  const form = useForm<FeedbackProps>({
    resolver: zodResolver(
      feedbackSchema(
        currencyPrices[business?.Country || "EC"],
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

  const watchFullName = watch("FullName");

  const handleRedirect = () => {
    window.location.replace(business?.MapsUrl || "");
  };

  async function onSubmit(data: FeedbackProps) {
    setRating(data.Rating);
    const { Ambience, Service, Food, ImproveText } = data;
    if (isLowRating && !Ambience && !Service && !Food) {
      form.setError("hiddenInput", {
        type: "manual",
        message: t(`selectOneErrorText`),
      });
      return;
    }

    if (isLowRating && ImproveText.length === 0) {
      form.setError("ImproveText", {
        type: "manual",
        message: t(`improveTextErrorText`),
      });
      return;
    }

    try {
      const updatedData = data;
      updatedData.AcceptPromotions = isChecked;
      const improveOptions = getImprovements({
        Ambience,
        Service,
        Food,
        business,
      });
      await handleSubmitFeedback(updatedData, improveOptions);
      if (
        (data.Rating === Ratings.Bueno || data.Rating === Ratings.Excelente) &&
        business?.MapsUrl
      ) {
        handleRedirect();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: t(`trylaterErrorText`),
        variant: "destructive",
      });
    } finally {
      resetForm();
      setIsSubmitted(true);
    }
  }

  return (
    <>
      <div
        className="mx-auto py-12 lg:py-24 max-w-xl px-6 min-h-screen"
        id="form"
      >
        <Card>
          <CardHeader>
            <CardTitle>
              <p dangerouslySetInnerHTML={{ __html: t(`title`) }}></p>
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
                  {/* name */}
                  <FormField
                    control={form.control}
                    name="FullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(`fullNameLabel`)}</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Juan Pérez" {...field} />
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
                        <FormLabel>{t(`phoneLabel`)}</FormLabel>
                        <FormControl>
                          <PhoneInput
                            {...field}
                            placeholder={`Ej: ${
                              phoneNumbersPlaceholders[
                                business?.Country || "EC"
                              ]
                            }`}
                            defaultCountry={business?.Country as Country}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="AcceptPromotions"
                    render={() => (
                      <FormControl>
                        <>
                          <input
                            type="checkbox"
                            className="form-checkbox h-3 w-3 text-green-500"
                            onChange={() => setIsChecked(!isChecked)}
                            checked={isChecked}
                          />
                          <span className="ml-2 text-gray-700 text-xs">
                            {t(`promotionsLabel`)}
                          </span>
                        </>
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(`emailLabel`)}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t(`emailPlaceholder`)}
                            {...field}
                            type="email"
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
                        <FormLabel>{t(`originsLabel`)}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className=""
                          >
                            <CustomRadioGroup
                              value={field.value}
                              items={getKnownOrigins(business)}
                            />
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="BirthdayDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t(`birthdayLabel`)}</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            placeholder={t(`birthdayPlaceholder`)}
                            max="2005-12-31"
                            {...field}
                          />
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
                        <FormLabel>{t(`peopleAtTableLabel`)}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className=""
                          >
                            <CustomRadioGroup
                              value={field.value}
                              items={getCustomersQuantity(business)}
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
                        <FormLabel>{t(`spendLabel`)}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className=""
                          >
                            <CustomRadioGroup
                              value={field.value}
                              items={getAverageTicket(business)}
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
                        <FormLabel>{t(`ratingLabel`)}</FormLabel>
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
                        <FormLabel>{t(`lowRatingLabel`)}</FormLabel>
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
                                  {t(`foodLabel`)}
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
                                  {t(`serviceLabel`)}
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
                                  {t(`ambienceLabel`)}
                                </p>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      {form.formState.errors.hiddenInput ? (
                        <FormMessage>{t(`errorOptionMessage`)}</FormMessage>
                      ) : null}
                      <FormField
                        control={form.control}
                        name="ImproveText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t(`improveTextLabel`)}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t(`improveTextPlaceholder`)}
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
                {!isLowRating && watchFullName ? (
                  <Alert>
                    <AlertTitle className={cn("text-xs sm:text-sm")}>
                      {t(`lastFavorTitle`)}, {watchFullName}!
                    </AlertTitle>
                    <AlertDescription className={cn("text-xs sm:text-sm")}>
                      {t(`redirectFavorMessage`)}
                      <br />
                      {t(`opinionThanksMessage`)}
                    </AlertDescription>
                  </Alert>
                ) : null}
                <Button
                  type="submit"
                  disabled={
                    isTermsChecked === false
                      ? true
                      : form.formState.isSubmitting
                  }
                >
                  {t(`sendButton`)}
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
                            {t(`confirmSendText`)}{" "}
                            <a
                              className="text-primary hover:underline"
                              href="https://qikstarts.com/terms-of-service"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {t(`termsAndConditionsText`)}
                            </a>{" "}
                            {t(`andText`)}{" "}
                            <a
                              className="text-primary hover:underline"
                              href="https://qikstarts.com/privacy-policy"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {t(`privacyPoliciesText`)}
                            </a>
                            .
                          </small>
                        </>
                      </FormControl>
                    )}
                  />
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
