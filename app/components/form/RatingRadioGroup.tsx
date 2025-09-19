"use client";

import { cn } from "@/lib/utils";
import { Ratings } from "@/lib/domain/entities";
import Image from "next/image";
import { Country } from "react-phone-number-input";

interface RatingOption {
  value: Ratings;
  label: {
    us: string;
    ca: string;
    fr: string;
    it: string;
    default: string;
  };
  image: string;
}

interface RatingRadioGroupProps {
  value?: string;
  onChange: (value: string) => void;
  country?: Country;
  className?: string;
}

const ratingOptions: RatingOption[] = [
  {
    value: Ratings.Mal,
    label: { 
      us: "Bad", 
      ca: "Mal", 
      fr: "Mal", 
      it: "Male", 
      default: "Mal" 
    },
    image: "/experiencebad.svg",
  },
  {
    value: Ratings.Regular,
    label: {
      us: "Fair",
      ca: "Régulière",
      fr: "Régulière",
      it: "Regolare",
      default: "Regular",
    },
    image: "/experiencegood.svg", // Cambiado: imagen de "Bueno" ahora va en "Regular"
  },
  {
    value: Ratings.Bien,
    label: { 
      us: "Good", 
      ca: "Bon", 
      fr: "Bon", 
      it: "Bene", 
      default: "Bien" 
    },
    image: "/experienceexelent.svg", // Cambiado: imagen de "Excelente" ahora va en "Bueno"
  },
  {
    value: Ratings.Excelente,
    label: {
      us: "Excellent",
      ca: "Excellent",
      fr: "Excellent",
      it: "Eccellente",
      default: "Excelente",
    },
    image: "/experienceregular.svg", // Cambiado: imagen de "Regular" ahora va en "Excelente"
  },
];

const getLabel = (option: RatingOption, country: Country | undefined) => {
  switch (country) {
    case "US":
    case "HK":
      return option.label.us;
    case "CA":
      return option.label.ca;
    case "FR":
      return option.label.fr;
    case "IT":
      return option.label.it;
    default:
      return option.label.default;
  }
};

export function RatingRadioGroup({ 
  value, 
  onChange, 
  country, 
  className 
}: RatingRadioGroupProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-2 md:gap-3", className)}>
      {ratingOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex flex-col items-center justify-center p-3 md:p-4 rounded-lg border-2 transition-all duration-200 group",
            {
              "border-primary bg-primary/10 scale-105 opacity-100": value === option.value,
              "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 opacity-60 hover:opacity-80": value !== option.value,
            }
          )}
        >
          <Image
            src={option.image}
            alt={`experiencia ${option.label.default.toLowerCase()}`}
            className="w-10 h-10 md:w-12 md:h-12"
            width={668}
            height={657}
          />
          <span className="text-xs md:text-sm font-semibold text-center mt-1">
            {getLabel(option, country)}
          </span>
        </button>
      ))}
    </div>
  );
}
