"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { reviewExamples } from "@/lib/utils/phoneUtils";

interface ReviewExamplesProps {
  onCopyReview: (reviewText: string, reviewId: string) => void;
  copiedReviewId: string | null;
}

export function ReviewExamples({
  onCopyReview,
  copiedReviewId,
}: ReviewExamplesProps) {
  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">
        ¿Nos ayudas con una reseña?
      </Label>
      <div className="space-y-3 mt-2">
        {reviewExamples.map((review) => (
          <div
            key={review.id}
            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-800">{review.text}</p>
            </div>
            <button
              onClick={() => onCopyReview(review.text, review.id)}
              className={`p-2 rounded-lg transition-all ${
                copiedReviewId === review.id
                  ? "bg-green-100 text-green-600"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
              title={
                copiedReviewId === review.id ? "¡Copiado!" : "Copiar reseña"
              }
            >
              {copiedReviewId === review.id ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
