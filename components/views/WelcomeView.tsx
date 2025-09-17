"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { ReferralSourceSelector } from "@/components/forms/ReferralSourceSelector";
import { ConsumptionSelector } from "@/components/forms/ConsumptionSelector";

interface WelcomeViewProps {
  // Form state
  firstName: string;
  lastName: string;
  phone: string;
  phoneError: string;
  acceptPromotions: boolean;
  referralSource: string;
  socialMediaSource: string;
  otherSource: string;
  selectedCountryCode: string;
  averageTicket: string;

  // Form handlers
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCountryCodeChange: (code: string) => void;
  onAcceptPromotionsChange: (checked: boolean) => void;
  onReferralSourceSelect: (sourceId: string) => void;
  onSocialMediaSelect: (socialMediaId: string) => void;
  onOtherSourceChange: (value: string) => void;
  onAverageTicketSelect: (ticket: string) => void;
  onContinue: () => void;

  // Validation
  canContinue: boolean;
  referralSourceError?: boolean;
}

export function WelcomeView({
  firstName,
  lastName,
  phone,
  phoneError,
  acceptPromotions,
  referralSource,
  socialMediaSource,
  otherSource,
  selectedCountryCode,
  averageTicket,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
  onCountryCodeChange,
  onAcceptPromotionsChange,
  onReferralSourceSelect,
  onSocialMediaSelect,
  onOtherSourceChange,
  onAverageTicketSelect,
  onContinue,
  canContinue,
  referralSourceError = false,
}: WelcomeViewProps) {
  return (
    <div className="space-y-4 animate-in slide-in-from-top duration-300">
      <PhoneInput
        value={phone}
        onChange={onPhoneChange}
        error={phoneError}
        selectedCountryCode={selectedCountryCode}
        onCountryCodeChange={onCountryCodeChange}
      />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="promotions"
          checked={acceptPromotions}
          onCheckedChange={(checked) =>
            onAcceptPromotionsChange(checked as boolean)
          }
        />
        <Label htmlFor="promotions" className="text-sm text-gray-800 font-medium">
          Acepto recibir promociones por{" "}
          <span className="text-green-600 font-medium">WhatsApp</span>
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            Nombre
          </Label>
          <Input
            id="firstName"
            placeholder="Tu nombre"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Apellido
          </Label>
          <Input
            id="lastName"
            placeholder="Tu apellido"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <ReferralSourceSelector
        selectedSource={referralSource}
        socialMediaSource={socialMediaSource}
        otherSource={otherSource}
        onSourceSelect={onReferralSourceSelect}
        onSocialMediaSelect={onSocialMediaSelect}
        onOtherSourceChange={onOtherSourceChange}
        hasError={referralSourceError}
      />

      {/* Consumption Selector */}
      <ConsumptionSelector
        selectedConsumption={averageTicket}
        onConsumptionSelect={onAverageTicketSelect}
        countryCode="MX"
      />

      <Button
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        disabled={!canContinue}
      >
        {!canContinue && phone && phoneError === ""
          ? "Completa tu número de teléfono"
          : "Continuar"}
      </Button>
    </div>
  );
}
