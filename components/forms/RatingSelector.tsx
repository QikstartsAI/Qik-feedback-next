"use client";

import { cn } from "@/lib/utils";
import { Ratings } from "@/lib/domain/entities";
import Image from "next/image";
import { mapEmojiToNumericRating, mapNumericToEmojiRating } from "@/lib/utils/formUtils";

interface RatingSelectorProps {
  selectedRating: string;
  onRatingSelect: (ratingId: string) => void;
}

const ratingOptions = [
  {
    id: "terrible",
    emoji: "😡",
    label: "Terrible",
    numericValue: "1",
    image: "/experienceterrible.svg",
  },
  {
    id: "bad", 
    emoji: "😞",
    label: "Malo",
    numericValue: "1",
    image: "/experiencebad.svg",
  },
  {
    id: "regular",
    emoji: "😊", // Cambiado: emoji de "Bueno" ahora va en "Regular"
    label: "Regular",
    numericValue: "2",
    image: "/experiencegood.svg", // Cambiado: imagen de "Bueno" ahora va en "Regular"
  },
  {
    id: "good",
    emoji: "🤩", // Cambiado: emoji de "Excelente" ahora va en "Bueno"
    label: "Bueno", 
    numericValue: "4",
    image: "/experienceexelent.svg", // Cambiado: imagen de "Excelente" ahora va en "Bueno"
  },
  {
    id: "excellent",
    emoji: "😐", // Cambiado: emoji de "Regular" ahora va en "Excelente"
    label: "Excelente",
    numericValue: "5", 
    image: "/experienceregular.svg", // Cambiado: imagen de "Regular" ahora va en "Excelente"
  },
];

export function RatingSelector({
  selectedRating,
  onRatingSelect,
}: RatingSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center">
        ¿Cómo estuvimos el día de hoy?
      </h3>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
      {ratingOptions.map((item) => (
        <button
          key={item.id}
          onClick={() => onRatingSelect(item.id)}
          className={cn(
            "p-3 md:p-4 rounded-lg transition-all duration-200 flex flex-col items-center justify-center group",
            {
              "bg-purple-50 text-purple-700": selectedRating === item.id,
              "bg-transparent text-gray-700 hover:bg-gray-50": selectedRating !== item.id,
            }
          )}
        >
          <div className={cn(
            "transition-all duration-200 mb-2",
            {
              "scale-110 opacity-100": selectedRating === item.id,
              "scale-100 opacity-60 group-hover:scale-105 group-hover:opacity-80": selectedRating !== item.id,
            }
          )}>
            <Image
              src={item.image}
              alt={item.label}
              className="w-12 h-12 md:w-14 md:h-14"
              width={129}
              height={129}
            />
          </div>
          <div className="text-xs md:text-sm font-semibold text-center">{item.label}</div>
        </button>
      ))}
      </div>
    </div>
  );
}
