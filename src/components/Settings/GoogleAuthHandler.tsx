import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
// Global flag to prevent duplicate processing across component instances
let isProcessingGlobally = false;

const GoogleAuthHandler = () => {
  const { t } = useI18nNamespace("Settings/googleAuthHandler");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  // Get the code from URL parameters
  const urlParams = new URLSearchParams(location.search);
  const code = urlParams.get("code");

  useEffect(() => {
    // Prevent duplicate processing globally and in this component instance
    if (!code || hasProcessed.current || isProcessing || isProcessingGlobally) {
      if (!code) {
        navigate("/main-dashboard/settings/google-account", { replace: true });
      }
      return;
    }

    hasProcessed.current = true;
    isProcessingGlobally = true;
    setIsProcessing(true);

    const handleGoogleCallback = async () => {
      try {
        const localAccessToken = localStorage.getItem("access_token");
        if (!localAccessToken) {
          throw new Error(t("googleAuthHandler.errors.noAccessToken"));
        }

        // Call Google auth endpoint with the code
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/google-auth/?code=${code}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          const message =
            responseData.message ||
            responseData.error ||
            t("googleAuthHandler.errors.failedAuth");
          throw new Error(message);
        }

        // Extract accountId from the nested data structure
        const accountId = responseData.data?.accountId;

        if (!accountId) {
          throw new Error("No account ID received from Google authentication");
        }
        toast({
          title: t("googleAuthHandler.toast.success.title"),
          description: t("googleAuthHandler.toast.success.description"),
        });

        // ✅ Decide where to go first
        const oauthOrigin = localStorage.getItem("oauth_origin");

        // ✅ Clear before navigating (prevents re-runs)
        localStorage.removeItem("oauth_origin");

        // ✅ Clean up URL params before navigate
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.toString());

        // ✅ Navigate once
        if (oauthOrigin === "multi") {
          navigate(`/main-dashboard/settings/listings/${accountId}`, {
            replace: true,
          });
        } else {
          navigate(`/settings/listings/${accountId}`, { replace: true });
        }
      } catch (error) {
        // console.error("GoogleAuthHandler: Authentication error", error);

        const errorMessage =
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : t("googleAuthHandler.toast.error.description");
        setError(errorMessage);

        toast({
          title: t("googleAuthHandler.toast.error.title"),
          description: errorMessage,
          variant: "destructive",
        });

        // Clean up URL parameters
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.toString());

        const oauthOrigin = localStorage.getItem("oauth_origin");
        localStorage.removeItem("oauth_origin");

        if (oauthOrigin === "multi") {
          navigate("/main-dashboard/settings/google-account", {
            replace: true,
          });
        } else {
          navigate("/settings/google-account", { replace: true });
        }

        // Don't navigate immediately if there's an error - let user see the error state
      } finally {
        setIsProcessing(false);
        isProcessingGlobally = false;
      }
    };

    handleGoogleCallback();
  }, [code, navigate, toast, isProcessing]);

  // Show error state if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md mx-auto text-center shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("googleAuthHandler.errorState.title")}
          </h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <Button
            onClick={() => {
              const oauthOrigin = localStorage.getItem("oauth_origin");
              if (oauthOrigin === "multi") {
                navigate("/main-dashboard/settings/google-account", {
                  replace: true,
                });
              } else {
                navigate("/settings/google-account", { replace: true });
              }
              localStorage.removeItem("oauth_origin");
            }}
            className="w-full"
          >
            {t("googleAuthHandler.errorState.button")}
          </Button>
        </Card>
      </div>
    );
  }

  // Show loading state while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 max-w-md mx-auto text-center shadow-lg">
        <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("googleAuthHandler.loadingState.title")}
        </h3>
        <p className="text-gray-600 text-sm">
          {t("googleAuthHandler.loadingState.description")}
        </p>
        <div className="mt-4 text-xs text-gray-500">
          {t("googleAuthHandler.loadingState.note")}
        </div>
      </Card>
    </div>
  );
};

export default GoogleAuthHandler;
