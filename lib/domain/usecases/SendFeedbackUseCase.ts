import { Feedback, FeedbackPayload } from "@/lib/domain/entities";
import { FeedbackRepository } from "@/lib/domain/repositories/iFeedbackRepository";

export interface ISendFeedbackUseCase {
  execute(feedbackData: FeedbackPayload): Promise<Feedback>;
}

export class SendFeedbackUseCase implements ISendFeedbackUseCase {
  constructor(private feedbackRepository: FeedbackRepository) {}

  /**
   * Execute the use case to send feedback
   * @param feedbackData - Feedback data to send
   * @returns Promise<Feedback>
   * @throws Error if validation fails or repository fails
   */
  async execute(feedbackData: FeedbackPayload): Promise<Feedback> {
    // Validate feedback data
    this.validateFeedbackData(feedbackData);

    try {
      return await this.feedbackRepository.sendFeedback(feedbackData);
    } catch (error) {
      throw new Error(
        `Failed to send feedback: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Validate feedback data before sending
   * @param feedbackData - Feedback data to validate
   * @throws Error if validation fails
   */
  private validateFeedbackData(feedbackData: FeedbackPayload): void {
    if (!feedbackData.branchId || feedbackData.branchId.trim() === "") {
      throw new Error("Branch ID is required");
    }

    if (!feedbackData.customerId || feedbackData.customerId.trim() === "") {
      throw new Error("Customer ID is required");
    }

    if (typeof feedbackData.acceptTerms !== "boolean") {
      throw new Error("Accept terms must be a boolean value");
    }

    if (typeof feedbackData.acceptPromotions !== "boolean") {
      throw new Error("Accept promotions must be a boolean value");
    }

    if (!feedbackData.payload) {
      throw new Error("Feedback payload is required");
    }

    const { payload } = feedbackData;

    if (!payload.averageTicket || payload.averageTicket.trim() === "") {
      throw new Error("Average ticket is required");
    }

    if (!payload.origin || payload.origin.trim() === "") {
      throw new Error("Origin is required");
    }

    if (
      typeof payload.rate !== "number" ||
      payload.rate < 1 ||
      payload.rate > 5
    ) {
      throw new Error("Rate must be a number between 1 and 5");
    }

    if (payload.improve && !Array.isArray(payload.improve)) {
      throw new Error("Improve must be an array of strings");
    }

    if (payload.improve) {
      for (const item of payload.improve) {
        if (typeof item !== "string" || item.trim() === "") {
          throw new Error("Improve array must contain non-empty strings");
        }
      }
    }
  }
}
