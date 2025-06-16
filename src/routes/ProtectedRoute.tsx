import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

export const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { isLoading, accessToken, user, hasAttemptedRefresh } = useAuthRedux();
  console.log(
    "value of isLoading, accessToken and user from protected route",
    isLoading,
    accessToken,
    user
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!accessToken || !user) {
    if (!hasAttemptedRefresh) {
      return <Navigate to={redirectTo} replace />;
    }
    // Still loading or waiting on refresh: show loader
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
