import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import { setAccessToken, setUser } from "@/store/slices/auth/authSlice";
import { useOnboarding } from "@/store/slices/onboarding/useOnboarding";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const code = oauthParams.code;

      console.log("code from Redux state .....", code);
      console.log("oauthparams", oauthParams);

      if (!code) {
        console.error("No code found in Redux state");
        navigate("/login");
        return;
      }

      try {
        const localaccessToken = localStorage.getItem("access_token");
        const userID = localStorage.getItem("userId");
        const user = localStorage.getItem("user");
        const refreshToken = localStorage.getItem("refresh_token");

        console.log("inside GoogleAuth try block at fetch request");
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/google-auth?code=${code}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localaccessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to authenticate with Google");
        }

        const data = await response.json();
        console.log("OAuth success:", data);

        // Store Google Business Profile data in Redux
        if (data.data) {
          setGoogleBusinessListings(data.data);
        }

        // ✅ Store in Redux
        console.log(
          "access, refresh, user, userid",
          localaccessToken,
          refreshToken,
          user,
          userID
        );
        dispatch(setAccessToken(localaccessToken));
        // dispatch(setUser(user));

        // ✅ Set processed after successful login
        markOauthProcessed();

        // Clear OAuth parameters from Redux after successful authentication
        clearOauthParameters();

        console.log("clearoauth", oauthParams);
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        window.history.replaceState({}, document.title, url.toString());

        // ✅ Move to step 4 in onboarding flow
        goToStep(4);
      } catch (error) {
        console.error("Google OAuth handling failed:", error);
        clearOauthParameters();
        navigate("/login");
      }
    };

    if (oauthParams.code) {
      handleGoogleRedirect();
    }
  }, [clearOauthParameters, markOauthProcessed]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-lg">Authenticating with Google...</p>
    </div>
  );
};

export default GoogleAuthHandler;
