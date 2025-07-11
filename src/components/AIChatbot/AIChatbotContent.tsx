import React from 'react';
import { Card, CardContent } from '../ui/card';
import { MessageCircle, Bot } from 'lucide-react';

export const AIChatbotContent: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Welcome Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Chatbot</h1>
            <p className="text-gray-600">Get intelligent insights and assistance</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Chat Messages Area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to AI Assistant
              </h3>
              <p className="text-gray-500 max-w-md">
                Start a conversation to get insights, recommendations, and assistance with your business needs.
              </p>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-gray-500 text-sm">Type your message here...</p>
              </div>
              <div className="bg-blue-500 rounded-lg px-4 py-3">
                <p className="text-white text-sm">Send</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};