"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
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
          />

          <Textarea
            placeholder="Cuéntanos más detalles (opcional)"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="min-h-[80px]"
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
                Al continuar, acepto los Términos y Condiciones y las Políticas
                de Privacidad.
              </Label>
            </div>
          </div>

          <Button
            onClick={onOpenGoogleMaps}
            className="w-full mt-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            disabled={!acceptTerms}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Escribir mi reseña en Google
          </Button>
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
            placeholder="Cuéntanos más detalles (opcional)"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="min-h-[80px]"
          />

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
                Al presionar &apos;Enviar&apos;, acepto los Términos y
                Condiciones y las Políticas de Privacidad.
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
              selectedImprovements.length === 0
            }
          >
            {feedbackLoading ? "Enviando..." : "Enviar feedback"}
          </Button>
        </div>
      )}
    </div>
  );
}
