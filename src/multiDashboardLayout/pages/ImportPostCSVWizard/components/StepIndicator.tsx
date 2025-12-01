import React from "react";
import { Check } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { WizardStep } from "../types";

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
}

export const StepIndicator = React.memo<StepIndicatorProps>(({ steps, currentStep }) => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSVWizard");

  return (
    <div className="w-64 border-r border-gray-200 p-6 hidden lg:block min-h-[80vh]">
      <h3 className="text-lg font-semibold mb-6">
        {t("importPostCSVWizard.title")}
      </h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-center gap-3 bg-gray-50 p-3"
          >
            <div className="">
              {step.completed ? (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-success">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : currentStep === step.number ? (
                <div className="w-6 h-6 rounded-full bg-blue-400"></div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                step.completed || currentStep === step.number
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

StepIndicator.displayName = "StepIndicator";
