"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { referralSources, socialMediaOptions } from "@/lib/utils/phoneUtils";

interface ReferralSourceSelectorProps {
  selectedSource: string;
  socialMediaSource: string;
  otherSource: string;
  onSourceSelect: (sourceId: string) => void;
  onSocialMediaSelect: (socialMediaId: string) => void;
  onOtherSourceChange: (value: string) => void;
  hasError?: boolean;
}

export function ReferralSourceSelector({
  selectedSource,
  socialMediaSource,
  otherSource,
  onSourceSelect,
  onSocialMediaSelect,
  onOtherSourceChange,
  hasError = false,
}: ReferralSourceSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className={`text-sm font-semibold ${hasError ? 'text-red-600' : 'text-gray-800'}`}>
          ¿De dónde nos conoces?
        </Label>
        <div className={`grid grid-cols-2 gap-2 mt-2 ${hasError ? 'ring-2 ring-red-200 rounded-lg p-2 bg-red-50' : ''}`}>
          {referralSources.map((source) => (
            <button
              key={source.id}
              onClick={() => onSourceSelect(source.id)}
              className={`p-3 text-center rounded-lg border-2 transition-all text-xs font-medium ${
                selectedSource === source.id
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : hasError
                  ? "border-red-300 bg-white text-gray-700 hover:border-red-400 hover:bg-red-50"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              {source.label}
            </button>
          ))}
        </div>
        {hasError && (
          <p className="text-red-500 text-xs mt-2">
            Selecciona una opción para continuar
          </p>
        )}
      </div>

      {/* Conditional Social Media Selection */}
      {selectedSource === "social_media" && (
        <div className="mt-4">
          <Label className="text-sm font-semibold text-gray-800">
            ¿Cuál red social?
          </Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {socialMediaOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onSocialMediaSelect(option.id)}
                className={`p-3 text-center rounded-lg border-2 transition-all text-xs font-medium ${
                  socialMediaSource === option.id
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conditional Other Text Input */}
      {selectedSource === "other" && (
        <div className="mt-4">
          <Label className="text-sm font-semibold text-gray-800">
            ¿Dónde nos conociste?
          </Label>
          <Input
            placeholder="Ejemplo: 'Los vi en una feria…'"
            value={otherSource}
            onChange={(e) => onOtherSourceChange(e.target.value)}
            maxLength={100}
            className={`mt-2 ${selectedSource === "other" && !otherSource.trim() ? 'border-red-500' : ''}`}
          />
          {selectedSource === "other" && !otherSource.trim() && (
            <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
          )}
        </div>
      )}
    </div>
  );
}
