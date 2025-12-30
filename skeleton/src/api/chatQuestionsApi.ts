import axiosInstance from './axiosInstance';

export interface ChatQuestion {
  title: string;
  icon: string;
  color: string;
  count: number;
  questions: string[];
}

export interface ChatQuestionsResponse {
  code: number;
  message: string;
  data: ChatQuestion[];
}

export const chatQuestionsApi = {
  getChatQuestions: async (): Promise<ChatQuestion[]> => {
    const response = await axiosInstance.post<ChatQuestionsResponse>('/chat/get-chat-questions');
    return response.data.data;
  }
};