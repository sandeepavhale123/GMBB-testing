import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LoaderCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const VerifySignupPage = () => {
  const { t } = useI18nNamespace("pages/verifySignupPage");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = useQueryParams("session_id");
  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      toast({
        title: t("verifySignupPage.error.toast.title"),
        description: t("verifySignupPage.error.toast.missingSessionId"),
        variant: "destructive",
      });
      return;
    }

    const verifySignup = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/verify-signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        if (!res.ok) {
          throw new Error("Verification failed");
        }

        const data = await res.json();
        setStatus("success");

        toast({
          title: t("verifySignupPage.toast.title"),
          description: data.message,
        });

        // Remove query params from URL after 2 seconds
        // setTimeout(() => {
        //   searchParams.delete("session_id");
        //   setSearchParams(searchParams, { replace: true });
        // }, 2000);
      } catch (err) {
        console.error("❌ Verification failed:", err);
        setStatus("error");

        toast({
          title: t("verifySignupPage.error.toast.title"),
          description: err.message || err?.response?.data?.message,
          variant: "destructive",
        });
      }
    };

    verifySignup();
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center space-y-4">
        {status === "loading" && (
          <>
            <LoaderCircle
              className="animate-spin mx-auto text-blue-500"
              size={48}
            />
            <p className="text-gray-700 text-lg">
              {t("verifySignupPage.loading.message")}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="text-green-500 mx-auto" size={48} />
            <p className="text-lg font-semibold text-green-700">
              {t("verifySignupPage.success.title")}
            </p>
            <p className="text-gray-600">
              {t("verifySignupPage.success.description")}
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              {t("verifySignupPage.success.buttonGoToLogin")}
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="text-red-500 mx-auto" size={48} />
            <p className="text-lg font-semibold text-red-700">
              {t("verifySignupPage.error.title")}
            </p>
            <p className="text-gray-600">
              {t("verifySignupPage.error.description")}
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-4 bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700"
            >
              {t("verifySignupPage.error.buttonBackToSignup")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
