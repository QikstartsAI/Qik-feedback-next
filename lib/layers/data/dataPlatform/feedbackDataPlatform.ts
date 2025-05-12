import { FeedbackDTO, FeedbackModel, GetFeedbackParams } from "../../domain";
import { HttpClient } from "../httpClient";

const httpClient = new HttpClient();

export const getAllFeedback = async (
  params: GetFeedbackParams
): Promise<FeedbackModel[]> => {
  try {
    const feedbackList = await httpClient.get("/feedback", params);
    return feedbackList as FeedbackModel[];
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

export const createFeedback = async (feedbackData: FeedbackDTO) => {
  try {
    const newFeedback = await httpClient.post("/feedback", feedbackData);
    return newFeedback;
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw error;
  }
};

export const getFeedbackById = async (
  feedbackId: string
): Promise<FeedbackModel> => {
  try {
    const feedback = await httpClient.get(`/feedback/${feedbackId}`);
    return feedback as FeedbackModel;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};
