
import axiosInstance from './axiosInstance';

export interface GeneratePostDescriptionRequest {
  description: string;
  tone: string;
  variants: number;
}

export interface GeneratedContent {
  title: string;
  content: string;
}

export interface GeneratePostDescriptionResponse {
  code: number;
  message: string;
  data: GeneratedContent[];
}

export const generatePostDescription = async (
  request: GeneratePostDescriptionRequest
): Promise<GeneratePostDescriptionResponse> => {
  const response = await axiosInstance.post<GeneratePostDescriptionResponse>(
    '/generate-post-description',
    request
  );
  return response.data;
};
