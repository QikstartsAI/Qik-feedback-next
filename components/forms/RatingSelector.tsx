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
    emoji: "😐", 
    label: "Regular",
    numericValue: "2",
    image: "/experienceregular.svg",
  },
  {
    id: "good",
    emoji: "😊",
    label: "Bueno", 
    numericValue: "4",
    image: "/experiencegood.svg",
  },
  {
    id: "excellent",
    emoji: "🤩",
    label: "Excelente",
    numericValue: "5", 
    image: "/experienceexelent.svg",
  },
];

export function RatingSelector({
  selectedRating,
  onRatingSelect,
}: RatingSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {ratingOptions.map((item) => (
        <button
          key={item.id}
          onClick={() => onRatingSelect(item.id)}
          className={cn(
            "p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center",
            {
              "border-purple-500 bg-purple-50 text-purple-700": selectedRating === item.id,
              "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50": selectedRating !== item.id,
            }
          )}
        >
          <Image
            src={item.image}
            alt={item.label}
            className="w-6 h-6 mb-1"
            width={129}
            height={129}
          />
          <div className="text-xs font-semibold text-center">{item.label}</div>
        </button>
      ))}
    </div>
  );
}
