import axios from "@/api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export interface GenerateIssueSuggestionRequest {
  project_name: string;
  page_type: string;
  target_keyword: string;
  page_url: string;
  issue_type: string;
  current_value?: string;
}

export interface GenerateIssueSuggestionResponse {
  code: number;
  message: string;
  data: {
    issue_type: string;
    current_value: string;
    suggestion: string;
    page_type: string;
    target_keyword: string;
    generated_at: string;
  };
}

export const generateIssueSuggestion = async (
  request: GenerateIssueSuggestionRequest,
): Promise<GenerateIssueSuggestionResponse> => {
  const response = await axios.post<GenerateIssueSuggestionResponse>(
    `${API_BASE_URL}/live-seo-fixer/generate-issue-suggestion`,
    request,
  );
  return response.data;
};
