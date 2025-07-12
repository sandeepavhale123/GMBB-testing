import { useState, useCallback } from 'react';
import { ChatMessage, ChatSession } from '../types/chatTypes';
import { sendChatMessage } from '../api/chatApi';
import { useListingContext } from '../context/ListingContext';
import { useAppSelector } from './useRedux';
import { toast } from './use-toast';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string>('');

  const { selectedListing } = useListingContext();
  const { user } = useAppSelector((state) => state.auth);

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!selectedListing?.id || !messageContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a listing and enter a message',
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);

    // Add loading AI message
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLoading: true,
    };

    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);

    try {
      const listingId = parseInt(selectedListing.id, 10);
      const projectId = user?.projectId || user?.userId ? parseInt(user.userId, 10) : 50407; // Fallback project ID

      const response = await sendChatMessage({
        listingId,
        projectId,
        message: messageContent.trim(),
        chat_id: chatSessionId,
      });

      // Update chat session ID if provided
      if (response.data.chat_session_id) {
        setChatSessionId(response.data.chat_session_id);
      }

      // Replace loading message with actual AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: response.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => prev.slice(0, -1).concat(aiMessage));

    } catch (error: any) {
      console.error('Chat send error:', error);
      
      // Replace loading message with error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: error.message,
      };

      setMessages(prev => prev.slice(0, -1).concat(errorMessage));

      toast({
        variant: 'destructive',
        title: 'Message failed',
        description: error.response?.data?.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedListing?.id, user, chatSessionId]);

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard',
    });
  }, []);

  const handleGoodResponse = useCallback((messageId: string) => {
    console.log('Good response for message:', messageId);
    toast({
      title: 'Feedback recorded',
      description: 'Thank you for your feedback!',
    });
  }, []);

  const handleBadResponse = useCallback((messageId: string) => {
    console.log('Bad response for message:', messageId);
    toast({
      title: 'Feedback recorded',
      description: 'Thank you for your feedback. We\'ll work to improve.',
    });
  }, []);

  const deleteChatHistory = useCallback((id: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
  }, []);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setChatSessionId('');
    setCurrentSession(null);
  }, []);

  return {
    messages,
    chatHistory,
    currentSession,
    isLoading,
    sendMessage,
    handleCopy,
    handleGoodResponse,
    handleBadResponse,
    deleteChatHistory,
    startNewChat,
  };
};