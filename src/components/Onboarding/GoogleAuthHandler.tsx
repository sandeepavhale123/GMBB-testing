import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import { setAccessToken } from "@/store/slices/auth/authSlice";
import { useOnboarding } from "@/store/slices/onboarding/useOnboarding";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GoogleAuthHandler = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const {
    oauthParams,
    clearOauthParameters,
    markOauthProcessed,
    goToStep,
    setGoogleBusinessListings,
  } = useOnboarding();

  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const code = oauthParams.code;

      if (
        !code ||
        oauthParams.processed ||
        isProcessingRef.current ||
        sessionStorage.getItem(`google_oauth_handled_${code}`)
      ) {
        return;
      }

      isProcessingRef.current = true;
      sessionStorage.setItem(`google_oauth_handled_${code}`, "true");

      try {
        const localaccessToken = localStorage.getItem("access_token");

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/google-auth?code=${code}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localaccessToken}`,
            },
          }
        );
        const data = await response.json();
        // console.log("response from auth", data);

        if (!response.ok) {
          toast({
            title: "Google Auth Failed",
            description: data.message || "An unknown error occurred.",
            variant: "destructive",
          });
        }

        if (data.data) {
          setGoogleBusinessListings(data.data);
        }
        toast({
          title: "Google Auth Succeeded",
          description: data.message,
        });

        dispatch(setAccessToken(localaccessToken || ""));

        markOauthProcessed();
        clearOauthParameters();

        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.toString());

        goToStep(4);
      } catch (error: any) {
        // console.log("data in error", error.json());

        clearOauthParameters();
        navigate("/login");
      } finally {
        isProcessingRef.current = false;
      }
    };

    handleGoogleRedirect();
  }, [oauthParams.code]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-lg">Authenticating with Google...</p>
    </div>
  );
};

export default GoogleAuthHandler;
