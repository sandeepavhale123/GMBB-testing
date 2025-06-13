
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, MapPin, Clock, CheckCircle } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to GMB Briefcase!
        </h1>
        <p className="text-xl text-gray-600">
          Let's set up your business profile in just a few simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Business Information</h3>
          <p className="text-gray-600 text-sm">Tell us about your business and what you do</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Location Details</h3>
          <p className="text-gray-600 text-sm">Add your business address and contact info</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
          <p className="text-gray-600 text-sm">Set your operating hours for customers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Ready to Go!</h3>
          <p className="text-gray-600 text-sm">Start managing your Google Business profile</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          This setup will take about 5 minutes to complete
        </p>
        <Button 
          onClick={onNext}
          size="lg"
          className="w-full sm:w-auto px-8 py-3 text-lg"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
