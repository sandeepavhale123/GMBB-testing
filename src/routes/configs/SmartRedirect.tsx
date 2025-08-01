import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { profileService } from "@/services/profileService";

export const SmartRedirect = () => {
  const { isAuthenticated, isAuthLoading, shouldWaitForAuth } = useAuthRedux();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    console.log("SmartRedirect: Starting redirect logic", {
      isAuthLoading,
      shouldWaitForAuth,
      isAuthenticated
    });

    // Wait for auth to be determined
    if (isAuthLoading || shouldWaitForAuth) {
      console.log("SmartRedirect: Waiting for auth");
      return;
    }

    // If not authenticated, go to login
    if (!isAuthenticated) {
      console.log("SmartRedirect: Not authenticated, redirecting to login");
      setRedirectPath("/login");
      return;
    }

    // Check onboarding status (PRIORITY - must come first)
    const onboarding = Number(localStorage.getItem("onboarding"));
    console.log("SmartRedirect: Onboarding status:", onboarding);
    if (onboarding === 1) {
      console.log("SmartRedirect: Redirecting to onboarding");
      setRedirectPath("/onboarding");
      return;
    }

    // Try to restore from sessionStorage
    const savedPath = sessionStorage.getItem("post_refresh_path");
    const savedAt = sessionStorage.getItem("navigation_saved_at");
    console.log("SmartRedirect: Session storage check", { savedPath, savedAt });

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
        console.log("SmartRedirect: Saved path too old, clearing");
        sessionStorage.removeItem("post_refresh_path");
        sessionStorage.removeItem("scrollY");
        sessionStorage.removeItem("navigation_saved_at");
      }
    }

    // Fetch user profile to determine dashboard type
    console.log("SmartRedirect: Fetching profile to determine dashboard type");
    const fetchProfileAndRedirect = async () => {
      try {
        setIsLoadingProfile(true);
        const profile = await profileService.getUserProfile();
        console.log("SmartRedirect: Profile data:", profile);
        console.log("SmartRedirect: Dashboard type:", profile.dashboardType);
        
        if (profile.dashboardType === 1) {
          console.log("SmartRedirect: Redirecting to main-dashboard");
          setRedirectPath("/main-dashboard");
        } else {
          console.log("SmartRedirect: Redirecting to location-dashboard");
          // dashboardType === 0 or default case
          setRedirectPath("/location-dashboard/default");
        }
      } catch (error) {
        console.error("SmartRedirect: Failed to fetch profile:", error);
        // Fallback to location dashboard on error
        setRedirectPath("/location-dashboard/default");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileAndRedirect();
  }, [isAuthenticated, isAuthLoading, shouldWaitForAuth]);

  // Show loading while determining redirect
  if (isAuthLoading || shouldWaitForAuth || redirectPath === null || isLoadingProfile) {
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
