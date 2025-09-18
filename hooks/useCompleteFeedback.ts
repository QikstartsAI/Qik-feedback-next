import { useCallback } from "react";
import { Feedback, FeedbackPayload } from "@/lib/domain/entities";
import { useDependencyInjection } from "@/hooks/useDependencyInjection";
import { COMPLETE_FEEDBACK_USE_CASE } from "@/lib/core/di/ServiceIdentifiers";
import { ICompleteFeedbackUseCase } from "@/lib/domain/usecases";

export function useCompleteFeedback() {
  const { getService, isInitialized } = useDependencyInjection();

  const completeFeedback = useCallback(
    async (feedbackId: string, completeData: Partial<FeedbackPayload>): Promise<Feedback | null> => {
      if (!isInitialized) {
        console.error("Services not initialized");
        return null;
      }

      try {
        const useCase = await getService<ICompleteFeedbackUseCase>(
          COMPLETE_FEEDBACK_USE_CASE
        );
        const result = await useCase.execute(feedbackId, completeData);
        return result;
      } catch (error) {
        console.error("Error completing feedback:", error);
        return null;
      }
    },
    [isInitialized, getService]
  );

  return {
    completeFeedback,
  };
}
