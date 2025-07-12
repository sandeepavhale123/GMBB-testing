export type FeedbackType = 'good' | 'bad';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  isLoading?: boolean;
  error?: string;
  feedback?: FeedbackType;
  isSubmittingFeedback?: boolean;
}

export interface ChatSendRequest {
  listingId: number;
  projectId: number;
  message: string;
  chat_id: string;
}

export interface ChatSendResponse {
  code: number;
  message: string;
  data: {
    reply: string;
    function_name: string;
    function_args: any[];
    function_result: {
      result: any[];
      system_prompt: string;
    };
    chat_session_id: string;
  };
}

export interface ChatHistoryRequest {
  listingId: number;
  projectId: number;
  type: string;
}

export interface ChatHistoryItem {
  id: string;
  user_id: string;
  chat_session_id: string;
  site_id: string;
  geo_project_id: string;
  role: string;
  type: string;
  message: string;
  feedback: string;
  created_at: string;
  site_url: string | null;
  bname: string;
}

export interface ChatHistoryResponse {
  code: number;
  message: string;
  data: {
    chats: ChatHistoryItem[];
  };
}

export interface ChatMessagesRequest {
  listingId: number;
  projectId: number;
  chat_session_id: string;
}

export interface ChatMessageItem {
  id: string;
  user_id: string;
  chat_session_id: string;
  site_id: string;
  geo_project_id: string;
  role: string;
  type: string;
  message: string;
  feedback: string;
  created_at: string;
}

export interface ChatMessagesResponse {
  code: number;
  message: string;
  data: {
    chat_messages: ChatMessageItem[];
  };
}

export interface ChatDeleteRequest {
  listingId: number;
  projectId: number;
  chat_session_id: string;
}

export interface ChatDeleteResponse {
  code: number;
  message: string;
  data: any[];
}

export interface ChatFeedbackRequest {
  listingId: number;
  projectId: number;
  chat_id: string;
  feedback: FeedbackType;
}

export interface ChatFeedbackResponse {
  code: number;
  message: string;
  data: any[];
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
  chat_session_id: string;
}