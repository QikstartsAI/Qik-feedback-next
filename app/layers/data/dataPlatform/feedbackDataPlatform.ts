import { HttpClient } from "@/data";
import { FeedbackDTO, FeedbackModel, GetFeedbackParams } from '@/domain'

const httpClient = new HttpClient(
  "http://a807d22c5dcaf4392b29c14778d84f37-1961716059.us-east-1.elb.amazonaws.com/v1/api/"
);

export const getAllFeedback = async (params: GetFeedbackParams) : Promise<FeedbackModel[]> => {
  try {
    const feedbackList = await httpClient.get('/feedback', params);
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

export const getFeedbackById = async (feedbackId: string) : Promise<FeedbackModel> => {
  try {
    const feedback = await httpClient.get(`/feedback/${feedbackId}`);
    return feedback as FeedbackModel;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};