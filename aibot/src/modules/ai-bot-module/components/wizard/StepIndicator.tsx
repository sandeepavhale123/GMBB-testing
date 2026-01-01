import React from 'react';
import { Check } from 'lucide-react';
import { WizardStep } from '../../types';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-64 border-r border-border p-6 hidden lg:block min-h-[70vh]">
      <h3 className="text-lg font-semibold mb-6">Create AI Bot</h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg transition-colors',
              currentStep === step.number ? 'bg-primary/10' : 'bg-muted/50'
            )}
          >
            <div>
              {step.completed ? (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              ) : currentStep === step.number ? (
                <div className="w-6 h-6 rounded-full bg-primary" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted-foreground/30" />
              )}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                step.completed || currentStep === step.number ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
