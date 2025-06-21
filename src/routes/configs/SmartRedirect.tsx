import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

export const SmartRedirect = () => {
  const { isAuthenticated, isAuthLoading, shouldWaitForAuth } = useAuthRedux();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Wait for auth to be determined
    if (isAuthLoading || shouldWaitForAuth) {
      return;
    }

    // If not authenticated, go to login
    if (!isAuthenticated) {
      setRedirectPath("/login");
      return;
    }

    // Check onboarding status
    const onboarding = Number(localStorage.getItem("onboarding"));
    if (onboarding === 1) {
      setRedirectPath("/onboarding");
      return;
    }

    // Try to restore from sessionStorage
    const savedPath = sessionStorage.getItem("post_refresh_path");
    const savedAt = sessionStorage.getItem("navigation_saved_at");

    console.log("SmartRedirect: Checking saved navigation state:", {
      savedPath,
      savedAt,
    });

    if (savedPath && savedAt) {
      // Check if the saved navigation state is not too old (within 5 minutes)
      const savedTimestamp = parseInt(savedAt, 10);
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

      if (savedTimestamp > fiveMinutesAgo) {
        console.log("SmartRedirect: Using saved path:", savedPath);

        // Clear the stored path to prevent loops
        sessionStorage.removeItem("post_refresh_path");
        sessionStorage.removeItem("navigation_saved_at");

        // Restore scroll position after navigation
        const scrollY = sessionStorage.getItem("scrollY");
        if (scrollY) {
          sessionStorage.removeItem("scrollY");
          setTimeout(() => {
            window.scrollTo(0, parseInt(scrollY, 10));
          }, 100);
        }

        setRedirectPath(savedPath);
        return;
      } else {
        console.log(
          "SmartRedirect: Saved navigation state is too old, clearing it"
        );
        sessionStorage.removeItem("post_refresh_path");
        sessionStorage.removeItem("scrollY");
        sessionStorage.removeItem("navigation_saved_at");
      }
    }

    // Default to dashboard if no saved path
    console.log("SmartRedirect: No valid saved path, defaulting to dashboard");
    setRedirectPath("/location-dashboard/default");
  }, [isAuthenticated, isAuthLoading, shouldWaitForAuth]);

  // Show loading while determining redirect
  if (isAuthLoading || shouldWaitForAuth || redirectPath === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">
            Loading... from smart redirect
          </p>
        </div>
      </div>
    );
  }

  return <Navigate to={redirectPath} replace />;
};
