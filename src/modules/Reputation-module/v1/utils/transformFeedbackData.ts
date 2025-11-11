import type { FeedbackFormApiResponse, FeedbackForm } from "../types";

export const transformFeedbackFormData = (
  apiData: FeedbackFormApiResponse
): FeedbackForm => {
  return {
    id: apiData.id,
    form_id: apiData.formId,
    name: apiData.formName,
    created_at: apiData.created_at,
    feedback_count: parseInt(apiData.totalResponses) || 0,
    avg_rating: parseFloat(apiData.avgRating) || 0,
    form_url: apiData.formUrl,
  };
};
