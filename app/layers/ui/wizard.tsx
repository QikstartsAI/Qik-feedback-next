import { useState } from 'react';
import DefaultFormNew from '../hooks/DefaultFormNew.json';


export const Wizard = () => {
  const [response, setResponse] = useState("");
  const sectionOne = DefaultFormNew.questions[0]["section-one"];

  return (
    <div>
      {!response ? (
        <div>
          <form id={DefaultFormNew.id} className="space-y-6 p-4">
            {/* Renderizar elementos que no son botones */}
            {sectionOne.map((field) => {
              // Generar clases dinámicamente
              const className = `${field.color || ""} ${field["font-size"] || ""} ${field.bolt || ""} ${field.centerText || ""} ${field["margin-top"] || ""}`;

              if (!field.type || field.type === "text") {
                return (
                  <h1 key={field.id} className={className}>
                    {field.label}
                  </h1>
                );
              }

              if (field.type === "paragraph") {
                return (
                  <p key={field.id} className={className}>
                    {field.label}
                  </p>
                );
              }

              return null; // Ignorar otros tipos aquí
            })}

            {/* Contenedor de botones con flex */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              {sectionOne.map((field) => {
                if (field.type === "button") {
                  // Establecer el estilo para la imagen
                  const imageStyle = field["font-img"] || {}; // Si existe "font-img", usa ese objeto, si no, usa un objeto vacío

                  return (
                    <div
                      key={field.id}
                      className={`${field["center-image"] || ""} flex items-center`}
                    >
                      <button
                        className={`${field.color || ""} ${field["font-size"] || ""} ${field.bolt || ""}`}
                      >
                        <img
                          src={field.url}
                          alt={field.label}
                          style={imageStyle} // Aplica el estilo directamente al componente de la imagen
                          className="mb-2"
                        />
                        {field.label}
                      </button>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </form>
        </div>
      ) : (
        <div>{/* Aquí puedes manejar la lógica cuando `response` tenga un valor */}</div>
      )}
    </div>
  );
};
