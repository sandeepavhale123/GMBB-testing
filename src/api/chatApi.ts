import axiosInstance from './axiosInstance';
import { ChatSendRequest, ChatSendResponse, ChatHistoryRequest, ChatHistoryResponse, ChatMessagesRequest, ChatMessagesResponse, ChatDeleteRequest, ChatDeleteResponse } from '../types/chatTypes';

export const sendChatMessage = async (data: ChatSendRequest): Promise<ChatSendResponse> => {
  const response = await axiosInstance.post('/chat/geo-ranking-agent', data);
  return response.data;
};

export const getChatHistory = async (data: ChatHistoryRequest): Promise<ChatHistoryResponse> => {
  const response = await axiosInstance.post('/chat/get-chats-history', data);
  return response.data;
};

export const getChatMessages = async (data: ChatMessagesRequest): Promise<ChatMessagesResponse> => {
  const response = await axiosInstance.post('/chat/get-chat-messages', data);
  return response.data;
};

export const deleteChatSession = async (data: ChatDeleteRequest): Promise<ChatDeleteResponse> => {
  const response = await axiosInstance.post('/chat/delete-chat', data);
  return response.data;
};