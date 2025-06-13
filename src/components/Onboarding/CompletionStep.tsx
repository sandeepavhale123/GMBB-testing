
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, BarChart3, MessageSquare, Calendar } from 'lucide-react';

interface CompletionStepProps {
  onComplete: () => void;
}

const CompletionStep = ({ onComplete }: CompletionStepProps) => {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Congratulations! 🎉
        </h1>
        <p className="text-xl text-gray-600">
          Your business profile is now set up and ready to go
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          What's next? Here's what you can do:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600 mt-1" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-600">Track your business performance</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <MessageSquare className="h-6 w-6 text-green-600 mt-1" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Manage Posts</h4>
              <p className="text-sm text-gray-600">Create and schedule content</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
            <Calendar className="h-6 w-6 text-purple-600 mt-1" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Schedule Posts</h4>
              <p className="text-sm text-gray-600">Plan your content calendar</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
            <Sparkles className="h-6 w-6 text-orange-600 mt-1" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">AI Features</h4>
              <p className="text-sm text-gray-600">Generate content with AI</p>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={onComplete}
        size="lg"
        className="w-full sm:w-auto px-8 py-3 text-lg"
      >
        Go to Dashboard
        <Sparkles className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

export default CompletionStep;
