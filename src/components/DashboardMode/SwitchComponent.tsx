import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/useProfile";
import { changeDashboardMode } from "@/api/dashboardApi";
import { profileService } from "@/services/profileService";
import { useAppDispatch } from "@/hooks/useRedux";
import { fetchUserProfile } from "@/store/slices/profileSlice";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const DashboardModeSwitch: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardComponent/header");
  const { profileData } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Current state: checked = multi (1), unchecked = single (0)
  const isMultiMode = profileData?.dashboardType === 1;

  // Determine current dashboard context
  const singleDashboardPrefixes = [
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

  const multiDashboardPrefixes = ["/main-dashboard", "/main"];

  const isOnSingleDashboard = singleDashboardPrefixes.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  const isOnMultiDashboard = multiDashboardPrefixes.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  const handleToggle = useCallback(
    async (checked: boolean) => {
      const newDashboardType = checked ? 1 : 0;

      // Prevent toggle if already in requested mode
      if (profileData?.dashboardType === newDashboardType) return;

      setIsLoading(true);

      try {
        const response = await changeDashboardMode({
          dashboardType: newDashboardType,
        });

        // Show success toast with API message
        toast({
          title: "Success",
          description: response.message || "Dashboard mode changed successfully",
        });

        // Clear profile cache and refresh
        await profileService.refreshUserProfile();
        dispatch(fetchUserProfile());

        // Navigation logic
        if (newDashboardType === 1 && isOnSingleDashboard) {
          // Switching to multi while on single dashboard → navigate to multi
          navigate("/main-dashboard");
        } else if (newDashboardType === 0 && isOnMultiDashboard) {
          // Switching to single while on multi dashboard → navigate to single
          navigate("/location-dashboard/default");
        }
        // Otherwise, stay on current page
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
    [
      profileData?.dashboardType,
      isOnSingleDashboard,
      isOnMultiDashboard,
      navigate,
      dispatch,
    ]
  );

  return (
    <div className="flex items-center gap-2 px-2">
      <span className="text-xs text-white/80 hidden md:block">
        {t("dashboardMode.multi")}
      </span>
      <Switch
        checked={isMultiMode}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-500"
      />
      <span className="text-xs text-white/80 hidden md:block">
        {t("dashboardMode.single")}
      </span>
    </div>
  );
};

export default DashboardModeSwitch;

