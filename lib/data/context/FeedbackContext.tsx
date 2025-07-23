"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Feedback, FeedbackPayload } from "@/lib/domain/entities";
import { ISendFeedbackUseCase } from "@/lib/domain/usecases";
import { useDependencyInjection } from "@/hooks/useDependencyInjection";
import { SEND_FEEDBACK_USE_CASE } from "@/lib/core/di/ServiceIdentifiers";

interface FeedbackContextState {
  currentFeedback: Feedback | null;
  loading: boolean;
  error: string | null;
}

interface FeedbackContextActions {
  sendFeedback: (feedbackData: Feedback) => Promise<Feedback | null>;
  clearError: () => void;
  clearCurrentFeedback: () => void;
}

interface FeedbackContextType
  extends FeedbackContextState,
    FeedbackContextActions {}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

interface FeedbackProviderProps {
  children: ReactNode;
}

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  const { getService, isInitialized } = useDependencyInjection();

  const [state, setState] = useState<FeedbackContextState>({
    currentFeedback: null,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loading,
      error: loading ? null : prev.error,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, loading: false }));
  }, []);

  const setCurrentFeedback = useCallback((feedback: Feedback | null) => {
    setState((prev) => ({ ...prev, currentFeedback: feedback }));
  }, []);

  const sendFeedback = useCallback(
    async (feedbackData: Feedback): Promise<Feedback | null> => {
      if (!isInitialized) {
        setError("Services not initialized");
        return null;
      }

      setLoading(true);

      try {
        const useCase = await getService<ISendFeedbackUseCase>(
          SEND_FEEDBACK_USE_CASE
        );
        const feedback = await useCase.execute(feedbackData);

        setCurrentFeedback(feedback);

        return feedback;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to send feedback";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isInitialized, getService, setLoading, setError, setCurrentFeedback]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const clearCurrentFeedback = useCallback(() => {
    setCurrentFeedback(null);
  }, [setCurrentFeedback]);

  const contextValue: FeedbackContextType = {
    ...state,
    sendFeedback,
    clearError,
    clearCurrentFeedback,
  };

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedbackContext(): FeedbackContextType {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error(
      "useFeedbackContext must be used within a FeedbackProvider"
    );
  }

  return context;
}
