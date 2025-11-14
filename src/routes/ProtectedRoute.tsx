import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

export const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isLoading, accessToken, user, hasAttemptedRefresh, isRefreshing } =
    useAuthRedux();

  // If we have both accessToken and user, user is authenticated - render children
  if (accessToken && user) {
    return <>{children}</>;
  }

  // Show loading only when actively loading or refreshing
  if (isLoading || isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading only if we haven't attempted refresh and have a refresh token
  const hasRefreshToken = !!localStorage.getItem("refresh_token");
  if (!hasAttemptedRefresh && hasRefreshToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">
            Initializing authentication...
          </p>
        </div>
      </div>
    );
  }

  // User is not authenticated - redirect to login

  return <Navigate to={redirectTo} replace />;
};
