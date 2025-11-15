import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import BusinessInfoStep from "@/components/Onboarding/BusinessInfoStep";
import SelectGoalStep from "@/components/Onboarding/SelectGoalStep";
import ConnectGoogleStep from "@/components/Onboarding/ConnectGoogleStep";
import SelectListingsStep from "@/components/Onboarding/SelectListingsStep";
import CompletionStep from "@/components/Onboarding/CompletionStep";
import { useOnboarding } from "@/store/slices/onboarding/useOnboarding";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

import { dispatch } from "@/hooks/toast/reducer";

const Onboarding = () => {
  const {
    currentStep,
    formData,
    handleNext,
    handleBack,
    updateData,
    complete,
  } = useOnboarding();
  const { t } = useI18nNamespace("pages/onboarding");
  const navigate = useNavigate();
  const localOnboardingStep = localStorage.getItem("onboarding_current_step");
  if (localOnboardingStep === "6") {
    navigate("/location-dashboard/default");
  }
  const steps = [
    {
      id: 1,
      title: t("onboarding.steps.1.title"),
      description: t("onboarding.steps.1.description"),
    },
    {
      id: 2,
      title: t("onboarding.steps.2.title"),
      description: t("onboarding.steps.2.description"),
    },
    {
      id: 3,
      title: t("onboarding.steps.3.title"),
      description: t("onboarding.steps.3.description"),
    },
    {
      id: 4,
      title: t("onboarding.steps.4.title"),
      description: t("onboarding.steps.4.description"),
    },
    {
      id: 5,
      title: t("onboarding.steps.5.title"),
      description: t("onboarding.steps.5.description"),
    },
  ];

  const totalSteps = steps.length;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      handleNext();
    } else {
      complete();
      navigate("/");
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      handleBack();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessInfoStep
            formData={formData}
            updateFormData={updateData}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <SelectGoalStep
            formData={formData}
            updateFormData={updateData}
            onNext={handleNextStep}
          />
        );
      case 3:
        return <ConnectGoogleStep />;
      case 4:
        return (
          <SelectListingsStep
            formData={formData}
            updateFormData={updateData}
            onNext={handleNextStep}
          />
        );
      case 5:
        return <CompletionStep onComplete={handleNextStep} />;
      default:
        return (
          <BusinessInfoStep
            formData={formData}
            updateFormData={updateData}
            onNext={handleNextStep}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Left Sidebar - Fixed with Gradient */}
      <div className="hidden lg:flex w-80 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex-col fixed left-0 top-0 h-screen z-10">
        {/* Logo */}
        <div className="p-4 xl:p-6 border-b border-white/20">
          <img
            src="https://old.gmbbriefcase.com/content/dist/assets/images/dark-logo.png"
            alt="GMB Briefcase Logo"
            className="h-6 xl:h-8 object-contain brightness-0 invert"
          />
        </div>

        {/* Step Progress */}
        <div className="flex-1 p-4 xl:p-6 relative z-10">
          <div className="mb-6 xl:mb-8">
            <h3 className="text-base xl:text-lg font-semibold text-white mb-2">
              {t("onboarding.setup")}
            </h3>
            <p className="text-sm text-white/80">
              current step {currentStep}
              {t("onboarding.progress", { currentStep, totalSteps })}
              {/* Step {currentStep} of {totalSteps} */}
            </p>
          </div>

          <div className="space-y-4 xl:space-y-6">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div key={step.id} className="flex items-start gap-3 xl:gap-4">
                  {/* Step Circle */}
                  <div
                    className={`w-12 h-12 rounded flex items-center justify-center text-md xl:text-base font-semibold flex-shrink-0 ${
                      isCompleted
                        ? "bg-white text-blue-600"
                        : isCurrent
                        ? "bg-white text-blue-600"
                        : "bg-white/20 text-white/60"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3 xl:h-4 xl:w-4" />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Step Content */}
                  <div
                    className={`${
                      isCurrent
                        ? "text-white"
                        : isCompleted
                        ? "text-white/90"
                        : "text-white/60"
                    }`}
                  >
                    <h4
                      className={`font-medium text-md xl:text-base mb-1 ${
                        isCurrent ? "font-semibold" : ""
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm xl:text-sm opacity-80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative Background Image */}
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            left: "-100px",
            bottom: "-150px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            opacity: 0.05,
            backgroundImage:
              "url('https://member.gmbbriefcase.com/content/dist/assets/images/blue-light-2.png')",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-700 p-3 sm:p-4 fixed top-0 left-0 z-20">
        <div className="flex items-center justify-between">
          <img
            src="https://old.gmbbriefcase.com/content/dist/assets/images/dark-logo.png"
            alt="GMB Briefcase Logo"
            className="h-5 sm:h-6 object-contain brightness-0 invert"
          />
          <div className="text-white text-xs sm:text-sm">
            {t("onboarding.progress", { currentStep, totalSteps })}
            {/* Step {currentStep} of {totalSteps} */}
          </div>
        </div>

        {/* Mobile Step Progress */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isCompleted
                    ? "bg-white text-blue-600"
                    : isCurrent
                    ? "bg-white text-blue-600"
                    : "bg-white/20 text-white/60"
                }`}
              >
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
        {/* Back Button Header */}
        {currentStep > 1 && currentStep < 4 && (
          <div className="bg-white border-b px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
            <Button
              variant="outline"
              onClick={handleBackStep}
              size="sm"
              className="flex items-center gap-2 hover:bg-gray-50"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">{t("onboarding.back")}</span>
            </Button>
          </div>
        )}

        {/* Dynamic Step Content */}
        <div className="flex-1 py-4 sm:py-6 lg:py-8 xl:py-12">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
