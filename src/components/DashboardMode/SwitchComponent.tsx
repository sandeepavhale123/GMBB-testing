import React, { useState, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";
import { dashboardApi } from "@/api/dashboardApi";
import { profileService } from "@/services/profileService";
import { useAppDispatch } from "@/hooks/useRedux";
import { fetchUserProfile } from "@/store/slices/profileSlice";
import { toast } from "@/hooks/use-toast";

const SINGLE_DASHBOARD_PREFIXES = [
  "/location-dashboard",
  "/posts",
  "/media",
  "/gallery",
  "/insights",
  "/keywords",
  "/geo-ranking",
  "/citation",
  "/reviews",
  "/qa",
  "/reports",
  "/business-info",
  "/ai-tasks",
];

const MULTI_DASHBOARD_PREFIXES = ["/main-dashboard", "/main"];

export const DashboardModeSwitch: React.FC = memo(() => {
  const { profileData } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Current state: checked = multi (1), unchecked = single (0)
  const isMultiMode = profileData?.dashboardType === 1;

  const handleToggle = useCallback(
    async (checked: boolean) => {
      const newDashboardType = checked ? 1 : 0;

      // Prevent toggle if already in requested mode
      if (profileData?.dashboardType === newDashboardType) return;

      setIsLoading(true);

      try {
        const response = await dashboardApi.changeDashboardMode({
          dashboardType: newDashboardType,
        });

        // Show success toast with API message
        toast({
          title: "Success",
          description:
            response.message || "Dashboard mode changed successfully",
        });

        // Clear profile cache and refresh
        await profileService.refreshUserProfile();
        dispatch(fetchUserProfile());

        // Determine current dashboard context
        const isOnSingleDashboard = SINGLE_DASHBOARD_PREFIXES.some((prefix) =>
          location.pathname.startsWith(prefix)
        );
        const isOnMultiDashboard = MULTI_DASHBOARD_PREFIXES.some((prefix) =>
          location.pathname.startsWith(prefix)
        );

        // Navigation logic
        if (newDashboardType === 1 && isOnSingleDashboard) {
          navigate("/main-dashboard");
        } else if (newDashboardType === 0 && isOnMultiDashboard) {
          navigate("/location-dashboard/default");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to change dashboard mode",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [profileData?.dashboardType, location.pathname, navigate, dispatch]
  );

  return (
    <div className="flex items-center gap-2 px-2">
      <span className="text-xs text-foreground/80 hidden md:block">Multi</span>
      <Switch
        checked={isMultiMode}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
      />
      <span className="text-xs text-foreground/80 hidden md:block">Single</span>
    </div>
  );
});

DashboardModeSwitch.displayName = "DashboardModeSwitch";

export default DashboardModeSwitch;
