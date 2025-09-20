import React from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const { t } = useI18nNamespace("Onboarding/selectListingsStep");
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("welcomeStep.title")}
        </h1>
        <p className="text-xl text-gray-600">{t("welcomeStep.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("welcomeStep.cards.businessInfo.title")}
          </h3>
          <p className="text-gray-600 text-sm">
            {t("welcomeStep.cards.businessInfo.description")}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("welcomeStep.cards.locationDetails.title")}
          </h3>
          <p className="text-gray-600 text-sm">
            {t("welcomeStep.cards.locationDetails.description")}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("welcomeStep.cards.businessHours.title")}
          </h3>
          <p className="text-gray-600 text-sm">
            {t("welcomeStep.cards.businessHours.description")}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            {t("welcomeStep.cards.readyToGo.title")}
          </h3>
          <p className="text-gray-600 text-sm">
            {t("welcomeStep.cards.readyToGo.description")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">{t("welcomeStep.timeEstimate")}</p>
        <Button
          onClick={onNext}
          size="lg"
          className="w-full sm:w-auto px-8 py-3 text-lg"
        >
          {t("welcomeStep.buttonText")}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
