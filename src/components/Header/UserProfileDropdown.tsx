import React from "react";
import { User, LogOut, Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useProfile } from "../../hooks/useProfile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface UserProfileDropdownProps {
  className?: string;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ className }) => {
  const { t } = useI18nNamespace("Header/userProfileDropdown");
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthRedux();
  const { profileData } = useProfile();

  const handleAccountSettings = () => {
    const isInMainDashboard = location.pathname.startsWith("/main-dashboard");
    if (isInMainDashboard) {
      navigate("/main-dashboard/settings");
    } else {
      navigate("/settings");
    }
  };

  const handleViewProfile = () => {
    const isDashboardType2 = profileData?.dashboardType === 2;
    const isInMainDashboard = location.pathname.startsWith("/main-dashboard");
    const isInModule = location.pathname.startsWith("/module/");
    const isInUtility= location.pathname.startsWith("/utility/");


    if (isDashboardType2) {
      navigate("/geo-ranking-dashboard/profile");
    } else if (isInMainDashboard || isInModule || isInUtility) {
      navigate("/main/profile");
    } else {
      navigate("/profile");
    }
  };

  // Helper function to check if user role should be restricted
  const shouldHideAccountSettings = () => {
    const userRole = profileData?.role?.toLowerCase();
    const isDashboardType2 = profileData?.dashboardType === 2;

    // Check if user is in multi-dashboard or any module
    const isInMultiDashboard = location.pathname.startsWith("/main-dashboard");
    const isInGeoRankingModule = location.pathname.startsWith("/module/geo-ranking");
    const isInLeadModule = location.pathname.startsWith("/module/lead");
    const isInSeoFixerModule = location.pathname.startsWith("/module/live-seo-fixer");

    return (
      userRole === "staff" ||
      userRole === "client" ||
      isDashboardType2 ||
      isInMultiDashboard ||
      isInGeoRankingModule ||
      isInLeadModule ||
      isInSeoFixerModule
    );
  };

  // Get user info from profile data
  const userName = profileData
    ? `${profileData.first_name} ${profileData.last_name}`
    : t("userProfileDropdown.defaultUserName");
  const userEmail = profileData?.username || t("userProfileDropdown.defaultUserEmail");
  const userInitials = profileData
    ? `${profileData.first_name?.charAt(0) || ""}${profileData.last_name?.charAt(0) || ""}`
    : "U";
  const userProfilePic = profileData?.profilePic || "/lovable-uploads/e82c6af8-dd5a-48b6-bc12-9663e5ab24eb.png";

  return (
    <div className="flex items-center gap-2 ml-1 sm:ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`p-0 rounded-full hover:bg-transparent ${className || ""}`}>
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer">
              <AvatarImage src={userProfilePic} alt="user-profile" />
              <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs">{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border">
          <div className="px-3 py-2 border-b">
            <p className="font-medium text-gray-900">{userName}</p>
            <p className="text-sm text-gray-500">
              {userEmail.length > 20 ? userEmail.slice(0, 19) + "..." : userEmail}
            </p>
          </div>
          <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
            <User className="w-4 h-4 mr-1" />
            {t("userProfileDropdown.viewProfile")}
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
            <LogOut className="w-4 h-4 mr-1" />
            {t("userProfileDropdown.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
