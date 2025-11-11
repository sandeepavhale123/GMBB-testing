import apiClient from "@/api/axiosInstance";
import { publicAxiosInstance } from "@/api/publicAxiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";

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

// Get Feedback Form (Public) - No authentication required
export interface GetFeedbackFormResponse {
  code: number;
  message: string;
  data: {
    formName: string;
    logo: string;
    title: string;
    subtitle: string;
    positiveRatingThreshold: number;
    positiveFeedbackTitle: string;
    reviewSiteUrls: string; // JSON string
    successTitle: string;
    successSubtitle: string;
    formFields: string; // JSON string
    formId: string;
    created_at: string;
  };
}

export const getFeedbackFormPublic = async (
  formId: string
): Promise<GetFeedbackFormResponse> => {
  const response = await publicAxiosInstance.post<GetFeedbackFormResponse>(
    "/reputation/get-feedback-form",
    { formId }
  );
  return response.data;
};

// React Query Hook for Public Feedback Form
export const useGetFeedbackFormPublic = (formId: string) => {
  return useQuery({
    queryKey: ["feedbackForm", formId],
    queryFn: () => getFeedbackFormPublic(formId),
    enabled: !!formId,
  });
};

// Submit Feedback Form (Public) - No authentication required
export interface SubmitFeedbackFormRequest {
  formId: string;
  starRating: number;
  formData: Record<string, any>;
}

export interface SubmitFeedbackFormResponse {
  code: number;
  message: string;
  data: {
    formId: string;
    email: string;
    status: string;
    starRating: number;
    submittedAt: string;
  };
}

export const submitFeedbackForm = async (
  data: SubmitFeedbackFormRequest
): Promise<SubmitFeedbackFormResponse> => {
  const response = await publicAxiosInstance.post<SubmitFeedbackFormResponse>(
    "/reputation/submit-feedback-form",
    data
  );
  return response.data;
};

// React Query Hook for Submit Feedback
export const useSubmitFeedbackForm = () => {
  return useMutation({
    mutationFn: submitFeedbackForm,
  });
};
