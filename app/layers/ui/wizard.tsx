import { useState } from "react";
import DefaultFormNew from "../hooks/DefaultFormNew.json";
import { IconChevronCompactRight, IconChevronCompactLeft } from "@tabler/icons-react";

import { Form, Progress, Flex } from "antd"

interface FormField {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  centerText?: string;
  ischecked?: boolean;
  max?: string;
  text?: string;
  options?: { opt1: string; opt2: string; opt3: string; opt4: string; opt5: string }[];
  errorMessages?: string[];
}

//estados pop up


export const Wizard = () => {
  const [response, setResponse] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showOtherPopup, setShowOtherPopup] = useState(false);

  const getFormData = (): FormField[] => {
    if (page === 1) return DefaultFormNew["form-one"][0]["Section-form-one"];
    if (page === 2) return DefaultFormNew["form-second-page"][0]["Section-form-one"];
    return [];
  };

  const progreeBar = () => {
    if (page === 1) return 33;
    if (page === 2) return 66;
    return 0;
  }

  const [form] = Form.useForm();

  const formOne: FormField[] = getFormData();

  return (

    <div className="mt-10 w-full flex justify-center px-4">

      {!response ? (
        <div className="text-center">
          <h1 className="text-primary font-bold md:text-2xl max-sm:text-2xl">
            ¿Eres cliente nuevo o frecuente?
          </h1>
          <p className="text-gray-600">
            Valoramos tu opinión 😃, te tomará menos de 1 minuto
          </p>

          <div className="flex mt-7 justify-center items-center">
            <button className="flex flex-col items-center mx-4" onClick={() => setResponse("nuevo")}>
              <img src="/yellow-start.png" alt="Nuevo" style={{ maxWidth: "180px" }} />
              <h1 className="text-gray-800 md:text-xl font-bold">Nuevo</h1>
            </button>

            <button className="flex flex-col items-center mx-4" onClick={() => setResponse("frecuente")}>
              <img src="/gray-heart.png" alt="Frecuente" style={{ maxWidth: "180px" }} />
              <h1 className="text-gray-800 md:text-xl font-bold">Frecuente</h1>
            </button>
          </div>
        </div>
      ) : (
        <Form autoComplete="on" form={form} name="validateOnly">

          <Flex>
            <Progress
              strokeLinecap="round"
              status="active"
              percent={progreeBar()}
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
                    {/*Email field*/}
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
                    {/*Name field*/}
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
                    {/*Phone field*/}
                    {field.id === "askphonenumber" && (

                      <div className="relative">
                        <span className="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-600 rounded-full z-10">
                          {field.label?.replace("(opcional)", "").trim()}
                        </span>
                        <Form.Item
                          name="phone"
                          rules={[
                            { required: true, message: "Porfavor Ingrese su telefono" },
                            { type: "number", message: "El numero de telefono no es valido" },
                          ]}
                        >
                          <input
                            type={field.type}
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
                          {field.label?.replace("(opcional)", "").replace("🎂", "").trim()}
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
                  </div>
                ))}

                <p className="text-sm text-gray-600">
                  Te sorprenderemos ese día<span role="img" aria-label="emoji">😎</span>
                </p>

                {/* Sección de botones: ¿Cómo nos conociste? */}
                <div className="mt-8 text-center">
                  <h2 className="text-blue-500 text-2xl font-bold">
                    ¿Cómo nos conociste?
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                      Google Maps
                    </button>
                    <button
                      className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200"
                      onClick={() => setShowPopup(true)}
                    >
                      Redes Sociales
                    </button>
                    <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                      WhatsApp
                    </button>
                    <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                      Referido
                    </button>
                    <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                      Pase por el local
                    </button>
                    <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                      Vivo cerca
                    </button>
                    <button
                      className="border border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200"
                      onClick={() => setShowOtherPopup(true)}
                    >
                      Otro
                    </button>
                  </div>
                </div>

                {/* Popup Redes sociales */}
                {showPopup && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className=" !text-center bg-white p-6 rounded-xl border border-black border-opacity-60 shadow-lg max-w-md w-full">
                      <h2 className="text-blue-500 text-2xl font-bold mb-4">
                        ¿Dónde viste la promo?
                      </h2>
                      <div className="flex flex-wrap justify-center gap-4">
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          Instagram
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          Facebook
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          YouTube
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          TikTok
                        </button>
                      </div>
                      <button
                        onClick={() => setShowPopup(false)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}

                {/* Popup Otro */}
                {showOtherPopup && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="!text-center bg-white p-6 rounded-xl border border-black border-opacity-60 shadow-lg max-w-md w-full">
                      <h2 className="text-blue-500 text-2xl font-bold mb-4">
                        ¿Dónde viste la promo?
                      </h2>
                      <div className="flex flex-wrap justify-center gap-4">
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          Flyers
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          Eventos
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          Email
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          TV
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          Radio
                        </button>
                        <button className="border border-gray-300 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                          Valla
                        </button>
                      </div>
                      <button
                        onClick={() => setShowOtherPopup(false)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}

              </>
            ) : (
              <div className="text-center">
                {DefaultFormNew["form-second-page"][0]["Section-form-one"].map((field) => (
                  <div key={field.id} className="mb-6">
                    <h2 className="text-blue-500 text-2xl font-bold">
                      {field.text}
                    </h2>
                    <div className="flex justify-center mt-4">
                      {field.options?.map((opt, index) => (
                        <div key={index} className="mx-2">
                          {["opt1", "opt2", "opt3", "opt4", "opt5"].map((key) => (

                            <button
                              key={key}
                              className="border rounded-lg mr-4 border-gray-400 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200"
                              onClick={() => setResponse(opt[key as keyof typeof opt])}
                            >
                              {opt[key as keyof typeof opt]}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {DefaultFormNew["form-second-page"][0]["Section-form-two"].map((field) => (
                  <div key={field.id} className=" mt-8">
                    <h2 className="text-blue-500 text-2xl font-bold">
                      {field.text}
                    </h2>
                    <div className="flex justify-center mt-4">
                      {field.options?.map((opt, index) => (
                        <div key={index} className="mx-2">
                          {["opt1", "opt2", "opt3", "opt4", "opt5", "opt6"].map((key) => (
                            <button
                              key={key}
                              className="border mr-4 border-gray-400 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200"
                              onClick={() => setResponse(opt[key as keyof typeof opt])}
                            >
                              {opt[key as keyof typeof opt]}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {DefaultFormNew["form-second-page"][0]["Setion-form-three"].map((field) => (
                  <div key={field.id} className="mt-8">
                    <h2 className="text-blue-500 text-2xl font-bold text-center">
                      {field.text}
                    </h2>

                    {/* Contenedor principal: Alinea los elementos en fila */}
                    <div className="flex justify-center gap-6 mt-4">
                      {field.options?.map((bt, index) => (
                        /* Cada opción es una columna (botón arriba, texto abajo) */
                        <div key={index} className="flex flex-col items-center">
                          {/* Botón con imagen */}
                          <button className="border rounded-lg border-gray-400  text-gray-700 hover:bg-gray-100 focus:ring focus:ring-blue-200">
                            <img
                              src={bt.buttonImageUrl}
                              className="w-20  object-contain"
                              alt={bt.text}
                            />
                          </button>

                          {/* Texto debajo del botón */}
                          <p className="mt-2 text-center text-gray-800">{bt.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

              </div>

            )}
            {response && (
              <div className="!text-center mt-10 mb-20">
                {page > 1 && (
                  <button
                    className="border border-gray-300 px-5 py-2 text-gray-900 hover:bg-gray-300 focus:ring focus:ring-blue-200 mr-5 rounded-full bg-gray-100"
                    onClick={() => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage))}
                  >
                    Atrás
                  </button>
                )}

                <button className=" px-5 py-2 hover:bg-blue-800 focus:ring focus:ring-blue-200 bg-blue-600 text-white rounded-full "
                  onClick={() => setPage((prevPage) => (prevPage < 2 ? prevPage + 1 : prevPage))}
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
