"use client";

import { Label } from "@/components/ui/label";
import { improvementOptions } from "@/lib/utils/phoneUtils";

interface ImprovementSelectorProps {
  selectedImprovements: string[];
  onImprovementSelect: (improvementId: string) => void;
}

export function ImprovementSelector({
  selectedImprovements,
  onImprovementSelect,
}: ImprovementSelectorProps) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">
        ¿Qué podemos mejorar?
      </Label>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {improvementOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onImprovementSelect(option.id)}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
              selectedImprovements.includes(option.id)
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">{option.emoji}</div>
            <div className="text-xs font-medium text-center">
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
