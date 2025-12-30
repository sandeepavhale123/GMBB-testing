import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const VerifyPayment: React.FC = () => {
  const { t } = useI18nNamespace("pages/verifyPayment");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const sessionId = useQueryParams("session_id");
  const u = useQueryParams("u");
  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !u) {
        setStatus("error");
        setErrorMessage(t("verifyPayment.error.messages.invalidParams"));
        return;
      }
      // Clean up URL by removing query parameters
      window.history.replaceState({}, document.title, "/verify-payment");

      try {
        const response = await axiosInstance.post(
          `${import.meta.env.VITE_BASE_URL}/verify-subscription`,
          {
            sessionId: sessionId,
            clientId: u,
          }
        );

        if (response.data && response.status === 200) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(t("verifyPayment.error.messages.verificationFailed"));
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setErrorMessage(t("verifyPayment.error.messages.verificationFailed"));
      }
    };

    verifyPayment();
  }, [sessionId, u]);

  const handleTryAgain = () => {
    navigate("/settings/subscription");
  };

  const handleContinue = () => {
    navigate("/location-dashboard/default");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t("verifyPayment.loading.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              {t("verifyPayment.loading.description")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              {t("verifyPayment.success.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              {t("verifyPayment.success.description")}
            </p>
            <Button onClick={handleContinue} className="w-full">
              {t("verifyPayment.success.button")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            {t("verifyPayment.error.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">{errorMessage}</p>
          <div className="space-y-3">
            <Button onClick={handleTryAgain} className="w-full">
              {t("verifyPayment.error.buttonTryAgain")}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              {t("verifyPayment.error.buttonBackHome")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
