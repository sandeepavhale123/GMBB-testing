import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { MessageCircle, Bot, Menu, X, Trash2, Copy, ThumbsUp, ThumbsDown, User, Loader2, Plus, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { PromptBox } from '../ui/chatgpt-prompt-input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { useChat } from '../../hooks/useChat';

interface AIChatbotContentProps {
  keyword?: string;
  keywordId?: string;
}

export const AIChatbotContent: React.FC<AIChatbotContentProps> = ({ keyword, keywordId }) => {
  const [showHistory, setShowHistory] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useChat(keywordId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleDeleteClick = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (sessionToDelete) {
      await deleteChatHistory(sessionToDelete);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    }
  };

  return (
    <div className="h-full flex">
      {/* Chat History Panel */}
      <div className={`${showHistory ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r bg-white`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Chat History</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startNewChat}
                  className="h-8 w-8 p-0"
                  title="New Chat"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {isLoadingHistory ? (
                <div className="text-center py-8 text-gray-500">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm">Loading chat history...</p>
                </div>
              ) : chatHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No chat history yet</p>
                </div>
              ) : (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => loadChatSession(chat)}
                    className={`group p-3 rounded-lg hover:bg-gray-50 cursor-pointer border transition-colors ${
                      currentSession?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{chat.timestamp}</p>
                        {chat.lastMessage && (
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {chat.lastMessage.length > 60 ? chat.lastMessage.substring(0, 60) + '...' : chat.lastMessage}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(chat.chat_session_id);
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting && sessionToDelete === chat.chat_session_id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen bg-background dark:bg-[#212121]">
        {/* Header Section */}
        <div className="flex-shrink-0 p-6 border-b">
          <div className="flex items-center space-x-3">
            {!showHistory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(true)}
                className="h-8 w-8 p-0 mr-2"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div className="p-2 bg-blue-500 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">AI Genie Assistance</h1>
              <p className="text-gray-600">
                {keyword ? `Get intelligent insights and assistance for keyword "${keyword}"` : 'Get intelligent insights and assistance'}
              </p>
            </div>
            {keyword && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                <Tag className="h-3 w-3" />
                {keyword}
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800" style={{ height: 'calc(100% - 200px)' }}>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-blue-500" />
                  <p className="text-sm text-gray-600">Loading chat messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                  <Bot className="h-16 w-16 text-blue-500 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to AI Genie Assistance</h2>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Ask me questions about your business performance, SEO optimization, geo-ranking insights, and more. 
                    Try the suggested questions to get started!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : message.isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    
                    {/* Message Content */}
                    <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-4 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : message.error 
                          ? 'bg-destructive/10 text-destructive border border-destructive/20'
                          : 'bg-muted text-foreground'
                      }`}>
                        {message.isLoading ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            AI is thinking...
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-sm leading-6">
                            {message.content}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons for AI messages - only show for messages with valid database IDs */}
                      {message.type === 'ai' && !message.isLoading && message.id && !message.id.includes('_') && !isNaN(Number(message.id)) && (
                         <div className="flex items-center gap-2 mt-2">
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleCopy(message.content)}
                             className="h-8 px-2 text-xs hover:bg-accent"
                           >
                             <Copy className="w-3 h-3 mr-1" />
                             Copy
                           </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleGoodResponse(message.id)}
                              disabled={message.isSubmittingFeedback}
                              className={`h-8 px-2 text-xs hover:bg-accent ${
                                message.feedback === 'good' 
                                  ? 'bg-green-100 text-green-600 hover:bg-green-100' 
                                  : 'hover:text-green-600'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Good
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBadResponse(message.id)}
                              disabled={message.isSubmittingFeedback}
                              className={`h-8 px-2 text-xs hover:bg-accent ${
                                message.feedback === 'bad' 
                                  ? 'bg-red-100 text-red-600 hover:bg-red-100' 
                                  : 'hover:text-red-600'
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              Bad
                            </Button>
                         </div>
                      )}
                      
                      <div className={`text-xs text-muted-foreground mt-1 ${
                        message.type === 'user' ? 'text-right' : ''
                      }`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="flex-shrink-0 p-6 border-t bg-background dark:bg-[#212121] -mt-[200px]">
          <div className="w-full max-w-2xl mx-auto">
            <PromptBox onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};