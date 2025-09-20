import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SuccessAnimation } from "./SuccessAnimation";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const SuccessContent = () => {
  const { t } = useI18nNamespace("Signup/signupForm");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "general";

  const getSuccessMessage = (type: string) => {
    switch (type) {
      case "password-reset":
        return {
          title: t("successContent.messages.password-reset.title"),
          description: t("successContent.messages.password-reset.description"),
        };
      case "payment":
        return {
          title: t("successContent.messages.payment.title"),
          description: t("successContent.messages.payment.description"),
        };
      case "profile-update":
        return {
          title: t("successContent.messages.profile-update.title"),
          description: t("successContent.messages.profile-update.description"),
        };
      case "verification":
        return {
          title: t("successContent.messages.verification.title"),
          description: t("successContent.messages.verification.description"),
        };
      default:
        return {
          title: t("successContent.messages.general.title"),
          description: t("successContent.messages.general.description"),
        };
    }
  };

  const { title, description } = getSuccessMessage(type);

  const handleGoToDashboard = () => {
    navigate("/location-dashboard/default");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };
  const redirectCondition = type !== "payment" && type !== "password-reset";
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center pb-4">
          <SuccessAnimation />
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <h1
              className="text-2xl font-bold text-green-800 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              {title}
            </h1>
            <p
              className="text-gray-600 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
            >
              {description}
            </p>
          </div>

          <div
            className="space-y-3 animate-fade-in"
            style={{ animationDelay: "0.9s" }}
          >
            {type === "password-reset" ? (
              <Button
                onClick={handleGoToLogin}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {t("successContent.buttons.goToLogin")}
              </Button>
            ) : (
              <Button
                onClick={handleGoToDashboard}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {t("successContent.buttons.goToDashboard")}
              </Button>
            )}

            {redirectCondition && (
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="w-full"
              >
                {t("successContent.buttons.goBack")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
