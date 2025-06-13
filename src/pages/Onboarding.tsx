
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import WelcomeStep from '@/components/Onboarding/WelcomeStep';
import BusinessInfoStep from '@/components/Onboarding/BusinessInfoStep';
import BusinessLocationStep from '@/components/Onboarding/BusinessLocationStep';
import BusinessHoursStep from '@/components/Onboarding/BusinessHoursStep';
import CompletionStep from '@/components/Onboarding/CompletionStep';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    hours: {}
  });
  const navigate = useNavigate();

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and redirect to dashboard
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return <BusinessInfoStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 3:
        return <BusinessLocationStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 4:
        return <BusinessHoursStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 5:
        return <CompletionStep onComplete={handleNext} />;
      default:
        return <WelcomeStep onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Progress */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <img 
              src="https://member.gmbbriefcase.com/content/dist/assets/images/logo.png" 
              alt="GMB Briefcase Logo" 
              className="h-10 object-contain"
            />
            <span className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {renderStep()}
      </div>

      {/* Navigation Footer */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button 
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Continue
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
