import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatWithBot = (botId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string | null> => {
    if (!botId) {
      setError('Bot ID is required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-bot-chat', {
        body: {
          bot_id: botId,
          message,
          conversation_history: conversationHistory,
        },
      });

      if (functionError) {
        console.error('Chat error:', functionError);
        setError(functionError.message || 'Failed to get response');
        return null;
      }

      if (data.error) {
        setError(data.error);
        return null;
      }

      return data.response;
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [botId]);

  return {
    isLoading,
    error,
    sendMessage,
  };
};
