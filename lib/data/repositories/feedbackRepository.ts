import { HttpClient, IHttpClient } from "@/lib/core/httpClient";
import { Feedback, FeedbackPayload } from "@/lib/domain/entities";
import { FeedbackRepository } from "@/lib/domain/repositories/iFeedbackRepository";

export class FeedbackRepositoryImpl implements FeedbackRepository {
  private httpClient: IHttpClient;
  private baseUrl: string;

  constructor(httpClient: IHttpClient, baseUrl?: string) {
    this.httpClient = httpClient;
    // Only use baseUrl if HttpClient doesn't already have a baseURL configured
    // This prevents double base URL issues
    this.baseUrl = baseUrl || "";
  }

  /**
   * Get feedback by ID
   * @param id - Feedback ID
   * @returns Promise<Feedback>
   */
  async getFeedbackById(id: string): Promise<Feedback> {
    try {
      const response = await this.httpClient.get<Feedback>(
        `${this.baseUrl}/feedback/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching feedback by ID:", error);
      throw new Error(
        `Failed to fetch feedback with ID ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get feedbacks by branch ID
   * @param branchId - Branch ID
   * @returns Promise<Feedback[]>
   */
  async getFeedbacksByBranchId(branchId: string): Promise<Feedback[]> {
    try {
      const response = await this.httpClient.get<Feedback[]>(
        `${this.baseUrl}/feedback/branch/${branchId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching feedbacks by branch ID:", error);
      throw new Error(
        `Failed to fetch feedbacks for branch ${branchId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get feedbacks by customer ID
   * @param customerId - Customer ID
   * @returns Promise<Feedback[]>
   */
  async getFeedbacksByCustomerId(customerId: string): Promise<Feedback[]> {
    try {
      const response = await this.httpClient.get<Feedback[]>(
        `${this.baseUrl}/feedback/customer/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching feedbacks by customer ID:", error);
      throw new Error(
        `Failed to fetch feedbacks for customer ${customerId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get feedbacks by waiter ID
   * @param waiterId - Waiter ID
   * @returns Promise<Feedback[]>
   */
  async getFeedbacksByWaiterId(waiterId: string): Promise<Feedback[]> {
    try {
      const response = await this.httpClient.get<Feedback[]>(
        `${this.baseUrl}/feedback/waiter/${waiterId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching feedbacks by waiter ID:", error);
      throw new Error(
        `Failed to fetch feedbacks for waiter ${waiterId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Send feedback
   * @param feedbackData - Feedback data to send
   * @returns Promise<Feedback>
   */
  async sendFeedback(feedbackData: FeedbackPayload): Promise<Feedback> {
    try {
      const response = await this.httpClient.post<Feedback>(
        `${this.baseUrl}/feedback`,
        feedbackData
      );
      return response.data;
    } catch (error) {
      console.error("Error sending feedback:", error);
      throw new Error(
        `Failed to send feedback: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update feedback
   * @param id - Feedback ID
   * @param feedbackData - Partial feedback data to update
   * @returns Promise<Feedback>
   */
  async updateFeedback(
    id: string,
    feedbackData: Partial<FeedbackPayload>
  ): Promise<Feedback> {
    try {
      const response = await this.httpClient.put<Feedback>(
        `${this.baseUrl}/feedback/${id}`,
        feedbackData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating feedback:", error);
      throw new Error(
        `Failed to update feedback ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete feedback
   * @param id - Feedback ID
   * @returns Promise<void>
   */
  async deleteFeedback(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`${this.baseUrl}/feedback/${id}`);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw new Error(
        `Failed to delete feedback ${id}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Factory function to create a feedback repository instance
export const createFeedbackRepository = (
  httpClient: IHttpClient,
  baseUrl?: string
): FeedbackRepository => {
  return new FeedbackRepositoryImpl(httpClient, baseUrl);
};

// Default export for convenience
export default createFeedbackRepository;
