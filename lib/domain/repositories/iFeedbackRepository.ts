import { Feedback, FeedbackPayload } from "@/lib/domain/entities";

export interface FeedbackRepository {
  getFeedbackById(id: string): Promise<Feedback>;
  getFeedbacksByBranchId(branchId: string): Promise<Feedback[]>;
  getFeedbacksByCustomerId(customerId: string): Promise<Feedback[]>;
  getFeedbacksByWaiterId(waiterId: string): Promise<Feedback[]>;
  sendFeedback(feedbackData: Feedback): Promise<Feedback>;
  updateFeedback(
    id: string,
    feedbackData: Partial<FeedbackPayload>
  ): Promise<Feedback>;
  deleteFeedback(id: string): Promise<void>;
}
