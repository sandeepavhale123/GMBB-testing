import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = "/login" }: ProtectedRouteProps) => {
  const { isLoading, accessToken, user, hasAttemptedRefresh, isRefreshing } =
    useAuthRedux();
  
  // Initialize Supabase session after GMBBriefcase auth
  const { 
    isLoading: isSupabaseLoading, 
    isInitialized: isSupabaseInitialized,
    error: supabaseError,
    retry: retrySupabaseSession
  } = useSupabaseSession();

  // If we have both accessToken and user, check Supabase session
  if (accessToken && user) {
    // Wait for Supabase session to initialize
    if (isSupabaseLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Initializing session...</p>
          </div>
        </div>
      );
    }

    // Show error state with retry option if Supabase session failed
    if (supabaseError && !isSupabaseInitialized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4 max-w-md text-center px-4">
            <div className="text-destructive text-lg font-medium">
              Failed to initialize session
            </div>
            <p className="text-muted-foreground text-sm">{supabaseError}</p>
            <button
              onClick={retrySupabaseSession}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Supabase session ready, render children
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
