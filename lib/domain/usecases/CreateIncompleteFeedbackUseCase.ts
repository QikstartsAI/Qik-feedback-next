import { Feedback, FeedbackPayload } from "@/lib/domain/entities";
import { FeedbackRepository } from "@/lib/domain/repositories/iFeedbackRepository";

export interface ICreateIncompleteFeedbackUseCase {
  execute(feedbackData: Partial<Feedback>): Promise<Feedback>;
}

export class CreateIncompleteFeedbackUseCase implements ICreateIncompleteFeedbackUseCase {
  constructor(private feedbackRepository: FeedbackRepository) {}

  /**
   * Create an incomplete feedback entry
   * @param feedbackData - Partial feedback data
   * @returns Promise<Feedback>
   */
  async execute(feedbackData: Partial<Feedback>): Promise<Feedback> {
    console.log("🎯 [CreateIncompleteFeedbackUseCase] execute - Starting", { 
      branchId: feedbackData.branchId,
      waiterId: feedbackData.waiterId,
      customerId: feedbackData.customerId,
      customerType: feedbackData.payload?.customerType,
      origin: feedbackData.payload?.origin
    });

    try {
      // Create incomplete feedback with minimal required data
      console.log("🔧 [CreateIncompleteFeedbackUseCase] execute - Building incomplete feedback object");
      const incompleteFeedback: Feedback = {
        id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        branchId: feedbackData.branchId || "",
        waiterId: feedbackData.waiterId,
        customerId: feedbackData.customerId || "",
        payload: {
          acceptTerms: false,
          acceptPromotions: feedbackData.payload?.acceptPromotions || false,
          customerType: feedbackData.payload?.customerType || "new" as any,
          averageTicket: feedbackData.payload?.averageTicket || "0",
          origin: feedbackData.payload?.origin || "",
          feedback: feedbackData.payload?.feedback || "",
          rate: 0, // No rating yet
          experienceText: feedbackData.payload?.experienceText || "",
          improve: feedbackData.payload?.improve || [],
          status: "incomplete"
        }
      };

      console.log("📡 [CreateIncompleteFeedbackUseCase] execute - Sending to repository", { 
        branchId: incompleteFeedback.branchId,
        customerId: incompleteFeedback.customerId,
        status: incompleteFeedback.payload.status
      });

      // Send to repository
      const result = await this.feedbackRepository.sendFeedback(incompleteFeedback);
      
      console.log("🎉 [CreateIncompleteFeedbackUseCase] execute - Success", { 
        feedbackId: result.id,
        branchId: result.branchId,
        customerId: result.customerId,
        status: result.payload?.status,
        createdAt: result.createdAt
      });
      
      return result;
    } catch (error) {
      console.error("❌ [CreateIncompleteFeedbackUseCase] execute - Error", { 
        branchId: feedbackData.branchId,
        customerId: feedbackData.customerId,
        error 
      });
      
      throw new Error(
        `Failed to create incomplete feedback: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
