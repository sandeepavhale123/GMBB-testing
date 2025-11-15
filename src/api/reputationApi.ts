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
import type { FormField } from "@/modules/Reputation-module/types/formBuilder.types";

export interface GetFeedbackFormResponse {
  code: number;
  message: string;
  data: {
    language: string;
    formName: string;
    logo: string;
    title: string;
    subtitle: string;
    positiveRatingThreshold: number;
    positiveFeedbackTitle: string;
    reviewSiteUrls: Record<string, string>;
    successTitle: string;
    successSubtitle: string;
    formFields: FormField[];
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

// Get Feedback Form (Authenticated) - For editing
export const getFeedbackForm = async (
  formId: string
): Promise<GetFeedbackFormResponse> => {
  const response = await apiClient.post<GetFeedbackFormResponse>(
    "/reputation/get-feedback-form",
    { formId }
  );
  return response.data;
};

// React Query Hook for Authenticated Get
export const useGetFeedbackForm = (formId: string | undefined) => {
  return useQuery({
    queryKey: ["feedbackForm", "authenticated", formId],
    queryFn: () => getFeedbackForm(formId!),
    enabled: !!formId, // Only fetch if formId exists
  });
};

// Update Feedback Form Request Interface
export interface UpdateFeedbackFormRequest {
  formId: string;
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

// Update Feedback Form Response
export interface UpdateFeedbackFormResponse {
  code: number;
  message: string;
  data: {
    id: string;
    name: string;
    form_url: string;
  };
}

// Update API Function
export const updateFeedbackForm = async (
  data: UpdateFeedbackFormRequest
): Promise<UpdateFeedbackFormResponse> => {
  const formData = new FormData();

  formData.append("formId", data.formId);
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

  const response = await apiClient.post<UpdateFeedbackFormResponse>(
    "/reputation/update-feedback-form",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// React Query Hook for Update
export const useUpdateFeedbackForm = () => {
  return useMutation({
    mutationFn: updateFeedbackForm,
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

// Get All Feedback Forms
import type {
  GetAllFeedbackFormsRequest,
  GetAllFeedbackFormsResponse,
  DeleteFeedbackFormRequest,
  DeleteFeedbackFormResponse,
  GetFeedbackDetailsRequest,
  GetFeedbackDetailsResponse,
  GetFeedbackResponseStatsRequest,
  GetFeedbackResponseStatsResponse,
} from "@/modules/Reputation-module/v1/types";

export const getAllFeedbackForms = async (
  params: GetAllFeedbackFormsRequest
): Promise<GetAllFeedbackFormsResponse> => {
  const response = await apiClient.post<GetAllFeedbackFormsResponse>(
    "/reputation/get-all-feedback-form",
    params
  );
  return response.data;
};

// React Query Hook with pagination support
export const useGetAllFeedbackForms = (
  search: string,
  page: number,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["feedbackForms", search, page, limit],
    queryFn: () => getAllFeedbackForms({ search, page, limit }),
    staleTime: 30000,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
};

// Delete Feedback Form
export const deleteFeedbackForm = async (
  formId: string
): Promise<DeleteFeedbackFormResponse> => {
  const response = await apiClient.post<DeleteFeedbackFormResponse>(
    "/reputation/delete-feedback-form",
    { formId }
  );
  return response.data;
};

// React Query Hook for Delete
export const useDeleteFeedbackForm = () => {
  return useMutation({
    mutationFn: deleteFeedbackForm,
  });
};

// Get Feedback Stats
export interface GetFeedbackStatsResponse {
  code: number;
  message: string;
  data: {
    totalForms: number;
    totalResponses: number;
    responsesThisMonth: number;
    avgRating: number;
  };
}

export const getFeedbackStats = async (): Promise<GetFeedbackStatsResponse> => {
  const response = await apiClient.post<GetFeedbackStatsResponse>(
    "/reputation/get-feedback-stat",
    {}
  );
  return response.data;
};

// React Query Hook for Stats
export const useGetFeedbackStats = () => {
  return useQuery({
    queryKey: ["feedbackStats"],
    queryFn: getFeedbackStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get Feedback Response Stats API Function
export const getFeedbackResponseStats = async (
  request: GetFeedbackResponseStatsRequest
): Promise<GetFeedbackResponseStatsResponse> => {
  const response = await apiClient.post<GetFeedbackResponseStatsResponse>(
    "/reputation/get-feedback-responce-stat",
    request
  );
  return response.data;
};

// React Query Hook for Feedback Response Stats
export const useGetFeedbackResponseStats = (formId: string) => {
  return useQuery({
    queryKey: ["feedbackResponseStats", formId],
    queryFn: () => getFeedbackResponseStats({ formId }),
    enabled: !!formId,
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change frequently
    refetchOnWindowFocus: false,
  });
};

// Get Feedback Details API Function (Table Data Only)
export const getFeedbackDetails = async (
  request: GetFeedbackDetailsRequest
): Promise<GetFeedbackDetailsResponse> => {
  const response = await apiClient.post<GetFeedbackDetailsResponse>(
    "/reputation/get-feedback-details",
    request
  );
  return response.data;
};

// React Query Hook for Feedback Details (Table Data Only)
export const useGetFeedbackDetails = (request: GetFeedbackDetailsRequest) => {
  return useQuery({
    queryKey: [
      "feedbackDetails",
      request.formId,
      request.page,
      request.limit,
      request.search,
      request.starRating,
    ],
    queryFn: () => getFeedbackDetails(request),
    enabled: !!request.formId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData, // Keep previous data during refetch
    refetchOnWindowFocus: false,
  });
};
