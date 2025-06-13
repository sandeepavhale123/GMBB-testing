
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check } from 'lucide-react';
import BusinessInfoStep from '@/components/Onboarding/BusinessInfoStep';
import SelectGoalStep from '@/components/Onboarding/SelectGoalStep';
import ConnectGoogleStep from '@/components/Onboarding/ConnectGoogleStep';
import SelectListingsStep from '@/components/Onboarding/SelectListingsStep';
import CompletionStep from '@/components/Onboarding/CompletionStep';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    email: '',
    timezone: '',
    locationCount: 1,
    goals: [],
    googleConnected: false,
    selectedListings: []
  });
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Business Info', description: 'Tell us about your business' },
    { id: 2, title: 'Select Goals', description: 'What do you want to achieve?' },
    { id: 3, title: 'Connect Google', description: 'Link your Google account' },
    { id: 4, title: 'Select Listings', description: 'Choose your listings' },
    { id: 5, title: 'Complete', description: 'Setup complete!' }
  ];

  const totalSteps = steps.length;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
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
        return <BusinessInfoStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 2:
        return <SelectGoalStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 3:
        return <ConnectGoogleStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 4:
        return <SelectListingsStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
      case 5:
        return <CompletionStep onComplete={handleNext} />;
      default:
        return <BusinessInfoStep formData={formData} updateFormData={updateFormData} onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Left Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <img 
            src="https://member.gmbbriefcase.com/content/dist/assets/images/logo.png" 
            alt="GMB Briefcase Logo" 
            className="h-8 object-contain"
          />
        </div>

        {/* Progress Steps */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup Progress</h3>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.id === currentStep 
                    ? 'bg-blue-50 border border-blue-200' 
                    : step.id < currentStep 
                      ? 'bg-green-50' 
                      : 'bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id === currentStep 
                    ? 'bg-blue-600 text-white'
                    : step.id < currentStep 
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.id < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    step.id === currentStep ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="p-6 border-t bg-gray-50">
          <div className="space-y-2 text-sm">
            <a href="#" className="block text-gray-600 hover:text-blue-600">Terms of Service</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">View Plans</a>
            <a href="#" className="block text-gray-600 hover:text-blue-600">Contact Support</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with Back Button */}
        {currentStep > 1 && currentStep < 5 && (
          <div className="bg-white border-b px-8 py-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 py-12">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
