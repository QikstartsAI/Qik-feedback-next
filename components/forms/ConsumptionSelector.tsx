"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  // Get consumption options based on country
  const consumptionOptions = getConsumptionOptions(countryCode);

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

// Helper function to get consumption options based on country
function getConsumptionOptions(countryCode: string) {
  const consumptionRanges: { [key: string]: Array<{ value: string; label: string }> } = {
    MX: [
      { value: "1-100", label: "$1-100" },
      { value: "100-200", label: "$100-200" },
      { value: "300-400", label: "$300-400" },
      { value: "400-500", label: "$400-500" },
      { value: "500+", label: "+$500" },
    ],
    US: [
      { value: "1-10", label: "$1-10" },
      { value: "10-20", label: "$10-20" },
      { value: "20-30", label: "$20-30" },
      { value: "30-50", label: "$30-50" },
      { value: "50+", label: "+$50" },
    ],
    ES: [
      { value: "1-10", label: "€1-10" },
      { value: "10-20", label: "€10-20" },
      { value: "20-30", label: "€20-30" },
      { value: "30-40", label: "€30-40" },
      { value: "40-50", label: "€40-50" },
      { value: "50+", label: "+€50" },
    ],
    FR: [
      { value: "1-10", label: "€1-10" },
      { value: "10-20", label: "€10-20" },
      { value: "20-30", label: "€20-30" },
      { value: "30-40", label: "€30-40" },
      { value: "40-50", label: "€40-50" },
      { value: "50+", label: "+€50" },
    ],
    IT: [
      { value: "1-10", label: "€1-10" },
      { value: "10-20", label: "€10-20" },
      { value: "20-30", label: "€20-30" },
      { value: "30-40", label: "€30-40" },
      { value: "40-50", label: "€40-50" },
      { value: "50+", label: "+€50" },
    ],
    CO: [
      { value: "1-10000", label: "$1-10.000" },
      { value: "10000-20000", label: "$10.000-20.000" },
      { value: "20000-30000", label: "$20.000-30.000" },
      { value: "30000-40000", label: "$30.000-40.000" },
      { value: "40000+", label: "+$40.000" },
    ],
    AR: [
      { value: "1-2000", label: "$1-2.000" },
      { value: "2000-4000", label: "$2.000-4.000" },
      { value: "4000-6000", label: "$4.000-6.000" },
      { value: "6000-8000", label: "$6.000-8.000" },
      { value: "8000+", label: "+$8.000" },
    ],
    CA: [
      { value: "1-10", label: "$1-10" },
      { value: "10-20", label: "$10-20" },
      { value: "20-30", label: "$20-30" },
      { value: "30-40", label: "$30-40" },
      { value: "40+", label: "+$40" },
    ],
    HK: [
      { value: "1-50", label: "$1-50" },
      { value: "50-100", label: "$50-100" },
      { value: "100-150", label: "$100-150" },
      { value: "150-200", label: "$150-200" },
      { value: "200-250", label: "$200-250" },
      { value: "250-300", label: "$250-300" },
      { value: "300+", label: "$300+" },
    ],
  };

  return consumptionRanges[countryCode] || consumptionRanges.MX;
}
