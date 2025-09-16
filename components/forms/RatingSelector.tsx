"use client";

import { ratingEmojis } from "@/lib/utils/phoneUtils";

interface RatingSelectorProps {
  selectedRating: string;
  onRatingSelect: (ratingId: string) => void;
}

export function RatingSelector({
  selectedRating,
  onRatingSelect,
}: RatingSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {ratingEmojis.map((item) => (
        <button
          key={item.id}
          onClick={() => onRatingSelect(item.id)}
          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
            selectedRating === item.id
              ? "border-purple-500 bg-purple-50 text-purple-700"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <div className="text-2xl mb-1">{item.emoji}</div>
          <div className="text-xs font-semibold text-center">{item.label}</div>
        </button>
      ))}
    </div>
  );
}
