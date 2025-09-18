import { Feedback, FeedbackPayload } from "@/lib/domain/entities";
import { FeedbackRepository } from "@/lib/domain/repositories/iFeedbackRepository";

export interface ICompleteFeedbackUseCase {
  execute(feedbackId: string, completeData: Partial<FeedbackPayload>): Promise<Feedback>;
}

export class CompleteFeedbackUseCase implements ICompleteFeedbackUseCase {
  constructor(private feedbackRepository: FeedbackRepository) {}

  /**
   * Complete an existing incomplete feedback
   * @param feedbackId - ID of the feedback to complete
   * @param completeData - Complete feedback data
   * @returns Promise<Feedback>
   */
  async execute(feedbackId: string, completeData: Partial<FeedbackPayload>): Promise<Feedback> {
    try {
      // Validate required fields for completion
      if (!completeData.rate || completeData.rate < 1 || completeData.rate > 5) {
        throw new Error("Rate must be between 1 and 5");
      }

      if (typeof completeData.acceptTerms !== "boolean" || !completeData.acceptTerms) {
        throw new Error("Terms must be accepted to complete feedback");
      }

      // Prepare update data with status as complete
      const updateData: Partial<FeedbackPayload> = {
        ...completeData,
        status: "complete"
      };

      // Update the feedback
      const result = await this.feedbackRepository.updateFeedback(feedbackId, updateData);
      return result;
    } catch (error) {
      console.error("Error completing feedback:", error);
      throw new Error(
        `Failed to complete feedback: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
