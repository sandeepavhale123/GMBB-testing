
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
      <div className="w-80 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex flex-col fixed left-0 top-0 h-screen z-10">
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <img 
            src="https://member.gmbbriefcase.com/content/dist/assets/images/logo.png" 
            alt="GMB Briefcase Logo" 
            className="h-8 object-contain brightness-0 invert"
          />
        </div>

        {/* Timeline Progress Steps */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">Setup Progress</h3>
            <p className="text-sm text-white/80">
              Step {currentStep} of {totalSteps}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/20"></div>
            
            {/* Animated progress line */}
            <div 
              className="absolute left-4 top-0 w-0.5 bg-white transition-all duration-700 ease-out"
              style={{ height: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>

            <div className="space-y-6">
              {steps.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isUpcoming = step.id > currentStep;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-4 relative transition-all duration-500 ${
                      isCurrent ? 'animate-fade-in' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 z-10 ${
                      isCompleted 
                        ? 'bg-white text-blue-600 scale-110' 
                        : isCurrent 
                          ? 'bg-white text-blue-600 scale-125 animate-pulse'
                          : 'bg-white/20 text-white/60 scale-100'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    
                    {/* Step content */}
                    <div className={`transition-all duration-300 ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-white/90' : 'text-white/60'
                    }`}>
                      <h4 className={`font-medium ${isCurrent ? 'font-semibold' : ''}`}>
                        {step.title}
                      </h4>
                      <p className="text-xs opacity-80">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Offset for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-80">
        {/* Header with Back Button */}
        {currentStep > 1 && currentStep < 5 && (
          <div className="bg-white border-b px-8 py-4 animate-fade-in">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
          </div>
        )}

        {/* Step Content with Animation */}
        <div className="flex-1 py-12 animate-fade-in">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
