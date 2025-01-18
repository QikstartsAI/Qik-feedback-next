import { useState } from "react";
import DefaultFormNew from "../hooks/DefaultFormNew.json";

export const Wizard = () => {
  const [response, setResponse] = useState("");

  // Obtener datos del formulario desde el JSON
  const formOne = DefaultFormNew["form-one"][0]["Section-form-one"];

  return (
    <div className="mt-10 max-w-lg mx-auto">
      {!response ? (
        <div className="text-center">
          <h1 className="text-primary font-bold md:text-2xl max-sm:text-2xl">
            ¿Eres cliente nuevo o frecuente?
          </h1>
          <p className="text-gray-600">
            Valoramos tu opinión 😃, te tomará menos de 1 minuto
          </p>

          <div className="flex mt-7 justify-center items-center">
            {/* Botón para cliente nuevo */}
            <button
              className="flex flex-col items-center mx-4"
              onClick={() => setResponse("nuevo")}
            >
              <img src="/yellow-start.png" alt="Nuevo" style={{ maxWidth: "180px" }} />
              <h1 className="text-gray-800 md:text-xl font-bold">Nuevo</h1>
            </button>

            {/* Botón para cliente frecuente */}
            <button
              className="flex flex-col items-center mx-4"
              onClick={() => setResponse("frecuente")}
            >
              <img src="/gray-heart.png" alt="Frecuente" style={{ maxWidth: "180px" }} />
              <h1 className="text-gray-800 md:text-xl font-bold">Frecuente</h1>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-left">
          {/* Renderizar formulario dinámico */}
          {formOne.map((field) => (
            <div key={field.id} className="mb-6">
              {field.type === "textbox" && (
                <div className="relative">
                  {/* Etiqueta con bordes redondeados */}
                  <span className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 rounded-full">
                    {field.label.replace("(opcional)", "").trim()}
                  </span>
                  <input
                    type="text"
                    id={field.id}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full border border-gray-400 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
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
                  <label
                    htmlFor={field.id}
                    className="ml-3 text-gray-800 font-medium"
                  >
                    {field.label.replace(
                      "WhatsApp",
                      ""
                    )}
                    <span className="text-green-500"> WhatsApp</span>
                  </label>
                </div>
              )}
              {field.type === "date" && (
                <div className="relative">
                  {/* Etiqueta con bordes redondeados */}
                  <span className="absolute -top-2 left-3 bg-white px-2 text-sm text-gray-600 rounded-full">
                    {field.label.replace("(opcional)", "").replace("🎂", "").trim()}
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

          {/* Mensaje debajo del último campo obligatorio */}
          <p className="text-sm text-gray-600">
            Te sorprenderemos ese día<span role="img" aria-label="emoji">😎</span>
          </p>
        </div>
      )}
    </div>
  );
};
