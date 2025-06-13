
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
    businessType: '',
    goals: [],
    googleConnected: false,
    selectedListings: []
  });
  const navigate = useNavigate();

  const steps = [
    { 
      id: 1, 
      title: 'Business Information', 
      description: 'Enter your business details to get started' 
    },
    { 
      id: 2, 
      title: 'Define your goal', 
      description: 'Choose what you want to achieve with this setup' 
    },
    { 
      id: 3, 
      title: 'Connect google account', 
      description: 'Securely link your Google account for integration' 
    },
    { 
      id: 4, 
      title: 'Select listings', 
      description: 'Pick the Google listing you want to manage' 
    },
    { 
      id: 5, 
      title: 'Complete', 
      description: 'Setup complete!' 
    }
  ];

  const totalSteps = steps.length;

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
      {/* Left Sidebar - Fixed with Gradient */}
      <div className="hidden lg:flex w-80 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex-col fixed left-0 top-0 h-screen z-10">
        {/* Logo */}
        <div className="p-4 xl:p-6 border-b border-white/20">
          <img 
            src="https://member.gmbbriefcase.com/content/dist/assets/images/logo.png" 
            alt="GMB Briefcase Logo" 
            className="h-6 xl:h-8 object-contain brightness-0 invert"
          />
        </div>

        {/* Step Progress */}
        <div className="flex-1 p-4 xl:p-6">
          <div className="mb-6 xl:mb-8">
            <h3 className="text-base xl:text-lg font-semibold text-white mb-2">Setup Progress</h3>
            <p className="text-sm text-white/80">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="space-y-4 xl:space-y-6">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <div key={step.id} className="flex items-start gap-3 xl:gap-4">
                  {/* Step Circle */}
                  <div className={`w-8 h-8 xl:w-10 xl:h-10 rounded-full flex items-center justify-center text-sm xl:text-base font-semibold flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-white text-blue-600' 
                      : isCurrent 
                        ? 'bg-white text-blue-600'
                        : 'bg-white/20 text-white/60'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-3 w-3 xl:h-4 xl:w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className={`${
                    isCurrent ? 'text-white' : isCompleted ? 'text-white/90' : 'text-white/60'
                  }`}>
                    <h4 className={`font-medium text-sm xl:text-base mb-1 ${isCurrent ? 'font-semibold' : ''}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs xl:text-sm opacity-80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-700 p-3 sm:p-4 fixed top-0 left-0 z-20">
        <div className="flex items-center justify-between">
          <img 
            src="https://member.gmbbriefcase.com/content/dist/assets/images/logo.png" 
            alt="GMB Briefcase Logo" 
            className="h-5 sm:h-6 object-contain brightness-0 invert"
          />
          <div className="text-white text-xs sm:text-sm">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        {/* Mobile Step Progress */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            
            return (
              <div key={step.id} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                isCompleted 
                  ? 'bg-white text-blue-600' 
                  : isCurrent 
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 text-white/60'
              }`}>
                {isCompleted ? (
                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                ) : (
                  step.id
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-80 pt-20 sm:pt-24 lg:pt-0">
        {/* Header with Back Button */}
        {currentStep > 1 && currentStep < 5 && (
          <div className="bg-white border-b px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        )}

        {/* Step Content */}
        <div className="flex-1 py-4 sm:py-6 lg:py-8 xl:py-12">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
