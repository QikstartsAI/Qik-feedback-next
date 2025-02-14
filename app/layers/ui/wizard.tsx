import { useState, useEffect } from "react";
import DefaultFormNew from "../hooks/DefaultFormNew.json";
import { Form, Progress, Flex, Button } from "antd";
import { cn } from "@/app/lib/utils";

interface Option {
  id?: string;
  label?: string;
  text?: string;
  popupTitle?: string;
  buttonImageUrl?: string;
  options?: { id?: string; label?: string; options?: Option[] }[];
}

interface FormField {
  id?: string;
  label?: string;
  type?: string;
  title?: string;
  ischecked?: boolean;
  placeholder?: string;
  required?: boolean;
  max?: string;
  text?: string;
  options?: Option[];
}

export const Wizard = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [popupOptions, setPopupOptions] = useState<Option[]>([]);

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [clientType, setClientType] = useState("");

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [form] = Form.useForm();

  const getFormData = (): FormField[] => {
    if (clientType === "new") {
      return DefaultFormNew.newClient.steps[currentStep].questions;
    }
    return [];
  };
  const calculateProgress = (values: Record<string, any>) => {
    const formFields = getFormData();
    console.log("formFields::", values);
    setResponses({ ...responses, ...values });
    const totalFields = formFields.filter((field) => field.required);
    const filledFields = totalFields.filter((field) => {
      if (!field.id) return false;
      const isValid =
        field?.required &&
        !form.getFieldError(field.id)[0] &&
        values[field.id] &&
        values[field.id].length > 1;
      return isValid;
    });

    Object.keys(values).filter((key: string) => {
      const field = formFields.find((f) => f.id === key);
      const isValid =
        field?.required &&
        !form.getFieldError(key)[0] &&
        values[key] &&
        values[key].length > 1;
      return isValid;
    }).length;
    const newProgress =
      ((filledFields.length / totalFields.length) * 100) / getStepsLength();
    setProgress(newProgress);
  };

  const formOne: FormField[] = getFormData();

  const handleNextStep = () => {
    const formFields = getFormData();
    const requiredFields = formFields.filter((field) => field.required);
    console.log("requiredFields::::", requiredFields);
    const allFieldsVerified = requiredFields.every((field) => {
      const value = responses[field.id!];
      return value;
    });

    if (
      allFieldsVerified &&
      currentStep <
        DefaultFormNew[clientType === "new" ? "newClient" : "frequentClient"]
          .steps.length -
          1
    ) {
      setCurrentStep(currentStep + 1);
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

  const handleOptionClick = (option: Option) => {
    if (option.options) {
      setPopupOptions(option.options);
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
    setPopupOptions([]);
    setSelectedOption(null);
  };

  const handleSelectOption = (fieldId?: string, option?: Option) => {
    if (!fieldId || !option) return;
    setResponses({ ...responses, [fieldId]: option.id });
    form.setFieldValue(fieldId, option.id);
    calculateProgress(form.getFieldsValue());
  };

  const handleOnFieldChange = (fieldId?: string, value?: any) => {
    if (!fieldId || value == undefined) return;
    console.log("fieldId::::", fieldId, value);
    setResponses({ ...responses, [fieldId]: value });
    form.setFieldValue(fieldId, value);
    calculateProgress(form.getFieldsValue());
  };

  const renderPopup = () => {
    if (!showPopup) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="!text-center bg-white p-6 rounded-xl border border-black border-opacity-60 shadow-lg max-w-md w-full">
          <h2 className="text-blue-500 text-2xl font-bold mb-4">
            Selecciona una opción
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {popupOptions.map((option) => (
              <button
                key={option.id}
                className="border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200"
                onClick={() => {
                  setSelectedOption(option.id || null);
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
        <div className="!text-center bg-white p-6 rounded-xl border border-black border-opacity-60 shadow-lg max-w-md w-full">
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
    <Form
      autoComplete="on"
      form={form}
      name="validateOnly"
      className="max-w-lg"
      onValuesChange={(_, values) => calculateProgress(values)}
    >
      <Flex className="mb-5">
        <Progress
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
      </Flex>

      <div className="flex flex-col gap-3 mt-5 w-full">
        {formOne.map((field) => renderFormField(field))}
      </div>

      <div className="text-center mt-10 mb-20">
        <button
          className="border border-gray-300 px-5 py-2 text-gray-900 hover:bg-gray-300 focus:ring focus:ring-blue-200 mr-5 rounded-full bg-gray-100"
          onClick={handlePrevStep}
          disabled={currentStep === 0}
        >
          Atrás
        </button>
        <button
          className="px-5 py-2 hover:bg-blue-800 focus:ring focus:ring-blue-200 bg-blue-600 text-white rounded-full"
          onClick={handleNextStep}
          disabled={currentStep === getStepsLength() - 1}
        >
          Siguiente
        </button>
      </div>
    </Form>
  );

  const renderFormField = (field: FormField) => {
    switch (field.type) {
      case "email":
        return renderEmailField(field);
      case "text":
        return renderTextField(field);
      case "phone":
        return renderPhoneNumberField(field);
      case "checkbox":
        return renderCheckboxField(field);
      case "date":
        return renderDateField(field);
      case "chips":
        return rendeChipsFields(field);
    }
  };

  const rendeChipsFields = (field: FormField) => (
    <div className="mt-4 flex flex-col">
      <span className="font-bold text-[24px] text-center text-qik">
        {field.title?.trim()}
      </span>
      <Form.Item
        name={field.id}
        rules={[{ required: field.required, message: "Selecciona una opción" }]}
      >
        <div className="mt-4 flex gap-3 justify-center items-center flex-wrap">
          {field.options?.map((option) => (
            <button
              key={option.id}
              className={cn(
                "border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-qik hover:border-qik transition",
                {
                  "bg-qik text-white border-qik":
                    responses[field.id ?? ""] == option.id,
                }
              )}
              onClick={() => handleSelectOption(field.id, option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Form.Item>
    </div>
  );

  const renderEmailField = (field: FormField) => (
    <div className="relative">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {field.label?.trim()}
      </span>
      <Form.Item
        name={field.id}
        rules={[
          { required: true, message: "Porfavor Ingrese su email" },
          { type: "email", message: "Email no valido" },
        ]}
        required={field.required || undefined}
      >
        <input
          type="text"
          id={field.id || undefined}
          placeholder={field.placeholder || undefined}
          required={field.required || undefined}
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </Form.Item>
    </div>
  );

  const renderTextField = (field: FormField) => (
    <div className="relative">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {field.label?.trim()}
      </span>
      <Form.Item
        name={field.id}
        rules={[
          { required: field.required, message: "Ingresa tu nombre" },
          { type: "string", message: "Nombre no valido" },
        ]}
      >
        <input
          type="text"
          id={field.id || undefined}
          placeholder={field.placeholder || undefined}
          required={field.required || undefined}
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </Form.Item>
    </div>
  );

  const renderPhoneNumberField = (field: FormField) => (
    <div className="relative">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {field.label?.trim()}
      </span>
      <Form.Item
        name={field.id}
        rules={[
          {
            required: field.required,
            message: "Por favor ingrese su teléfono",
          },
          {
            pattern: /^[0-9]+$/,
            message: "El número de teléfono no es válido",
          },
        ]}
      >
        <input
          type="number"
          id={field.id || undefined}
          placeholder={field.placeholder || undefined}
          required={field.required || undefined}
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        />
      </Form.Item>
      {renderCheckboxField({ id: "checkWhatsApp" })}
    </div>
  );

  const renderDateField = (field: FormField) => (
    <div className="relative">
      <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
        {field.label?.trim()}
      </span>
      <Form.Item name={field.id}>
        <input
          type="date"
          id={field.id || undefined}
          placeholder={field.placeholder || undefined}
          required={field.required || undefined}
          className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </Form.Item>
    </div>
  );

  const renderCheckboxField = (field: FormField) => (
    <Form.Item
      name={field.id}
      rules={[
        { required: field.required, message: "Debes seleccionar esta opción" },
      ]}
      className="-mt-5"
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          id={field.id || undefined}
          required={field.required || undefined}
          checked={responses[field.id!]}
          onChange={(e) => handleOnFieldChange(field.id, e.target.checked)}
          className="w-5 h-5 text-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-blue-400"
        />
        <label
          htmlFor={field.id || undefined}
          className="ml-3 text-gray-700 font-medium"
        >
          Acepto recibir promociones por
          <span className="text-green-500"> WhatsApp</span>
        </label>
      </div>
    </Form.Item>
  );

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
