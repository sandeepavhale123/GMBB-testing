import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { profileService } from "@/services/profileService";

export const SmartRedirect = () => {
  const { isAuthenticated, isAuthLoading, shouldWaitForAuth } = useAuthRedux();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

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

    // Check onboarding status (PRIORITY - must come first)
    const onboarding = Number(localStorage.getItem("onboarding"));

    if (onboarding === 1) {
      setRedirectPath("/onboarding");
      return;
    }

    // Check if user just logged in
    const justLoggedIn = sessionStorage.getItem("just_logged_in");

    // Only apply dashboardType logic if user just logged in
    if (justLoggedIn) {
      sessionStorage.removeItem("just_logged_in"); // Clear the flag

      // Clear any old session storage to prevent conflicts
      sessionStorage.removeItem("post_refresh_path");
      sessionStorage.removeItem("navigation_saved_at");
      sessionStorage.removeItem("scrollY");

      // Fetch user profile to determine dashboard type
      const fetchProfileAndRedirect = async () => {
        try {
          setIsLoadingProfile(true);
          const profile = await profileService.getUserProfile();

          if (profile.dashboardType === 1) {
            setRedirectPath("/main-dashboard");
          } else if (profile.dashboardType === 2) {
            setRedirectPath("/module/geo-ranking");
          } else {
            // dashboardType === 0 or default case
            setRedirectPath("/location-dashboard/default");
          }
        } catch (error) {
          // console.error("SmartRedirect: Failed to fetch profile:", error);
          // Fallback to location dashboard on error
          setRedirectPath("/location-dashboard/default");
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfileAndRedirect();
      return;
    }

    // Try to restore from sessionStorage (only if user didn't just log in)
    const savedPath = sessionStorage.getItem("post_refresh_path");
    const savedAt = sessionStorage.getItem("navigation_saved_at");

    if (savedPath && savedAt) {
      // Check if the saved navigation state is not too old (within 5 minutes)
      const savedTimestamp = parseInt(savedAt, 10);
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

      if (savedTimestamp > fiveMinutesAgo) {
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
        sessionStorage.removeItem("post_refresh_path");
        sessionStorage.removeItem("scrollY");
        sessionStorage.removeItem("navigation_saved_at");
      }
    }

    // Default fallback - allow free navigation

    // setRedirectPath("/location-dashboard/default");

    // Default fallback - allow free navigation based on dashboardType
    const fetchProfileForFallback = async () => {
      try {
        setIsLoadingProfile(true);
        const profile = await profileService.getUserProfile();

        if (profile.dashboardType === 1) {
          setRedirectPath("/main-dashboard");
        } else {
          setRedirectPath("/location-dashboard/default");
        }
      } catch (error) {
        // console.error(
        //   "SmartRedirect: Failed to fetch profile in fallback:",
        //   error
        // );
        // Fallback to location dashboard on error
        setRedirectPath("/location-dashboard/default");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileForFallback();
  }, [isAuthenticated, isAuthLoading, shouldWaitForAuth]);

  // Show loading while determining redirect
  if (
    isAuthLoading ||
    shouldWaitForAuth ||
    redirectPath === null ||
    isLoadingProfile
  ) {
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
