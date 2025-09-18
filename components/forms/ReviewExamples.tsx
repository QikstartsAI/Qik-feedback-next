"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Copy, Check } from "lucide-react";
import { reviewExamples } from "@/lib/utils/phoneUtils";
import { useDebouncedCallback } from "@/hooks/useDebounce";

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
  // Estado local para el comentario (para evitar lag en el input)
  const [localComment, setLocalComment] = useState(comment);

  // Sincronizar el estado local cuando cambie el prop
  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  // Función debounced para actualizar el comentario y la copia
  const debouncedUpdateComment = useDebouncedCallback((value: string) => {
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
  }, 500); // 500ms de delay

  const handleCardClick = (review: any) => {
    // Si hay comentarios adicionales, combinar con el texto original
    const fullText = localComment.trim() 
      ? `${review.text} ${localComment.trim()}`
      : review.text;
    
    onCopyReview(fullText, review.id);
  };

  const handleCommentChange = (value: string) => {
    // Actualizar el estado local inmediatamente para una respuesta fluida
    setLocalComment(value);
    // Actualizar el estado padre después del debounce
    debouncedUpdateComment(value);
  };

  return (
    <div>
      <Label className="text-sm font-bold text-gray-700 text-center block">
        ¿Nos ayudas con una reseña?
      </Label>
      <div className="space-y-3 mt-2">
        {reviewExamples.map((review) => (
          <div
            key={review.id}
            onClick={() => handleCardClick(review)}
            className={`flex items-start space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-200 transform active:scale-95 ${
              copiedReviewId === review.id
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-md"
                : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200 hover:shadow-sm"
            }`}
          >
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-relaxed">{review.text}</p>
            </div>
            <div className={`p-3 rounded-lg transition-all duration-200 ${
              copiedReviewId === review.id
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}>
              {copiedReviewId === review.id ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Metal box design for additional comments */}
      {copiedReviewId && onCommentChange && (
        <div className="mt-6">
          <div className="relative">
            {/* Metal box container */}
            <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-1 rounded-lg shadow-inner">
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-md border border-gray-400">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  ✨ Personaliza tu reseña:
                </Label>
                <Textarea
                  placeholder="Agrega tus comentarios adicionales aquí..."
                  value={localComment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  className="min-h-[100px] bg-white border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg resize-none"
                />
                
                {/* Status indicator */}
                <div className="mt-3 flex items-center justify-between">
                  {localComment.trim() ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <p className="text-xs text-green-600 font-medium">
                        ✓ Texto personalizado listo para copiar
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Copy className="h-4 w-4 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        Toca una sugerencia arriba para copiar al portapapeles
                      </p>
                    </div>
                  )}
                  
                  {/* Character count */}
                  <span className="text-xs text-gray-400">
                    {localComment.length}/200
                  </span>
                </div>
              </div>
            </div>
            
            {/* Metal box decorative elements */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-sm"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-sm"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-sm"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
}
