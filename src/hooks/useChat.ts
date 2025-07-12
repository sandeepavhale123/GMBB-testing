import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, ChatSession, ChatHistoryItem, ChatMessageItem, FeedbackType } from '../types/chatTypes';
import { sendChatMessage, getChatHistory, getChatMessages, deleteChatSession, updateChatFeedback } from '../api/chatApi';
import { useListingContext } from '../context/ListingContext';
import { useAppSelector } from './useRedux';
import { toast } from './use-toast';

export const useChat = (keywordId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string>('');

  const { selectedListing } = useListingContext();
  const { user } = useAppSelector((state) => state.auth);

  // Transform API chat history to ChatSession format
  const transformChatHistory = useCallback((chatItems: ChatHistoryItem[]): ChatSession[] => {
    const sessionMap = new Map<string, ChatSession>();
    
    chatItems.forEach((item) => {
      const sessionId = item.chat_session_id;
      let messageContent = '';
      
      try {
        const parsed = JSON.parse(item.message);
        messageContent = parsed.reply || item.message;
      } catch {
        messageContent = item.message;
      }

      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {
          id: sessionId,
          chat_session_id: sessionId,
          title: messageContent.length > 50 ? messageContent.substring(0, 50) + '...' : messageContent,
          lastMessage: messageContent,
          timestamp: new Date(item.created_at).toLocaleDateString(),
          messages: []
        });
      }

      const session = sessionMap.get(sessionId)!;
      session.lastMessage = messageContent;
      session.timestamp = new Date(item.created_at).toLocaleDateString();
    });

    return Array.from(sessionMap.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, []);

  // Fetch chat history
  const fetchChatHistory = useCallback(async () => {
    if (!selectedListing?.id || !keywordId) return;

    setIsLoadingHistory(true);
    try {
      const listingId = parseInt(selectedListing.id, 10);
      const projectId = parseInt(keywordId, 10);

      const response = await getChatHistory({
        listingId,
        projectId,
        type: 'geo-ranking-chat'
      });

      if (response.code === 200 && response.data.chats) {
        const transformedHistory = transformChatHistory(response.data.chats);
        setChatHistory(transformedHistory);
      }
    } catch (error: any) {
      console.error('Failed to fetch chat history:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load chat history'
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [selectedListing?.id, keywordId, transformChatHistory]);

  // Load chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

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
      // Use keywordId as projectId if provided, otherwise fallback to user data
      const projectId = keywordId ? parseInt(keywordId, 10) : (user?.projectId || user?.userId ? parseInt(user.userId, 10) : 50407);

      const response = await sendChatMessage({
        listingId,
        projectId,
        message: messageContent.trim(),
        chat_id: chatSessionId,
      });

      // Check if this is a new session being created
      const isNewSession = !chatSessionId && response.data.chat_session_id;
      
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

      // If this is a new session, refresh chat history and set current session
      if (isNewSession) {
        // Refresh chat history to include the new session
        await fetchChatHistory();
        
        // Create and set the current session object
        const newSession: ChatSession = {
          id: response.data.chat_session_id,
          chat_session_id: response.data.chat_session_id,
          title: messageContent.length > 50 ? messageContent.substring(0, 50) + '...' : messageContent,
          lastMessage: response.data.reply,
          timestamp: new Date().toLocaleDateString(),
          messages: []
        };
        setCurrentSession(newSession);
      }

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
  }, [selectedListing?.id, user, chatSessionId, keywordId]);

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard',
    });
  }, []);

  const submitFeedback = useCallback(async (messageId: string, feedback: FeedbackType) => {
    if (!selectedListing?.id || !keywordId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing listing or project information'
      });
      return;
    }

    // Set loading state for the specific message
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isSubmittingFeedback: true }
        : msg
    ));

    try {
      const listingId = parseInt(selectedListing.id, 10);
      const projectId = parseInt(keywordId, 10);

      await updateChatFeedback({
        listingId,
        projectId,
        chat_id: messageId,
        feedback
      });

      // Update message with feedback
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback, isSubmittingFeedback: false }
          : msg
      ));

      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
      });

    } catch (error: any) {
      console.error('Failed to submit feedback:', error);
      
      // Remove loading state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isSubmittingFeedback: false }
          : msg
      ));

      toast({
        variant: 'destructive',
        title: 'Feedback failed',
        description: error.response?.data?.message || 'Failed to submit feedback. Please try again.',
      });
    }
  }, [selectedListing?.id, keywordId]);

  const handleGoodResponse = useCallback((messageId: string) => {
    submitFeedback(messageId, 'good');
  }, [submitFeedback]);

  const handleBadResponse = useCallback((messageId: string) => {
    submitFeedback(messageId, 'bad');
  }, [submitFeedback]);


  // Transform API chat messages to ChatMessage format
  const transformChatMessages = useCallback((chatMessages: ChatMessageItem[]): ChatMessage[] => {
    return chatMessages.map((item, index) => {
      let messageContent = '';
      
      try {
        const parsed = JSON.parse(item.message);
        messageContent = parsed.reply || item.message;
      } catch {
        messageContent = item.message;
      }

      return {
        id: item.id || `${item.chat_session_id}_${index}`,
        type: (item.role === 'user' ? 'user' : 'ai') as 'user' | 'ai',
        content: messageContent,
        timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        feedback: item.feedback as FeedbackType | undefined,
      };
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, []);

  // Load chat messages for a specific session
  const loadChatMessages = useCallback(async (sessionId: string) => {
    if (!selectedListing?.id || !keywordId) return;

    setIsLoadingMessages(true);
    try {
      const listingId = parseInt(selectedListing.id, 10);
      const projectId = parseInt(keywordId, 10);

      const response = await getChatMessages({
        listingId,
        projectId,
        chat_session_id: sessionId
      });

      if (response.code === 200 && response.data.chat_messages) {
        const transformedMessages = transformChatMessages(response.data.chat_messages);
        setMessages(transformedMessages);
      }
    } catch (error: any) {
      console.error('Failed to fetch chat messages:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load chat messages'
      });
    } finally {
      setIsLoadingMessages(false);
    }
  }, [selectedListing?.id, keywordId, transformChatMessages]);

  const loadChatSession = useCallback(async (session: ChatSession) => {
    setCurrentSession(session);
    setChatSessionId(session.chat_session_id);
    await loadChatMessages(session.chat_session_id);
    toast({
      title: 'Chat Session Loaded',
      description: `Loaded chat session: ${session.title}`
    });
  }, [loadChatMessages]);

  const deleteChatHistory = useCallback(async (sessionId: string) => {
    if (!selectedListing?.id || !keywordId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing listing or project information'
      });
      return;
    }

    setIsDeleting(true);
    try {
      const listingId = parseInt(selectedListing.id, 10);
      const projectId = parseInt(keywordId, 10);

      await deleteChatSession({
        listingId,
        projectId,
        chat_session_id: sessionId
      });

      // Remove from local state
      setChatHistory(prev => prev.filter(chat => chat.chat_session_id !== sessionId));
      
      // Clear current session if it's the one being deleted
      if (currentSession?.chat_session_id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
        setChatSessionId('');
      }

      toast({
        title: 'Chat Deleted',
        description: 'Chat session has been deleted successfully'
      });

    } catch (error: any) {
      console.error('Failed to delete chat session:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error.response?.data?.message || 'Failed to delete chat session'
      });
    } finally {
      setIsDeleting(false);
    }
  }, [selectedListing?.id, keywordId, currentSession]);

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
    isLoadingHistory,
    isLoadingMessages,
    isDeleting,
    sendMessage,
    handleCopy,
    handleGoodResponse,
    handleBadResponse,
    loadChatSession,
    deleteChatHistory,
    startNewChat,
    fetchChatHistory,
  };
};