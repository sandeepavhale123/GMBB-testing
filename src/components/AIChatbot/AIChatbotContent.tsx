import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { MessageCircle, Bot, Menu, X, Trash2, Copy, ThumbsUp, ThumbsDown, User } from 'lucide-react';
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

  const [messages] = useState([
    { 
      id: 1, 
      type: 'user', 
      content: 'How can I improve my business SEO?',
      timestamp: '2:30 PM'
    },
    { 
      id: 2, 
      type: 'ai', 
      content: 'Here are some effective SEO strategies for your business:\n\n1. **Keyword Research**: Focus on local keywords relevant to your business\n2. **Content Quality**: Create high-quality, valuable content regularly\n3. **Technical SEO**: Ensure your website loads fast and is mobile-friendly\n4. **Local SEO**: Optimize your Google My Business profile\n5. **Link Building**: Get quality backlinks from reputable sources\n\nWould you like me to elaborate on any of these points?',
      timestamp: '2:31 PM'
    },
    { 
      id: 3, 
      type: 'user', 
      content: 'Tell me more about local SEO optimization',
      timestamp: '2:32 PM'
    },
    { 
      id: 4, 
      type: 'ai', 
      content: 'Local SEO is crucial for businesses serving specific geographic areas. Here\'s how to optimize:\n\n• **Google My Business**: Complete your profile with accurate NAP (Name, Address, Phone)\n• **Local Keywords**: Use "near me" and location-based keywords\n• **Customer Reviews**: Encourage and respond to reviews\n• **Local Citations**: Ensure consistent business information across directories\n• **Local Content**: Create content about local events and community involvement\n\nThis helps you appear in local search results and Google Maps.',
      timestamp: '2:33 PM'
    }
  ]);

  const deleteChatHistory = (id: number) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== id));
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleGoodResponse = (messageId: number) => {
    console.log('Good response for message:', messageId);
  };

  const handleBadResponse = (messageId: number) => {
    console.log('Bad response for message:', messageId);
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
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {messages.map((message) => (
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
                        : 'bg-muted text-foreground'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-6">
                        {message.content}
                      </div>
                    </div>
                    
                    {/* Action Buttons for AI messages */}
                    {message.type === 'ai' && (
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
                          className="h-8 px-2 text-xs hover:bg-accent hover:text-green-600"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Good
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBadResponse(message.id)}
                          className="h-8 px-2 text-xs hover:bg-accent hover:text-red-600"
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
              ))}
            </div>
          </ScrollArea>
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