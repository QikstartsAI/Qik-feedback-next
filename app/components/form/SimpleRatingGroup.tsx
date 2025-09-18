"use client";

import { cn } from "@/lib/utils";
import { Ratings } from "@/lib/domain/entities";
import Image from "next/image";

interface SimpleRatingGroupProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

const ratingOptions = [
  { value: Ratings.Mal, image: "/experiencebad.svg", alt: "Bad" },
  { value: Ratings.Regular, image: "/experiencegood.svg", alt: "Regular" }, // Cambiado: imagen de "Bueno" ahora va en "Regular"
  { value: Ratings.Bien, image: "/experienceexelent.svg", alt: "Good" }, // Cambiado: imagen de "Excelente" ahora va en "Bueno"
  { value: Ratings.Excelente, image: "/experienceregular.svg", alt: "Excellent" }, // Cambiado: imagen de "Regular" ahora va en "Excelente"
];

export function SimpleRatingGroup({ 
  value, 
  onChange, 
  className 
}: SimpleRatingGroupProps) {
  return (
    <div className={cn("grid grid-cols-4 gap-4", className)}>
      {ratingOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center justify-center p-2 rounded-lg border-2 transition-all hover:scale-110",
            {
              "border-primary bg-primary/10 scale-110": value === option.value,
              "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50": value !== option.value,
            }
          )}
        >
          <Image
            src={option.image}
            alt={option.alt}
            className="w-8 h-8 md:w-52 md:h-52"
            width={668}
            height={657}
          />
        </button>
      ))}
    </div>
  );
}
