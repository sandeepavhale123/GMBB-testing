import React from "react";
import { Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileDropdown } from "@/components/Header/UserProfileDropdown";
import { ModulesMegaMenu } from "./ModulesMegaMenu";
import { NotificationsMegaMenu } from "./NotificationsMegaMenu";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { useAppSelector } from "@/hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

export const Header: React.FC = () => {
  const logoData = useThemeLogo();
  const theme = useAppSelector((state) => state.theme);
  const navigate = useNavigate();
  const { profileData } = useProfile();

  const getBackToOldVersionUrl = () => {
    return profileData?.dashboardType === 2 
      ? "https://old.gmbbriefcase.com/login"
      : "https://member.gmbbriefcase.com/login";
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-3 border-b border-border"
      style={{
        backgroundColor: theme.bg_color || "hsl(var(--background))",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-3">
          <img src={logoData.darkLogo} alt="Logo" className="h-10 w-auto" />
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-foreground hover:bg-gray-50"
            onClick={() => (window.location.href = getBackToOldVersionUrl())}
          >
            <span className="hidden md:block ml-1">Back to old version </span>
            <ExternalLink className="w-4 h-4" />
          </Button>

          <ModulesMegaMenu />

          <NotificationsMegaMenu />

          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};
