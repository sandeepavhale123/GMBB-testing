import axiosInstance from "@/api/axiosInstance";

const BASE_PATH = "/live-seo-fixer";

export interface GenerateIssueSuggestionRequest {
  project_name: string;
  page_type: string;
  target_keyword: string;
  page_url: string;
  issue_type: string;
  current_value?: string;
}

export interface GenerateIssueSuggestionResponse {
  suggested_value: string;
}

export const aiService = {
  async generateIssueSuggestion(
    request: GenerateIssueSuggestionRequest
  ): Promise<GenerateIssueSuggestionResponse> {
    const { data } = await axiosInstance.post(
      `${BASE_PATH}/generate-issue-suggestion`,
      request
    );
    return data.data;
  },
};
