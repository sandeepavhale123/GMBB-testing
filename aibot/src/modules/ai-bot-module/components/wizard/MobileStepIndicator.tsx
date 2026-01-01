import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { WizardStep } from '../../types';

interface MobileStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
}

export const MobileStepIndicator: React.FC<MobileStepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="lg:hidden border-b border-border p-4 bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Create AI Bot</h3>
        <span className="text-sm text-muted-foreground">Step {currentStep} of {steps.length}</span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border transition-all">
              {step.completed ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : currentStep === step.number ? (
                <div className="w-3 h-3 rounded-full bg-primary" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            {step.number < steps.length && <div className="w-8 h-0.5 bg-border mx-1" />}
          </div>
        ))}
      </div>
    </div>
  );
};
