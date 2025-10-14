import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { profileService } from "@/services/profileService";

interface DashboardTypeGuardProps {
  children: React.ReactNode;
  allowedDashboardTypes: number[]; // Array of allowed dashboard types
}

export const DashboardTypeGuard = ({
  children,
  allowedDashboardTypes,
}: DashboardTypeGuardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkDashboardType = async () => {
      try {
        // console.log("DashboardTypeGuard: Checking dashboard type", {
        //   currentPath: location.pathname,
        //   allowedDashboardTypes,
        // });

        const profile = await profileService.getUserProfile();
        // console.log("DashboardTypeGuard: User profile:", profile);
        // console.log(
        //   "DashboardTypeGuard: User dashboard type:",
        //   profile.dashboardType
        // );

        // Check if user's dashboard type is allowed
        if (!allowedDashboardTypes.includes(profile.dashboardType)) {
          // console.log("DashboardTypeGuard: Dashboard type not allowed, redirecting");
          setShouldRedirect(true);

          if (profile.dashboardType === 1) {
            setRedirectPath("/main-dashboard");
          } else if (profile.dashboardType === 2) {
            setRedirectPath("/module/geo-ranking");
          } else {
            setRedirectPath("/location-dashboard/default");
          }
        } else {
          // console.log(
          //   "DashboardTypeGuard: Dashboard type allowed, allowing access"
          // );
          setShouldRedirect(false);
        }
      } catch (error) {
        // console.error("DashboardTypeGuard: Failed to fetch profile:", error);
        // On error, don't redirect - let the user stay where they are
        setShouldRedirect(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkDashboardType();
  }, [location.pathname, allowedDashboardTypes]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Verifying dashboard access...</p>
        </div>
      </div>
    );
  }

  if (shouldRedirect && redirectPath) {
    // console.log("DashboardTypeGuard: Redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
