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
    (onboarding !== 1 ? "/location-dashboard/default" : "/onboarding");
  console.log("Result redirect.......", resultRedirect);
  const {
    isAuthenticated,
    isAuthLoading,
    shouldWaitForAuth,
    hasAttemptedRefresh,
    isInitialized,
  } = useAuthRedux();

  console.log("PublicRoute state:", {
    isAuthenticated,
    isAuthLoading,
    shouldWaitForAuth,
    hasAttemptedRefresh,
    isInitialized,
  });

  // Show loading while checking authentication status
  if (isAuthLoading || shouldWaitForAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only redirect authenticated users if we've completed all auth checks
  if (isInitialized && hasAttemptedRefresh && isAuthenticated) {
    console.log(
      "PublicRoute: Redirecting authenticated user to:",
      resultRedirect
    );
    return <Navigate to={resultRedirect} replace />;
  }

  // User is not authenticated or we're still checking, show the public page
  return <>{children}</>;
};
