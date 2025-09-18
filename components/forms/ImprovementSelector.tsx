"use client";

import { Label } from "@/components/ui/label";
import { getFilteredImprovementOptions } from "@/lib/utils/phoneUtils";

interface ImprovementSelectorProps {
  selectedImprovements: string[];
  onImprovementSelect: (improvementId: string) => void;
  businessCategory?: string;
}

export function ImprovementSelector({
  selectedImprovements,
  onImprovementSelect,
  businessCategory = "",
}: ImprovementSelectorProps) {
  const filteredOptions = getFilteredImprovementOptions(businessCategory);
  
  return (
    <div>
      <Label className="text-sm font-bold text-gray-800 text-center block">
        ¿En qué debemos mejorar?
      </Label>
      <div className={`grid gap-2 mt-2 ${filteredOptions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {filteredOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onImprovementSelect(option.id)}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
              selectedImprovements.includes(option.id)
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <div className="text-2xl mb-1">{option.emoji}</div>
            <div className="text-xs font-semibold text-center">
              {option.label}
            </div>
          </button>
        ))}
      </div>
      {selectedImprovements.length === 0 && (
        <p className="text-red-500 text-xs mt-1">
          Selecciona al menos una opción
        </p>
      )}
    </div>
  );
}
