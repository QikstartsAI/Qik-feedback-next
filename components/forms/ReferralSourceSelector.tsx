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
}

export function ReferralSourceSelector({
  selectedSource,
  socialMediaSource,
  otherSource,
  onSourceSelect,
  onSocialMediaSelect,
  onOtherSourceChange,
}: ReferralSourceSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700">
          ¿De dónde nos conoces?
        </Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {referralSources.map((source) => (
            <button
              key={source.id}
              onClick={() => onSourceSelect(source.id)}
              className={`p-2 text-center rounded-lg border transition-all text-xs ${
                selectedSource === source.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {source.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Social Media Selection */}
      {selectedSource === "social_media" && (
        <div className="mt-4">
          <Label className="text-sm font-medium text-gray-700">
            ¿Cuál red social?
          </Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {socialMediaOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onSocialMediaSelect(option.id)}
                className={`p-2 text-center rounded-lg border transition-all text-xs ${
                  socialMediaSource === option.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
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
          <Label className="text-sm font-medium text-gray-700">
            ¿Dónde nos conociste?
          </Label>
          <Input
            placeholder="¿Dónde nos conociste?"
            value={otherSource}
            onChange={(e) => onOtherSourceChange(e.target.value)}
            maxLength={100}
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
}
