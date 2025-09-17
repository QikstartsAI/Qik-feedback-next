"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { RatingSelector } from "@/components/forms/RatingSelector";
import { ImprovementSelector } from "@/components/forms/ImprovementSelector";
import { ReviewExamples } from "@/components/forms/ReviewExamples";
import { isPositiveRating } from "@/lib/utils/formUtils";

interface SurveyViewProps {
  // Form state
  rating: string;
  comment: string;
  selectedImprovements: string[];
  acceptTerms: boolean;
  copiedReviewId: string | null;

  // Form handlers
  onRatingSelect: (ratingId: string) => void;
  onCommentChange: (value: string) => void;
  onImprovementSelect: (improvementId: string) => void;
  onAcceptTermsChange: (checked: boolean) => void;
  onCopyReview: (reviewText: string, reviewId: string) => void;
  onSubmitFeedback: () => void;
  onOpenGoogleMaps: () => void;

  // Loading state
  feedbackLoading: boolean;
}

export function SurveyView({
  rating,
  comment,
  selectedImprovements,
  acceptTerms,
  copiedReviewId,
  onRatingSelect,
  onCommentChange,
  onImprovementSelect,
  onAcceptTermsChange,
  onCopyReview,
  onSubmitFeedback,
  onOpenGoogleMaps,
  feedbackLoading,
}: SurveyViewProps) {
  const positiveRating = isPositiveRating(rating);

  return (
    <div className="space-y-4 animate-in slide-in-from-top duration-300">
      <RatingSelector selectedRating={rating} onRatingSelect={onRatingSelect} />

      {/* Positive Feedback */}
      {positiveRating && (
        <div className="mt-6 space-y-4">
          <ReviewExamples
            onCopyReview={onCopyReview}
            copiedReviewId={copiedReviewId}
            onCommentChange={onCommentChange}
            comment={comment}
          />

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms-positive"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  onAcceptTermsChange(checked as boolean)
                }
              />
              <Label
                htmlFor="terms-positive"
                className="text-xs text-gray-600 leading-tight"
              >
                Al continuar, acepto los{" "}
                <a
                  href="https://qikstarts.com/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Términos y Condiciones
                </a>{" "}
                y las{" "}
                <a
                  href="https://qikstarts.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Políticas de Privacidad
                </a>
                .
              </Label>
            </div>
          </div>

          <button
            onClick={onOpenGoogleMaps}
            disabled={!acceptTerms}
            className="w-full mt-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-bold py-2 px-3 rounded-full transition-colors duration-200 flex items-center gap-2"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-red-700 rounded-full flex-shrink-0">
              <Image
                src="/Ggoogle-04.svg"
                alt="Google"
                width={20}
                height={20}
                className="text-white"
              />
            </div>
            <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">Escribir mi reseña en Google</span>
          </button>
        </div>
      )}

      {/* Negative Feedback */}
      {!positiveRating && rating && (
        <div className="mt-6 space-y-4">
          <ImprovementSelector
            selectedImprovements={selectedImprovements}
            onImprovementSelect={onImprovementSelect}
          />

          <Textarea
            placeholder="Cuéntanos más detalles"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className={`min-h-[80px] ${!comment.trim() ? 'border-red-500' : ''}`}
          />
          {!comment.trim() && (
            <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  onAcceptTermsChange(checked as boolean)
                }
              />
              <Label
                htmlFor="terms"
                className="text-xs text-gray-600 leading-tight"
              >
                Al presionar &apos;Enviar&apos;, acepto los{" "}
                <a
                  href="https://qikstarts.com/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Términos y Condiciones
                </a>{" "}
                y las{" "}
                <a
                  href="https://qikstarts.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Políticas de Privacidad
                </a>
                .
              </Label>
            </div>
          </div>

          <Button
            onClick={onSubmitFeedback}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={
              !rating ||
              !acceptTerms ||
              feedbackLoading ||
              selectedImprovements.length === 0 ||
              !comment.trim()
            }
          >
            {feedbackLoading ? "Enviando..." : "Enviar feedback"}
          </Button>
        </div>
      )}
    </div>
  );
}
