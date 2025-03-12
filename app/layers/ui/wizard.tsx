import { useState, useEffect, useRef } from "react";
import DefaultFormNew from "../hooks/DefaultFormNew.json";
import { Form, Progress, Flex, Image, Radio } from "antd";
import { cn } from "@/app/lib/utils";
import "./wizard-styles.css";
import PositiveReview from "./components/PositiveReview";
import { Business } from "@/app/types/business";
import CheckboxField from "./components/CheckboxField";
import { FormField, Option } from "./types/wizardTypes";
import DateField from "./components/DateField";
import RateField from "./components/RateField";
import ChipsField from "./components/ChipsField";
import TextField from "./components/TextField";
import PhoneField from "./components/PhoneField";
import NegativeReview from "./components/NegativeReview";

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
  const [form] = Form.useForm();
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        handlePopupClose();
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const getFormData = (): FormField[] => {
    return clientType === "new"
      ? DefaultFormNew.newClient.steps[currentStep].questions
      : [];
  };

  const calculateProgress = (values: Record<string, any>) => {
    const formFields = getFormData();
    console.log("VALUES::: ", values);
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

    const stepPercentage = (currentStep / getStepsLength()) * 100;
    const filledFieldsPercentage =
      (filledFields.length / totalFields.length) * 100;
    const newProgress =
      stepPercentage + filledFieldsPercentage / getStepsLength();
    setProgress(newProgress);
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
    setResponses({ ...responses, [fieldId]: value });
    form.setFieldValue(fieldId, value);
    calculateProgress(form.getFieldsValue());
  };

  const isOptionSelected = (fieldId?: string, options?: Option[]): boolean =>
    options?.some((option) => option.id === responses[fieldId ?? ""]) ?? false;

  const isLastStep = currentStep === getStepsLength() - 1;

  const canOpenPositiveReview = () =>
    ["bueno", "excelente"].includes(form.getFieldValue("rateExperience")) &&
    isLastStep;
  const canOpenNegativeReview = () =>
    ["mal", "regular"].includes(form.getFieldValue("rateExperience")) &&
    isLastStep;

  const renderPopup = () => {
    if (!showPopup) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          ref={popupRef}
          className="!text-center bg-white p-6 rounded-xl border border-black border-opacity-60 shadow-lg max-w-md w-full"
        >
          <h2 className="text-blue-500 text-2xl font-bold mb-4">
            Selecciona una opción
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.values(popupOptions)[0].map((option) => (
              <button
                key={option.id}
                className={cn(
                  "border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-qik hover:border-qik transition",
                  {
                    "bg-qik text-white border-qik":
                      responses[Object.keys(popupOptions)[0]] == option.id,
                  }
                )}
                onClick={() => {
                  handleSelectOption(Object.keys(popupOptions)[0], option);
                  handlePopupClose();
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const inputPopup = () => {
    if (!showPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          ref={popupRef}
          className="!text-center bg-white p-6 rounded-xl border border-black border-opacity-60 shadow-lg max-w-md w-full"
        >
          <h2 className="text-blue-500 text-2xl font-bold mb-4">
            ¿Decribe la razón de visitarnos?
          </h2>
          <textarea
            className="w-full border-2 border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ej: En una reunión de amigos"
            rows={3}
          />
          <button
            className="mt-4 px-5 py-2 hover:bg-blue-800 focus:ring focus:ring-blue-200 bg-blue-600 text-white rounded-full"
            onClick={handlePopupClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    );
  };

  const renderClientTypeSelection = () => (
    <div className="text-center">
      <h1 className="text-primary font-bold md:text-2xl max-sm:text-2xl">
        ¿Eres cliente nuevo o frecuente?
      </h1>
      <p className="text-gray-600">
        Valoramos tu opinión 😃, te tomará menos de 1 minuto
      </p>
      <div className="flex mt-7 justify-center items-center">
        <button
          className="flex flex-col items-center mx-4"
          onClick={() => setClientType("new")}
        >
          <img
            src={true ? "/yellow-start.png" : "/gray-start.png"}
            alt="Nuevo"
            style={{ maxWidth: "180px" }}
          />
          <h1 className="text-gray-800 md:text-xl font-bold">Nuevo</h1>
        </button>
        <button
          className="flex flex-col items-center mx-4"
          onClick={() => setClientType("frequent")}
        >
          <img
            src={true ? "/red-heart.png" : "/gray-heart.png"}
            alt="Frecuente"
            style={{ maxWidth: "180px" }}
          />
          <h1 className="text-gray-800 md:text-xl font-bold">Frecuente</h1>
        </button>
      </div>
    </div>
  );

  const renderForm = () => (
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
          {getFormData().map((field) => renderFormField(field))}
          {canOpenPositiveReview() && <PositiveReview business={business} />}
          {canOpenNegativeReview() && <NegativeReview />}
        </div>

        <div className="flex justify-between gap-3 mt-10 mb-20 w-full">
          <button
            className="w-[20%] h-12 border border-gray-300 px-5 py-2 text-gray-900 hover:bg-gray-300 focus:ring focus:ring-blue-200 rounded-full bg-gray-100"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            Atrás
          </button>
          <button
            className="w-[80%] px-5 py-2 hover:bg-blue-800 focus:ring focus:ring-blue-200 bg-blue-600 text-white rounded-full"
            onClick={handleNextStep}
            disabled={currentStep === getStepsLength() - 1}
          >
            {isLastStep ? "ENVIAR A GOOGLE" : "Siguiente"}
          </button>
        </div>
      </Form>
    </div>
  );

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case "phone":
        return (
          <PhoneField
            field={field}
            value={responses[field.id!]}
            onChange={(checked) => handleOnFieldChange(field.id, checked)}
          />
        );
      case "checkbox":
        return (
          <CheckboxField
            field={field}
            value={responses[field.id!]}
            onChange={(checked) => handleOnFieldChange(field.id, checked)}
          />
        );
      case "date":
        return (
          <DateField
            field={field}
            value={responses[field.id!]}
            onChange={(value) => handleOnFieldChange(field.id, value)}
          />
        );
      case "chips":
        return (
          <ChipsField
            field={field}
            value={responses[field.id ?? ""]}
            onChange={(value) => handleOnFieldChange(field.id, value)}
          />
        );
      case "rate":
        return (
          <RateField
            field={field}
            value={responses[field.id ?? ""]}
            onChange={(value) => handleOnFieldChange(field.id, value)}
          />
        );
      default:
        return (
          <TextField
            field={field}
            value={responses[field.id ?? ""]}
            onChange={(value) => handleOnFieldChange(field.id, value)}
          />
        );
    }
  };

  return (
    <div className="mt-10 w-full flex justify-center px-4">
      {selectedOption === "reason" ? inputPopup() : renderPopup()}
      {!clientType ? renderClientTypeSelection() : renderForm()}
    </div>
  );
};

// {
//     "id": "frequentClient",
//     "title": "¿Qué te ha motivado a visitarnos esta vez?",
//     "type": "select-options",
//     "required": true,
//     "options": [
//         {
//             "id": "promo",
//             "label": "Vi una promo",
//             "title": "¿Dónde viste la promo?",
//             "options": [
//                 { "id": "instagram", "label": "Instagram" },
//                 { "id": "facebook", "label": "Facebook" },
//                 { "id": "youtube", "label": "Youtube" },
//                 { "id": "tiktok", "label": "Tiktok" },
//                 { "id": "google", "label": "Google" },
//                 { "id": "email", "label": "Email" },
//                 { "id": "whatsapp", "label": "WhatsApp" },
//                 { "id": "flyleaves", "label": "Hojas volantes" },
//                 { "id": "events", "label": "Eventos o ferias" },
//                 { "id": "alliances", "label": "Alianzas" },
//                 { "id": "tv", "label": "Radio o Tv" }
//             ]
//         },
//         { "id": "enjoy", "label": "Disfruto venir aquí" },
//         { "id": "maps", "label": "Google Maps" },
//         { "id": "recommended", "label": "Me recomendaron nuevamente" },
//         {
//             "id": "reason",
//             "label": "Otra razón",
//             "title": "¿Decribe la razón de visitarnos?",
//             "options": [
//                 { "id": "describe", "type": "text", "placeholder": "Ej: En una reunión de amigos" },
//                 { "id": "accept", "label": "Aceptar" }
//             ]
//         }
//     ]
// }
