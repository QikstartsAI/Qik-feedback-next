"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { reviewExamples } from "@/lib/utils/phoneUtils";

interface ReviewExamplesProps {
  onCopyReview: (reviewText: string, reviewId: string) => void;
  copiedReviewId: string | null;
  onCommentChange?: (value: string) => void;
  comment?: string;
}

export function ReviewExamples({
  onCopyReview,
  copiedReviewId,
  onCommentChange,
  comment = "",
}: ReviewExamplesProps) {
  const handleCardClick = (review: any) => {
    // Si hay comentarios adicionales, combinar con el texto original
    const fullText = comment.trim() 
      ? `${review.text} ${comment.trim()}`
      : review.text;
    
    onCopyReview(fullText, review.id);
  };

  const handleCommentChange = (value: string) => {
    if (onCommentChange) {
      onCommentChange(value);
      
      // Si hay una reseña seleccionada, actualizar la copia con el texto combinado
      if (copiedReviewId) {
        const selectedReview = reviewExamples.find(r => r.id === copiedReviewId);
        if (selectedReview) {
          const fullText = value.trim() 
            ? `${selectedReview.text} ${value.trim()}`
            : selectedReview.text;
          onCopyReview(fullText, copiedReviewId);
        }
      }
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700">
        ¿Nos ayudas con una reseña?
      </Label>
      <div className="space-y-3 mt-2">
        {reviewExamples.map((review) => (
          <div
            key={review.id}
            onClick={() => handleCardClick(review)}
            className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
              copiedReviewId === review.id
                ? "bg-green-50 border-2 border-green-200"
                : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
            }`}
          >
            <div className="flex-1">
              <p className="text-sm text-gray-800">{review.text}</p>
            </div>
            <div className={`p-2 rounded-lg transition-all ${
              copiedReviewId === review.id
                ? "bg-green-100 text-green-600"
                : "bg-white text-gray-500"
            }`}>
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
            </div>
          </div>
        ))}
      </div>
      
      {/* Editable field for additional comments */}
      {copiedReviewId && onCommentChange && (
        <div className="mt-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Agrega más comentarios si deseas:
          </Label>
          <Textarea
            placeholder="Escribe aquí tus comentarios adicionales..."
            value={comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            className="min-h-[80px] bg-white border-2 border-gray-300 focus:border-green-500"
          />
          {comment.trim() && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Los comentarios se incluirán en la reseña copiada
            </p>
          )}
        </div>
      )}
    </div>
  );
}
