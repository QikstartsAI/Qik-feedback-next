import { useState } from "react";
import DefaultFormNew from "../../../hooks/DefaultFormNew.json";
import { Form, Progress } from "antd";
import "./wizard-styles.css";
import PositiveReview from "../PositiveReview";
import { Business } from "@/app/types/business";
import { FormField, Option } from "../../types/wizardTypes";
import NegativeReview from "../NegativeReview";
import {
  ClientTypeSelection,
  FormFieldRenderer,
  OptionsPopup,
  InputPopup,
} from "./components";
import handleSubmitFeedback, { formattedName } from "@/app/lib/handleSubmit";
import { findCustomerFeedbackDataInBusiness } from "@/app/lib/handleEmail";
import { getImprovements } from "@/app/constants/form";
import { toast } from "@/app/hooks/useToast";
import Thanks from "@/app/components/Thanks";

export const Wizard = ({ business }: { business: Business | null }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupOptions, setPopupOptions] = useState<Record<string, Option[]>>(
    {}
  );

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [clientType, setClientType] = useState("");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form] = Form.useForm();

  const getFormData = (): FormField[] => {
    return clientType === "new"
      ? DefaultFormNew.newClient.steps[currentStep].questions
      : [];
  };

  const calculateProgress = (values: Record<string, any>) => {
    const formFields = getFormData();
    setResponses({ ...responses, ...values });
    const totalFields = formFields.filter((field) => field.required);
    const filledFields = totalFields.filter((field) => {
      if (!field.id) return false;
      return (
        field.required &&
        !form.getFieldError(field.id)[0] &&
        values[field.id] &&
        values[field.id].length > 1
      );
    });

    const stepPercentage = (currentStep / getStepsLength()) * 90;
    const filledFieldsPercentage =
      (filledFields.length / totalFields.length) * 90;
    const newProgress =
      stepPercentage + filledFieldsPercentage / getStepsLength();
    setProgress(newProgress);
    console.log("VALUES:", responses);
  };

  const handleNextStep = () => {
    const formFields = getFormData();
    const requiredFields = formFields.filter((field) => field.required);
    const allFieldsVerified = requiredFields.every(
      (field) => responses[field.id!]
    );
    if (
      allFieldsVerified &&
      currentStep <
        DefaultFormNew[clientType === "new" ? "newClient" : "frequentClient"]
          .steps.length -
          1
    ) {
      setCurrentStep(currentStep + 1);
      setResponses({ ...responses, ...form.getFieldsValue() });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setClientType("");
    }
  };

  const getStepsLength = (): number => {
    return DefaultFormNew[clientType === "new" ? "newClient" : "frequentClient"]
      .steps.length;
  };

  const handleOptionClick = (fieldId: string, option: Option) => {
    if (option.options) {
      setPopupOptions({ [fieldId]: option.options });
      setShowPopup(true);
    } else if (option.id === "reason") {
      setSelectedOption("reason");
      setShowPopup(true);
    } else {
      setSelectedOption(option.id || null);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setPopupOptions({});
    setSelectedOption(null);
  };

  const handleSelectOption = (fieldId?: string, option?: Option) => {
    if (!fieldId || !option) return;
    if (option.options) {
      setPopupOptions({ [fieldId]: option.options });
      setShowPopup(true);
    } else {
      setResponses({ ...responses, [fieldId]: option.id });
      form.setFieldValue(fieldId, option.id);
      calculateProgress(form.getFieldsValue());
    }
  };

  const handleOnFieldChange = (fieldId?: string, value?: any) => {
    if (!fieldId || value == undefined) return;
    const field = getFormData().find((e) => e.id === fieldId);
    const options = field?.options?.find((e) => e.id === value)?.options;
    if (options) {
      setPopupOptions({ [fieldId]: options });
      setShowPopup(true);
    } else {
      form.setFieldValue(fieldId, value);
      setResponses({ ...responses, [fieldId]: value });
      calculateProgress(form.getFieldsValue());
    }
  };

  const isLastStep = currentStep === getStepsLength() - 1;

  const canOpenPositiveReview = () =>
    form.getFieldValue("rateExperience") > 3 && isLastStep;

  const canOpenNegativeReview = () =>
    form.getFieldValue("rateExperience") < 3 && isLastStep;

  const writeReviewURL = () => {
    if (!business?.MapsUrl) return "";
    if (business?.MapsUrl?.includes("https")) {
      return business?.MapsUrl;
    }
    return `https://search.google.com/local/writereview?placeid=${business?.MapsUrl}`;
  };

  const handleRedirect = () => {
    window.location.replace(writeReviewURL());
  };

  const resetForm = () => {
    setResponses({});
  };

  async function onSubmit() {
    const { Email, FullName, Ambience, Service, Food, ImproveText, Rating } =
      responses;
    const isLowRating = Rating < 3;
    try {
      const updatedData = responses;
      updatedData.ImproveText = isLowRating ? ImproveText : "";
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
          Email,
          formattedName(business?.BusinessId) || ""
        );
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
        clientType,
        FullName,
        customerNumberOfVisits,
        feedbackNumberOfVisit
      );

      if (!isLowRating && business?.MapsUrl) {
        handleRedirect();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Ocurrio un error, intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      resetForm();
      setIsSubmitted(true);
    }
  }

  if (isSubmitted) {
    return (
      <Thanks
        businessCountry={business?.Country || "EC"}
        businessName={business?.Name || ""}
        customerName={"Jsus"}
      />
    );
  }
  return (
    <div className="mt-10 w-full flex justify-center px-4">
      {!clientType ? (
        <ClientTypeSelection setClientType={setClientType} />
      ) : (
        <div className="flex flex-col">
          <Progress
            className="w-100  max-w-lg"
            strokeLinecap="round"
            status="active"
            percent={progress}
            strokeWidth={35}
            strokeColor="#2B82F6"
            percentPosition={{ align: "end", type: "inner" }}
            format={(percent) => (
              <span style={{ fontWeight: "bold", fontSize: "17px" }}>
                {percent}%
              </span>
            )}
          />

          <Form
            autoComplete="on"
            form={form}
            name="validateOnly"
            className="max-w-lg"
            onValuesChange={(_, values) => calculateProgress(values)}
          >
            <div className="flex flex-col gap-3 mt-10 w-full">
              {getFormData().map((field) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={responses[field.id ?? ""]}
                  onChange={handleOnFieldChange}
                />
              ))}
              {canOpenPositiveReview() && (
                <PositiveReview business={business} />
              )}
              {canOpenNegativeReview() && (
                <NegativeReview
                  form={form}
                  responses={responses}
                  onChange={handleOnFieldChange}
                />
              )}
            </div>
            <div className="flex justify-between gap-3 mt-10 mb-20 w-full">
              <button
                className="w-[20%] h-12 border border-gray-300 px-5 py-2 text-gray-900 hover:bg-gray-300 focus:ring focus:ring-blue-200 rounded-full bg-gray-100"
                onClick={handlePrevStep}
              >
                Atrás
              </button>
              <button
                className="w-[80%] px-5 py-2 hover:bg-blue-800 focus:ring focus:ring-blue-200 bg-blue-600 text-white rounded-full"
                onClick={
                  currentStep === getStepsLength() - 1
                    ? () => onSubmit()
                    : () => handleNextStep()
                }
              >
                {isLastStep ? "ENVIAR A GOOGLE" : "Siguiente"}
              </button>
            </div>
          </Form>
        </div>
      )}
      {selectedOption === "reason" ? (
        <InputPopup show onClose={handlePopupClose} />
      ) : (
        <OptionsPopup
          show={showPopup}
          options={popupOptions}
          responses={responses}
          onSelect={handleSelectOption}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};
