import { useState, useEffect } from 'react';
import { chatQuestionsApi, ChatQuestion } from '../api/chatQuestionsApi';

export const useChatQuestions = () => {
  const [questions, setQuestions] = useState<ChatQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await chatQuestionsApi.getChatQuestions();
      setQuestions(data);
    } catch (err) {
      setError('Failed to load suggested questions');
      // console.error('Error fetching chat questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const retry = () => {
    fetchQuestions();
  };

  return {
    questions,
    isLoading,
    error,
    retry
  };
};