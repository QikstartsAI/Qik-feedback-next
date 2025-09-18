import { useCallback } from "react";
import { Feedback } from "@/lib/domain/entities";
import { useDependencyInjection } from "@/hooks/useDependencyInjection";
import { CREATE_INCOMPLETE_FEEDBACK_USE_CASE } from "@/lib/core/di/ServiceIdentifiers";
import { ICreateIncompleteFeedbackUseCase } from "@/lib/domain/usecases";

export function useIncompleteFeedback() {
  const { getService, isInitialized } = useDependencyInjection();

  const createIncompleteFeedback = useCallback(
    async (feedbackData: Partial<Feedback>): Promise<Feedback | null> => {
      if (!isInitialized) {
        console.error("Services not initialized");
        return null;
      }

      try {
        const useCase = await getService<ICreateIncompleteFeedbackUseCase>(
          CREATE_INCOMPLETE_FEEDBACK_USE_CASE
        );
        const result = await useCase.execute(feedbackData);
        return result;
      } catch (error) {
        console.error("Error creating incomplete feedback:", error);
        return null;
      }
    },
    [isInitialized, getService]
  );

  return {
    createIncompleteFeedback,
  };
}
