
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Sparkles, BarChart3, MessageSquare, Calendar, Users } from 'lucide-react';

interface CompletionStepProps {
  onComplete: () => void;
}

const CompletionStep = ({ onComplete }: CompletionStepProps) => {
  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-12">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Welcome to GMB Briefcase!
        </h1>
        <p className="text-xl text-gray-600">
          Your account is set up and ready to go. Here's what you can do next:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-1 items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">View Dashboard</h3>
              <p className="text-gray-600 text-sm">See your business performance overview and key metrics</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Your First Post</h3>
              <p className="text-gray-600 text-sm">Share updates and engage with your customers</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Schedule Content</h3>
              <p className="text-gray-600 text-sm">Plan and automate your content calendar</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Try AI Features</h3>
              <p className="text-gray-600 text-sm">Generate content and optimize your listings with AI</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Need Help Getting Started?</h3>
        </div>
        <p className="text-blue-800 mb-4">
          Our team is here to help you succeed. Access our knowledge base, video tutorials, 
          or schedule a free onboarding call.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            View Help Center
          </Button>
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            Schedule Onboarding Call
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={onComplete}
          size="lg"
          className="px-12 py-4 text-lg"
        >
          Go to Dashboard
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
