import React, { useState } from "react";
import { ExternalLink, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/useRedux";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { ModulesMegaMenu } from "@/multiDashboardLayout/components/ModulesMegaMenu";
import { NotificationsMegaMenu } from "@/multiDashboardLayout/components/NotificationsMegaMenu";
import { UserProfileDropdown } from "@/components/Header/UserProfileDropdown";
import { NotificationDrawer } from "@/components/Notifications/NotificationDrawer";
import { useNotifications } from "@/context/NotificationContext";
export const Header: React.FC = () => {
  const theme = useAppSelector(state => state.theme);
  const {
    profileData
  } = useProfile();
  const navigate = useNavigate();
  const logoData = useThemeLogo();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {
    openDrawer,
    unreadCount,
    closeDrawer
  } = useNotifications();
  return <header style={{
    backgroundColor: theme.bg_color || "hsl(var(--background))"
  }} className="fixed top-0 left-0 right-0 z-[404] w-full px-4 py-3 border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img src={logoData.darkLogo} alt="Company Logo" className="h-8 w-auto object-contain" />
            <div className="border-l border-border/30 pl-3 hidden md:block ">
              <h1 className="text-md font-semibold text-white mb-0 p-0">
                GEO Ranking Tool
              </h1>
              <p className="text-sm text-white mt-0 p-0">
                Manage your local search rankings
              </p>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm" onClick={() => window.location.href = "https://old.gmbbriefcase.com/login"} className="bg-white text-foreground border-2 hover:bg-gray-50 rounded-sm">
            <span className="hidden md:block mr-2">Back to old version</span>
            <ExternalLink className="w-4 h-4" />
          </Button>

          <ModulesMegaMenu />
          <NotificationsMegaMenu />
          <UserProfileDropdown className="rounded-sm text-slate-900 font-medium" />
        </div>
        {/* Notification Drawer */}
        {/* <Sheet
          open={isSheetOpen}
          onOpenChange={(open) => {
            setIsSheetOpen(open);
            if (!open) {
              // ✅ also reset context drawer + search
              closeDrawer();
            }
          }}
         >
          <NotificationDrawer />
         </Sheet> */}
      </div>
    </header>;
};