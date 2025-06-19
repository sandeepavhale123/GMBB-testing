
import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute = ({
  children,
  redirectTo = "/location-dashboard/default",
}: PublicRouteProps) => {
  const {
    isLoading,
    accessToken,
    user,
    hasAttemptedRefresh,
    isInitialized,
    isRefreshing,
  } = useAuthRedux();

  console.log("PublicRoute state:", {
    isLoading,
    hasAuth: !!(accessToken && user),
    hasAttemptedRefresh,
    isInitialized,
    isRefreshing,
  });

  // Show loading while checking authentication status
  if (
    isLoading ||
    !isInitialized ||
    isRefreshing ||
    (!hasAttemptedRefresh && sessionStorage.getItem("refresh_token"))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect them away from public pages
  if (accessToken && user) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is not authenticated, show the public page
  return <>{children}</>;
};
