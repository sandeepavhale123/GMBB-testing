import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SegmentedToggle } from "./SegmentedToggle";
import { useProfile } from "@/hooks/useProfile";
import { changeDashboardMode } from "@/api/dashboardApi";
import { profileService } from "@/services/profileService";
import { useAppDispatch } from "@/hooks/useRedux";
import { fetchUserProfile } from "@/store/slices/profileSlice";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface DashboardModeSwitchProps {
  variant?: "light" | "dark";
}

export const DashboardModeSwitch: React.FC<DashboardModeSwitchProps> = ({ variant = "dark" }) => {
  const { t } = useI18nNamespace("MultidashboardComponent/header");
  const { profileData } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Current state: checked = multi (1), unchecked = single (0)
  const isMultiMode = profileData?.dashboardType === 1;
  
  // Text color based on variant
  const textColorClass = variant === "light" ? "text-gray-900/80" : "text-white/80";

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

  // Only show to admin users - must be after all hooks
  const isAdmin = profileData?.role?.toLowerCase() === "admin";
  if (!isAdmin) return null;

  return (
    <div className="hidden md:flex items-center gap-2 px-2">
      <label className={`text-xs font-medium ${textColorClass}`}>Dashboard Mode :</label>
      <SegmentedToggle
        isActive={isMultiMode}
        onToggle={handleToggle}
        disabled={isLoading}
        leftLabel={t("dashboardMode.single")}
        rightLabel={t("dashboardMode.bulk")}
        leftTooltip="Single Listing Dashboard"
        rightTooltip="Bulk Listing Dashboard"
      />
    </div>
  );
};

export default DashboardModeSwitch;

