import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({ children, redirectTo }: PublicRouteProps) => {
  // Dynamically fetch onboarding from localStorage
  const onboarding = Number(localStorage.getItem("onboarding"));
  const resultRedirect =
    redirectTo ||
    (onboarding !== 1 ? "/dashboard" : "/onboarding");

  const {
    isAuthenticated,
    isAuthLoading,
    shouldWaitForAuth,
    hasAttemptedRefresh,
    isInitialized,
  } = useAuthRedux();

  // Show loading while checking authentication status
  if (isAuthLoading || shouldWaitForAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading... </p>
        </div>
      </div>
    );
  }

  // Only redirect authenticated users if we've completed all auth checks
  if (isInitialized && hasAttemptedRefresh && isAuthenticated) {
    // Check if there's a saved path in sessionStorage first
    const savedPath = sessionStorage.getItem("post_refresh_path");
    const savedAt = sessionStorage.getItem("navigation_saved_at");

    let resultRedirect = redirectTo;

    if (!resultRedirect) {
      // Check for saved navigation state that's not too old (within 5 minutes)
      if (savedPath && savedAt) {
        const savedTimestamp = parseInt(savedAt, 10);
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

        if (savedTimestamp > fiveMinutesAgo) {
          resultRedirect = savedPath;

          // Clear the saved state to prevent loops
          sessionStorage.removeItem("post_refresh_path");
          sessionStorage.removeItem("navigation_saved_at");

          // Restore scroll position
          const scrollY = sessionStorage.getItem("scrollY");
          if (scrollY) {
            sessionStorage.removeItem("scrollY");
            setTimeout(() => {
              window.scrollTo(0, parseInt(scrollY, 10));
            }, 100);
          }
        } else {
          sessionStorage.removeItem("post_refresh_path");
          sessionStorage.removeItem("scrollY");
          sessionStorage.removeItem("navigation_saved_at");
        }
      }

      // If no saved path or it was too old, use default
      if (!resultRedirect) {
        resultRedirect =
          onboarding !== 1 ? "/dashboard" : "/onboarding";
      }
    }

    return <Navigate to={resultRedirect} replace />;
  }

  // User is not authenticated or we're still checking, show the public page
  return <>{children}</>;
};
