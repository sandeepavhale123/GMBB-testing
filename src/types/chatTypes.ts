export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  isLoading?: boolean;
  error?: string;
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

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
}