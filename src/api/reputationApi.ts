import apiClient from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

// API Request/Response Interfaces
export interface CreateFeedbackFormRequest {
  formName: string;
  logo: File | null;
  formFields: string;
  title: string;
  subtitle: string;
  positiveRatingThreshold: string;
  positiveFeedbackTitle: string;
  reviewSiteUrls: string;
  successTitle: string;
  successSubtitle: string;
}

export interface CreateFeedbackFormResponse {
  code: number;
  message: string;
  data: {
    id: string;
    name: string;
    form_url: string;
  };
}

// API Function
export const createFeedbackForm = async (
  data: CreateFeedbackFormRequest
): Promise<CreateFeedbackFormResponse> => {
  const formData = new FormData();
  
  formData.append("formName", data.formName);
  if (data.logo) {
    formData.append("logo", data.logo);
  }
  formData.append("formFields", data.formFields);
  formData.append("title", data.title);
  formData.append("subtitle", data.subtitle);
  formData.append("positiveRatingThreshold", data.positiveRatingThreshold);
  formData.append("positiveFeedbackTitle", data.positiveFeedbackTitle);
  formData.append("reviewSiteUrls", data.reviewSiteUrls);
  formData.append("successTitle", data.successTitle);
  formData.append("successSubtitle", data.successSubtitle);

  const response = await apiClient.post<CreateFeedbackFormResponse>(
    "/reputation/create-feedback-form",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  
  return response.data;
};

// React Query Hook
export const useCreateFeedbackForm = () => {
  return useMutation({
    mutationFn: createFeedbackForm,
  });
};
