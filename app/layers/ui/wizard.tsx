import { useState, useEffect } from "react";
import DefaultFormNew from "../hooks/DefaultFormNew.json";
import { Form, Progress, Flex } from "antd";

interface Option {
  id: string;
  label?: string;
  text?: string;
  popupTitle?: string;
  buttonImageUrl?: string;
  subOptions?: { id: string; label: string }[];
}

interface FormField {
  id: string;
  label?: string;
  type?: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  ischecked?: boolean;
  max?: string;
  text?: string;
  options?: Option[]
  titles?: {
    main: string;
    secondary?: string;
  };
}

export const Wizard = () => {
  const [response, setResponse] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupOptions, setPopupOptions] = useState<Option[]>([]);
  const [isFrequentCustomer, setIsFrequentCustomer] = useState(false);
  const [progress, setProgress] = useState(0);

  const getFormData = (): FormField[] => {
    if (page === 1) return DefaultFormNew.steps[0].questions;
    if (page === 2) return DefaultFormNew.steps[1].questions;
    return [];
  };

  const calculateProgress = (values: any) => {
    const formFields = getFormData();
    const totalFields = formFields.filter(field => field.required).length;
    const filledFields = Object.keys(values).filter(key => values[key]).length;
    const newProgress = (filledFields / totalFields) * 100;
    setProgress(newProgress);
  };

  const [form] = Form.useForm();
  const formOne: FormField[] = getFormData();

  const mapOptions = (options: Option[]) => {
    return options.map((option) => (
      <button
        key={option.id}
        className="border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200"
        onClick={() => {
          if (option.subOptions) {
            setPopupOptions(option.subOptions);
            setShowPopup(true);
          } else if (option.id === "reason") {
            setSelectedOption("reason");
            setShowPopup(true);
          } else {
            setSelectedOption(option.id);
          }
        }}
      >
        {option.label}
      </button>
    ));
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setPopupOptions([]);
    setSelectedOption(null);
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
                  setSelectedOption(option.id);
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

  const handleClick = (type: string) => {
    setActive(type);
    setTimeout(() => {
      setResponse(type);
      setIsFrequentCustomer(type === "frecuente");
    }, 500);
  };

  return (
    <div className="mt-10 w-full flex justify-center px-4">

      {selectedOption === "reason" ? inputPopup() : renderPopup()}

      {!response ? (
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
              onMouseEnter={() => setActive("nuevo")}
              onMouseLeave={() => setActive(null)}
              onClick={() => handleClick("nuevo")}
            >
              <img
                src={active === "nuevo" ? "/yellow-start.png" : "/gray-start.png"}
                alt="Nuevo"
                style={{ maxWidth: "180px" }}
              />
              <h1 className="text-gray-800 md:text-xl font-bold">Nuevo</h1>
            </button>

            <button
              className="flex flex-col items-center mx-4"
              onMouseEnter={() => setActive("frecuente")}
              onMouseLeave={() => setActive(null)}
              onClick={() => handleClick("frecuente")}
            >
              <img
                src={active === "frecuente" ? "/red-heart.png" : "/gray-heart.png"}
                alt="Frecuente"
                style={{ maxWidth: "180px" }}
              />
              <h1 className="text-gray-800 md:text-xl font-bold">Frecuente</h1>
            </button>
          </div>
        </div>
      ) : (
        <Form autoComplete="on" form={form} name="validateOnly" onValuesChange={(_, values) => calculateProgress(values)}>
          <Flex>
            <Progress
              strokeLinecap="round"
              status="active"
              percent={progress}
              strokeWidth={35}
              strokeColor="#2B82F6"
              percentPosition={{ align: 'end', type: 'inner' }}
              format={(percent) => (
                <span style={{ fontWeight: 'bold', fontSize: '17px' }}>{percent}%</span>
              )}
            />
          </Flex>

          <div className="text-left mt-12">
            {page === 1 ? (
              <>
                {formOne.map((field) => (
                  <div key={field.id} className="mb-6">
                    {field.id === "emailfield" && (
                      <div className="relative mb-10">
                        <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
                          {field.label?.replace("(opcional)", "").trim()}
                        </span>
                        <Form.Item
                          name="email"
                          rules={[
                            { required: true, message: "Porfavor Ingrese su email" },
                            { type: "email", message: "Email no valido" },
                          ]}
                        >
                          <input
                            type="text"
                            id={field.id}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </Form.Item>
                      </div>
                    )}
                    {field.id === "namefield" && (
                      <div className="relative mb-10">
                        <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
                          {field.label?.replace("(opcional)", "").trim()}
                        </span>
                        <Form.Item
                          name="name"
                          rules={[
                            { required: true, message: "Ingresa tu nombre" },
                            { type: "string", message: "Email no valido" },
                          ]}
                        >
                          <input
                            type="text"
                            id={field.id}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </Form.Item>
                      </div>
                    )}
                    {field.id === "askphonenumber" && (
                      <div className="relative">
                        <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
                          {field.label?.replace("(opcional)", "").trim()}
                        </span>
                        <Form.Item
                          name="phone"
                          rules={[
                            { required: false, message: "Por favor ingrese su teléfono" },
                            { pattern: /^[0-9]+$/, message: "El número de teléfono no es válido" },
                          ]}
                        >
                          <input
                            type="text"
                            id={field.id}
                            placeholder={field.placeholder}
                            required={field.required}
                            className="relative w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </Form.Item>
                      </div>
                    )}
                    {field.type === "checkbox" && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={field.id}
                          defaultChecked={field.ischecked}
                          required={field.required}
                          className="w-5 h-5 text-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-blue-400"
                        />
                        <label htmlFor={field.id} className="ml-3 text-gray-700 font-medium">
                          {field.label?.replace("WhatsApp", "")}
                          <span className="text-green-500"> WhatsApp</span>
                        </label>
                      </div>
                    )}
                    {field.type === "date" && (
                      <div className="relative">
                        <span className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 rounded-full">
                          {field.label}
                        </span>
                        <input
                          type="date"
                          id={field.id}
                          placeholder={field.placeholder}
                          max={field.max}
                          required={field.required}
                          className="w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    )}
                    {field.id === "suprise" && (
                      <p className="text-sm text-gray-600">
                        {field.label}
                      </p>
                    )}

                    {isFrequentCustomer ? (
                      field.id === "frequentClient" && (
                        <div className="mt-8 text-center">
                          <h2 className="text-blue-500 text-2xl font-bold">
                            {field.title}
                          </h2>
                          <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {mapOptions(field.options || [])}
                          </div>

                        </div>
                      )
                    ) : (
                      field.id === "socialmedia" && (
                        <div className="mt-8 text-center">
                          <h2 className="text-blue-500 text-2xl font-bold">
                            {field.title}
                          </h2>
                          <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {mapOptions(field.options || [])}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </>
            ) : (
              // Página 2
              <div className="text-center">
                {formOne.map((field) => (
                  <div key={field.id}>
                    <h2 className="text-blue-500 text-2xl font-bold">{field.titles?.main}</h2>
                    <p className="text-base  text-gray-600">{field.text}</p>
                    <h2 className="text-blue-500 text-2xl font-bold">{field.titles?.secondary}</h2>
                  </div>
                ))}
              </div>
            )}
            {response && (
              <div className="!text-center mt-10 mb-20">
                <button
                  className="border border-gray-300 px-5 py-2 text-gray-900 hover:bg-gray-300 focus:ring focus:ring-blue-200 mr-5 rounded-full bg-gray-100"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  Atrás
                </button>

                <button
                  className="px-5 py-2 hover:bg-blue-800 focus:ring focus:ring-blue-200 bg-blue-600 text-white rounded-full"
                  onClick={() => setPage(2)}
                  disabled={page === 2}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </Form>
      )}
    </div>
  );
};