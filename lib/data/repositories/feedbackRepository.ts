import { HttpClient, IHttpClient } from "@/lib/core/httpClient";
import { Feedback, FeedbackPayload } from "@/lib/domain/entities";
import { FeedbackRepository } from "@/lib/domain/repositories/iFeedbackRepository";

export class FeedbackRepositoryImpl implements FeedbackRepository {
  private httpClient: IHttpClient;
  private baseUrl: string;

  constructor(httpClient: IHttpClient, baseUrl?: string) {
    this.httpClient = httpClient;
    // Don't use baseUrl since HttpClient already has baseURL configured
    // This prevents double base URL issues and undefined concatenation
    this.baseUrl = "";
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
      const response = await this.httpClient.get<{items: Feedback[], total: number}>(
        `${this.baseUrl}/feedback/byBranchId`,
        {
          params: { branchId }
        }
      );
      // The API returns {items: Feedback[], total: number}, so we need to extract the items
      return response.data.items || [];
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
      const response = await this.httpClient.get<{items: Feedback[], total: number}>(
        `${this.baseUrl}/feedback`,
        {
          params: { customerId }
        }
      );
      // The API returns {items: Feedback[], total: number}, so we need to extract the items
      return response.data.items || [];
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
      const response = await this.httpClient.get<{items: Feedback[], total: number}>(
        `${this.baseUrl}/feedback`,
        {
          params: { waiterId }
        }
      );
      // The API returns {items: Feedback[], total: number}, so we need to extract the items
      return response.data.items || [];
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
  async sendFeedback(feedbackData: Feedback): Promise<Feedback> {
    console.log("💬 [FeedbackRepository] sendFeedback - Starting", { 
      branchId: feedbackData.branchId,
      waiterId: feedbackData.waiterId,
      customerId: feedbackData.customerId,
      status: feedbackData.payload?.status,
      rate: feedbackData.payload?.rate,
      customerType: feedbackData.payload?.customerType
    });
    
    try {
      const { id, createdAt, updatedAt, ...data } = feedbackData;

      // Backend expects data wrapped in a payload object
      const requestData = {
        payload: data.payload,
        branchId: data.branchId,
        waiterId: data.waiterId,
        customerId: data.customerId
      };

      const endpoint = `${this.baseUrl}/feedback`;
      console.log("📡 [FeedbackRepository] sendFeedback - Making request", { 
        endpoint, 
        requestData: {
          ...requestData,
          payload: {
            ...requestData.payload,
            // Don't log sensitive feedback content
            feedback: requestData.payload?.feedback ? 
              `${requestData.payload.feedback.substring(0, 50)}...` : undefined
          }
        }
      });

      const response = await this.httpClient.post<Feedback>(endpoint, requestData);
      
      console.log("✅ [FeedbackRepository] sendFeedback - Success", { 
        feedbackId: response.data?.id,
        branchId: response.data?.branchId,
        customerId: response.data?.customerId,
        status: response.data?.payload?.status,
        rate: response.data?.payload?.rate,
        createdAt: response.data?.createdAt
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ [FeedbackRepository] sendFeedback - Error", { 
        branchId: feedbackData.branchId,
        customerId: feedbackData.customerId,
        status: feedbackData.payload?.status,
        error 
      });
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
    console.log("✏️ [FeedbackRepository] updateFeedback - Starting", { 
      id,
      updateFields: Object.keys(feedbackData),
      status: feedbackData.status,
      rate: feedbackData.rate
    });
    
    try {
      // Backend expects data wrapped in a payload object
      const requestData = {
        payload: feedbackData
      };
      
      const endpoint = `${this.baseUrl}/feedback/${id}`;
      console.log("📡 [FeedbackRepository] updateFeedback - Making PATCH request", { 
        endpoint, 
        method: 'PATCH',
        requestData: {
          ...requestData,
          payload: {
            ...requestData.payload,
            // Don't log sensitive feedback content
            feedback: requestData.payload?.feedback ? 
              `${requestData.payload.feedback.substring(0, 50)}...` : undefined
          }
        }
      });
      
      const response = await this.httpClient.patch<Feedback>(endpoint, requestData);
      
      console.log("✅ [FeedbackRepository] updateFeedback - Success", { 
        id,
        feedbackId: response.data?.id,
        status: response.data?.payload?.status,
        rate: response.data?.payload?.rate,
        updatedAt: response.data?.updatedAt
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ [FeedbackRepository] updateFeedback - Error", { 
        id,
        updateFields: Object.keys(feedbackData),
        error 
      });
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
