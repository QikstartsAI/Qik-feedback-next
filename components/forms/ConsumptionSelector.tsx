"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useConsumptionRanges } from "@/hooks/useConsumptionRanges";

interface ConsumptionSelectorProps {
  selectedConsumption: string;
  onConsumptionSelect: (consumption: string) => void;
  countryCode?: string;
}

export function ConsumptionSelector({
  selectedConsumption,
  onConsumptionSelect,
  countryCode = "MX",
}: ConsumptionSelectorProps) {
  const { getConsumptionOptions, loading, error } = useConsumptionRanges();
  
  // Get consumption options based on country
  const consumptionOptions = getConsumptionOptions(countryCode);

  if (loading) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          ¿Cuánto gastaste hoy por persona?
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          ¿Cuánto gastaste hoy por persona?
        </Label>
        <div className="text-sm text-red-600">
          Error cargando rangos de consumo. Usando valores por defecto.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        ¿Cuánto gastaste hoy por persona?
      </Label>
      <RadioGroup
        value={selectedConsumption}
        onValueChange={onConsumptionSelect}
        className="grid grid-cols-2 gap-3"
      >
        {consumptionOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label
              htmlFor={option.value}
              className="text-sm text-gray-600 cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

