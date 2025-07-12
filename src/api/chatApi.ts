import axiosInstance from './axiosInstance';
import { ChatSendRequest, ChatSendResponse, ChatHistoryRequest, ChatHistoryResponse } from '../types/chatTypes';

export const sendChatMessage = async (data: ChatSendRequest): Promise<ChatSendResponse> => {
  const response = await axiosInstance.post('/chat/geo-ranking-agent', data);
  return response.data;
};

export const getChatHistory = async (data: ChatHistoryRequest): Promise<ChatHistoryResponse> => {
  const response = await axiosInstance.post('/chat/get-chats-history', data);
  return response.data;
};