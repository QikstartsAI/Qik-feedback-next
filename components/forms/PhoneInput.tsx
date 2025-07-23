"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import {
  countryCodes,
  applyPhoneMask,
  validatePhone,
  formatPhoneWithCountryCode,
} from "@/lib/utils/phoneUtils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  selectedCountryCode: string;
  onCountryCodeChange: (code: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  error,
  selectedCountryCode,
  onCountryCodeChange,
  label = "Teléfono",
  placeholder = "Número de teléfono",
  required = true,
}: PhoneInputProps) {
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const countrySelectorRef = useRef<HTMLDivElement>(null);

  // Close country selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countrySelectorRef.current &&
        !countrySelectorRef.current.contains(event.target as Node)
      ) {
        setShowCountrySelector(false);
      }
    };

    if (showCountrySelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountrySelector]);

  const handlePhoneChange = (inputValue: string) => {
    const digitsOnly = inputValue.replace(/\D/g, "");
    const maskedValue = applyPhoneMask(digitsOnly, selectedCountryCode);
    const formattedPhone = formatPhoneWithCountryCode(
      maskedValue,
      selectedCountryCode
    );
    onChange(formattedPhone);
  };

  const handleCountryCodeChange = (countryCode: string) => {
    const currentDigits = value
      .replace(selectedCountryCode + " ", "")
      .replace(/\D/g, "");

    onCountryCodeChange(countryCode);
    setShowCountrySelector(false);

    // Update phone with new country code
    if (currentDigits) {
      const maskedValue = applyPhoneMask(currentDigits, countryCode);
      const formattedPhone = formatPhoneWithCountryCode(
        maskedValue,
        countryCode
      );
      onChange(formattedPhone);
    }
  };

  return (
    <div>
      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="flex mt-1">
        <div className="relative" ref={countrySelectorRef}>
          <button
            type="button"
            onClick={() => setShowCountrySelector(!showCountrySelector)}
            className="flex items-center px-3 h-10 bg-gray-50 border border-r-0 rounded-l-md hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">
              {countryCodes.find((c) => c.code === selectedCountryCode)?.flag ||
                "🇪🇨"}
            </span>
            <span className="ml-1 text-sm">{selectedCountryCode}</span>
            <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
          </button>

          {showCountrySelector && (
            <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {countryCodes.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountryCodeChange(country.code)}
                  className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg mr-2">{country.flag}</span>
                  <span className="text-sm font-medium">{country.code}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {country.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <Input
          id="phone"
          type="tel"
          placeholder={placeholder}
          value={value.replace(selectedCountryCode + " ", "")}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="rounded-l-none h-10"
          maxLength={20}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {!error && value && (
        <p className="text-green-600 text-xs mt-1">✓ Número válido</p>
      )}
      {!value && (
        <p className="text-gray-500 text-xs mt-1">
          Ingresa tu número de teléfono para continuar
        </p>
      )}
    </div>
  );
}
