
import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

export const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isLoading, accessToken, user, hasAttemptedRefresh, isRefreshing } = useAuthRedux();
  
  console.log("ProtectedRoute - Auth state:", {
    isLoading,
    accessToken: !!accessToken,
    user: !!user,
    hasAttemptedRefresh,
    isRefreshing,
    hasRefreshToken: !!localStorage.getItem("refresh_token")
  });

  // If we have both accessToken and user, user is authenticated - render children
  if (accessToken && user) {
    console.log("ProtectedRoute - User authenticated, rendering children");
    return <>{children}</>;
  }

  // Show loading only when actively loading or refreshing
  if (isLoading || isRefreshing) {
    console.log("ProtectedRoute - Showing loading (actively loading/refreshing)");
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
    console.log("ProtectedRoute - Showing loading (waiting for refresh attempt)");
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  // User is not authenticated - redirect to login
  console.log("ProtectedRoute - User not authenticated, redirecting to login");
  return <Navigate to={redirectTo} replace />;
};
