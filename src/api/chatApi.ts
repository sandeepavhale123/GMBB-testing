import axiosInstance from './axiosInstance';
import { ChatSendRequest, ChatSendResponse } from '../types/chatTypes';

export const sendChatMessage = async (data: ChatSendRequest): Promise<ChatSendResponse> => {
  const response = await axiosInstance.post('/chat/geo-ranking-agent', data);
  return response.data;
};