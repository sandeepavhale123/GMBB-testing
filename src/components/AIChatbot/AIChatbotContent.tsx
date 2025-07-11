import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { MessageCircle, Bot, Menu, X, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { PromptBox } from '../ui/chatgpt-prompt-input';

export const AIChatbotContent: React.FC = () => {
  const [showHistory, setShowHistory] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: "Business insights query", date: "Today" },
    { id: 2, title: "SEO optimization tips", date: "Yesterday" },
    { id: 3, title: "Marketing strategies", date: "2 days ago" },
  ]);

  const deleteChatHistory = (id: number) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
  };

  return (
    <div className="h-full flex">
      {/* Chat History Panel */}
      <div className={`${showHistory ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r bg-white`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Chat History</h3>
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
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="group p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{chat.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChatHistory(chat.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-screen bg-background dark:bg-[#212121]">
        {/* Header Section */}
        <div className="p-6 border-b">
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Chatbot</h1>
              <p className="text-gray-600">Get intelligent insights and assistance</p>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-3xl text-foreground mb-8">
              How Can I Help You
            </p>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-6">
          <div className="w-full max-w-2xl mx-auto">
            <PromptBox />
          </div>
        </div>
      </div>
    </div>
  );
};