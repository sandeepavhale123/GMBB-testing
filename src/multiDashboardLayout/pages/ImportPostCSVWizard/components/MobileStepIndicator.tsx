import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { WizardStep } from "../types";

interface MobileStepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
}

export const MobileStepIndicator = React.memo<MobileStepIndicatorProps>(({ steps, currentStep }) => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSVWizard");

  return (
    <div className="lg:hidden border-b border-gray-200 p-4 bg-background">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {t("importPostCSVWizard.title")}
        </h3>
        <span className="text-sm text-muted-foreground">
          {t("importPostCSVWizard.stepCount", { currentStep })}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border transition-all">
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : currentStep === step.number ? (
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            {step.number < 4 && (
              <div className="w-4 h-0.5 bg-gray-200 mx-1"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

MobileStepIndicator.displayName = "MobileStepIndicator";
