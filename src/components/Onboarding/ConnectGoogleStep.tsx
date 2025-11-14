import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "@/store/slices/onboarding/useOnboarding";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleAuthHandler from "./GoogleAuthHandler";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const ConnectGoogleStep = () => {
  const { t } = useI18nNamespace("Onboarding/connectGoogleStep");
  const { toast } = useToast();
  const { oauthParams, setOauthParameters } = useOnboarding();
  const permissions = t("connectGoogleStep.permissions", {
    returnObjects: true,
  });
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const permissionsArray = Array.isArray(permissions) ? permissions : [];

  const localdomain = window.location.host;
  const { search } = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const code = searchParams.get("code");

    if (!code) return;

    const alreadyHandled = sessionStorage.getItem(
      `google_oauth_handled_${code}`
    );

    if (
      code &&
      !oauthParams.code &&
      !oauthParams.processed &&
      !alreadyHandled
    ) {
      setOauthParameters(code, searchParams, false);
    }
  }, [search, oauthParams.code, oauthParams.processed, setOauthParameters]);

  if (oauthParams.code && !oauthParams.processed) {
    return <GoogleAuthHandler />;
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-6">
      <Card className="p-4 sm:p-6 lg:p-8 border-2 border-gray-200">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            {t("connectGoogleStep.title")}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {t("connectGoogleStep.description")}
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <a href={`${BASE_URL}/google-auth?domain=${localdomain}/onboarding`}>
            <Button
              variant="outline"
              className="w-full h-10 text-sm sm:text-base"
            >
              <>
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                />
                {t("connectGoogleStep.button")}
              </>
            </Button>
          </a>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {/* {[
            "View and manage your business information",
            "Read and respond to customer reviews",
            "Create and manage posts",
            "Access performance insights",
          ].map((text, index) => (
            <div
              key={index}
              className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-lg"
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
              <span className="text-sm sm:text-base text-green-800">
                {text}
              </span>
            </div>
          ))} */}

          {permissionsArray.map((text, index) => (
            <div key={index} className="flex items-center ...">
              <CheckCircle className="..." />
              <span className="...">{text}</span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm sm:text-base text-blue-900 mb-1">
                {t("connectGoogleStep.nextSteps.title")}
              </h4>
              <p className="text-xs sm:text-sm text-blue-800">
                {t("connectGoogleStep.nextSteps.description")}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center mt-4 sm:mt-6">
        <p className="text-xs sm:text-sm text-gray-500">
          {t("connectGoogleStep.legal.agreement")}
          <a
            href="https://gmbbriefcase.com/payment-refund/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t("connectGoogleStep.legal.termsOfService")}
          </a>{" "}
          and{" "}
          <a
            href="https://gmbbriefcase.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t("connectGoogleStep.legal.privacyPolicy")}
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConnectGoogleStep;
