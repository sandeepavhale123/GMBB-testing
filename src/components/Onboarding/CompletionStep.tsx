import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Sparkles,
  BarChart3,
  MessageSquare,
  Calendar,
  Users,
} from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CompletionStepProps {
  onComplete: () => void;
}

const CompletionStep = ({ onComplete }: CompletionStepProps) => {
  const { t } = useI18nNamespace("Onboarding/businessLocationStep");
  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-12">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("completionStep.welcomeTitle")}
        </h1>
        <p className="text-xl text-gray-600">
          {t("completionStep.welcomeDescription")}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="font-semibold text-blue-900">
            {t("completionStep.helpSection.title")}
          </h3>
        </div>
        <p className="text-blue-800 mb-4">
          {t("completionStep.helpSection.description")}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            asChild
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <a
              href="https://support.gmbbriefcase.com/help-center"
              target="_blank"
            >
              {t("completionStep.helpSection.buttons.helpCenter")}
            </a>
          </Button>
          <Button
            variant="outline"
            asChild
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <a href="https://calendly.com/shripad" target="_blank">
              {t("completionStep.helpSection.buttons.onboardingCall")}
            </a>
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Button onClick={onComplete} size="lg" className="px-12 py-4 text-lg">
          {t("completionStep.goToDashboardButton")}
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
