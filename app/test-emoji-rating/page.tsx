"use client";

import { useState } from "react";
import { RatingRadioGroup, SimpleRatingGroup } from "@/app/components/form";
import { Ratings } from "@/lib/domain/entities";

export default function TestEmojiRatingPage() {
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedSimpleRating, setSelectedSimpleRating] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("default");

  const countries = [
    { value: "default", label: "Default (Spanish)" },
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "FR", label: "France" },
    { value: "IT", label: "Italy" },
  ];

  const getRatingLabel = (value: string) => {
    switch (value) {
      case Ratings.Mal:
        return "Mal (Bad)";
      case Ratings.Regular:
        return "Regular (Fair)";
      case Ratings.Bien:
        return "Bien (Good)";
      case Ratings.Excelente:
        return "Excelente (Excellent)";
      default:
        return "No seleccionado";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Test de Componentes de Emoji Rating
        </h1>

        {/* Country Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar País/Idioma:
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            {countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* RatingRadioGroup Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            RatingRadioGroup (Con Etiquetas Multiidioma)
          </h2>
          <p className="text-gray-600 mb-4">
            Componente principal con emojis pequeños y etiquetas de texto que cambian según el país seleccionado.
          </p>
          
          <RatingRadioGroup
            value={selectedRating}
            onChange={setSelectedRating}
            country={selectedCountry as any}
            className="mb-4"
          />
          
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Valor seleccionado:</strong> {getRatingLabel(selectedRating)}
            </p>
          </div>
        </div>

        {/* SimpleRatingGroup Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            SimpleRatingGroup (Versión Simple)
          </h2>
          <p className="text-gray-600 mb-4">
            Componente simple con emojis grandes, sin etiquetas de texto. Ideal para formularios minimalistas.
          </p>
          
          <SimpleRatingGroup
            value={selectedSimpleRating}
            onChange={setSelectedSimpleRating}
            className="mb-4"
          />
          
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Valor seleccionado:</strong> {getRatingLabel(selectedSimpleRating)}
            </p>
          </div>
        </div>

        {/* Implementation Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Detalles de Implementación
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold">Características Implementadas:</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>✅ Enum Ratings con valores "1", "2", "4", "5"</li>
                <li>✅ Soporte multiidioma (US, CA, FR, IT, Default)</li>
                <li>✅ Imágenes SVG optimizadas</li>
                <li>✅ Diseño responsive (móvil: 32x32px, desktop: 40x40px)</li>
                <li>✅ Efectos de hover y selección</li>
                <li>✅ Transiciones suaves</li>
                <li>✅ Opacidad para elementos no seleccionados</li>
                <li>✅ Grid layout de 4 columnas</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold">Archivos Creados:</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><code>lib/domain/entities.ts</code> - Enum Ratings agregado</li>
                <li><code>app/components/form/RatingRadioGroup.tsx</code> - Componente principal</li>
                <li><code>app/components/form/SimpleRatingGroup.tsx</code> - Componente simple</li>
                <li><code>app/components/form/index.ts</code> - Exports</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Imágenes Utilizadas:</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><code>/experiencebad.svg</code> - Cara triste (calificación mala)</li>
                <li><code>/experienceregular.svg</code> - Cara neutral (calificación regular)</li>
                <li><code>/experiencegood.svg</code> - Cara contenta (calificación buena)</li>
                <li><code>/experienceexelent.svg</code> - Cara muy feliz (calificación excelente)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
