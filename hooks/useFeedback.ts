import { useCallback } from "react";
import { FeedbackPayload } from "@/lib/domain/entities";
import { useFeedbackContext } from "@/lib/data/context";

export function useFeedback() {
  const {
    currentFeedback,
    loading,
    error,
    sendFeedback,
    clearError,
    clearCurrentFeedback,
  } = useFeedbackContext();

  const handleSendFeedback = useCallback(
    async (feedbackData: FeedbackPayload) => {
      try {
        const result = await sendFeedback(feedbackData);
        return result;
      } catch (error) {
        console.error("Error in useFeedback hook:", error);
        throw error;
      }
    },
    [sendFeedback]
  );

  return {
    currentFeedback,
    loading,
    error,
    sendFeedback: handleSendFeedback,
    clearError,
    clearCurrentFeedback,
  };
}
