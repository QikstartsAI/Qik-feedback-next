/* eslint-disable react/jsx-handler-names */
import { Button } from "../../ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/Form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/Card";

import { phoneNumbersPlaceholders } from "@/app/constants/placeholders";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Input } from "../../ui/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/app/lib/utils";
import {
  IconToolsKitchen,
  IconBuildingStore,
  IconUsers,
} from "@tabler/icons-react";
import { useToast } from "@/app/hooks/useToast";
import { FeedbackProps } from "@/app/validators/feedbackSchema";
import { RadioGroup } from "../../ui/RadioGroup";
import { Origins, Ratings } from "@/app/types/feedback";
import handleSubmitFeedback, { formattedName } from "@/app/lib/handleSubmit";
import {
  findCustomerDataByEmail,
  findCustomerFeedbackDataInBusiness,
  findIsCustomerInBusiness,
} from "@/app/lib/handleEmail";
import { Checkbox } from "../../ui/Checkbox";
import { Textarea } from "../../ui/TextArea";
import { Business } from "@/app/types/business";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomRadioGroup from "../../form/CustomRadioGroup";
import Modal from "../../ui/Modal";
import {
  getKnownOrigins,
  getImprovements,
  getOthersText,
  getOtherOptions,
  getOtherOriginValues,
  getOriginLabel,
  getGoodFeedbackOptions,
} from "@/app/constants/form";
import RatingRadioGroup from "../../form/RatingRadioGroup";
import { SelectedOption } from "@/app/types/general";
import { CustomerRole } from "@/app/types/customer";
import GoogleReviewMessage from "../../form/GoogleReviewMessage";
import { lastFeedbackFilledIsGreaterThanOneDay } from "@/app/lib/utils";
import { getCustomerDataInBusiness } from "@/app/lib/handleEmail";
import { useSearchParams } from "next/navigation";
import { IconCopy } from "@tabler/icons-react";

import Image from "next/image";
import { benitoMiamoFeedbackSchema } from "@/app/validators/BenitoMiamiFeedbackSchema";
import handleBenitoMiamiSubmitFeedback from "@/app/lib/handleBenitoMiamiSubmit";

interface FeedbackFormProps {
  business: Business | null;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  setRating: Dispatch<SetStateAction<string>>;
  customerType: CustomerRole;
  setCustomerName: Dispatch<SetStateAction<string>>;
}

export default function BenitoMiamiForm({
  business,
  setIsSubmitted,
  setRating,
  setCustomerName,
  customerType,
}: FeedbackFormProps) {
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
  const branchId = searchParams.get("sucursal");
  const waiterId = searchParams.get("mesero");

  const { toast } = useToast();

  const form = useForm<FeedbackProps>({
    resolver: zodResolver(benitoMiamoFeedbackSchema()),
    defaultValues: {
      FullName: "",
      PhoneNumber: "",
      AcceptPromotions: isChecked,
      AcceptTerms: isTermsChecked,
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
    setLoadingPercentage(0);
  };

  const { watch } = form;
  const watchRating = watch("Rating");
  const isLowRating =
    watchRating === Ratings.Mal || watchRating === Ratings.Regular;
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
    copyToClipboard(goodFeedback);
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
        message: "Select at least one option",
      });
      return;
    }

    if (isLowRating && ImproveText.length === 0) {
      form.setError("ImproveText", {
        type: "manual",
        message: "Please tell us how can we improve",
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

      await handleBenitoMiamiSubmitFeedback(
        updatedData,
        improveOptions,
        customerType,
        attendantName,
        customerNumberOfVisits,
        feedbackNumberOfVisit
      );
      setLoadingPercentage(70);
      if (!isLowRating && business?.MapsUrl) {
        handleRedirect();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred, try again",
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
        copyToClipboard(goodFeedback);
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
              <p>Thank you!</p>
              <p>
                ✌🏻 You have reached the daily survey limit. Until your next
                visit! 😉
              </p>
            </div>
          </Modal>
        )}
        <Card>
          <CardHeader>
            <CardTitle>
              We value your opinion 😊, it will take you less than
              <span className="text-sky-500 font-medium">1 minute</span>
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: juan@gmail.com"
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
                                if (business?.BusinessId) {
                                  setIsCustomerInBusiness(
                                    await findIsCustomerInBusiness(
                                      email,
                                      formattedName(business.BusinessId)
                                    )
                                  );
                                }
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
                        <FormLabel>Full name</FormLabel>
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
                        <FormLabel>Phone</FormLabel>
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
                              I agree to receive promotions
                            </span>
                          </>
                        </FormControl>
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
                            true,
                            false,
                            false,
                            false,
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
                  {/* Rating */}
                  <FormField
                    control={form.control}
                    name="Rating"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel> How were we today?</FormLabel>
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
                        <FormLabel>What can we improve?</FormLabel>
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
                                  Food
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
                                  Service
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
                                  Atmosphere
                                </p>
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      {form.formState.errors.hiddenInput ? (
                        <FormMessage>
                          Please select at least one option
                        </FormMessage>
                      ) : null}
                      <FormField
                        control={form.control}
                        name="ImproveText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Share details about your experience in this place
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ej:the food was very good, but the service was slow."
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
                      isUsCountry={false}
                      isCaCountry={false}
                      isFrCountry={false}
                      isItCountry={false}
                    />
                  ) : null
                ) : null}
                <Button
                  className="w-full"
                  type={"submit"}
                  disabled={
                    isTermsChecked === false || isLastFeedbackMoreThanOneDay
                      ? true
                      : form.formState.isSubmitting
                  }
                >
                  Send
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
                            By pressing &quot;Submit&quot;, I declare that I
                            accept the{" "}
                            <a
                              className="text-primary hover:underline"
                              href="https://qikstarts.com/terms-of-service"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Terms and Cons
                            </a>{" "}
                            and the{" "}
                            <a
                              className="text-primary hover:underline"
                              href="https://qikstarts.com/privacy-policy"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              Privacy Policies
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
                        Almost there!
                        <br />
                        You will be redirected to
                      </p>
                      <Image
                        src="/google.png"
                        alt="experiencia bueno"
                        className="w-[60%]"
                        width={668}
                        height={657}
                      />
                      <p className="font-bold">
                        What was the best part of your visit?
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
                          placeholder="Ex: The food was very good, recommended."
                          onChange={(event) =>
                            setGoodFeedback(event.target.value)
                          }
                          value={goodFeedback}
                        />
                        <IconCopy
                          className="text-qik"
                          cursor="pointer"
                          onClick={() => copyToClipboard(goodFeedback)}
                        />
                      </div>

                      <p
                        className={cn(
                          "transition-all font-bold text-[#ff0000]",
                          goodFeedback ? "opacity-100" : "opacity-0"
                        )}
                      >
                        Text copied! Just paste it into Google and you&apos;re
                        done. 😍
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
                          <p>We are sending you to Google ...</p>
                        </div>
                      )}
                      <Button
                        className="w-full"
                        type="submit"
                        disabled={
                          isTermsChecked === false ||
                          isLastFeedbackMoreThanOneDay
                            ? true
                            : form.formState.isSubmitting
                        }
                      >
                        COPY TO GOOGLE
                      </Button>
                      <div className="flex gap-3">
                        <input
                          type="checkbox"
                          className="form-checkbox min-h-[12px] min-w-[12px] text-green-500"
                          onChange={() => setIsTermsChecked(!isTermsChecked)}
                          checked={isTermsChecked}
                        />
                        <small className="text-gray-500">
                          By pressing &quot;Submit&quot;, I declare that I
                          accept the{" "}
                          <a
                            className="text-primary hover:underline"
                            href="https://qikstarts.com/terms-of-service"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Terms and Cons
                          </a>{" "}
                          and the{" "}
                          <a
                            className="text-primary hover:underline"
                            href="https://qikstarts.com/privacy-policy"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Privacy Policies
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
