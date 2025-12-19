import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  User,
  Users,
  CreditCard,
  Palette,
  FileText,
  Settings,
  Menu,
  Bell,
  FolderOpen,
  Activity,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { useIsMobile } from "../../hooks/use-mobile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useProfile } from "@/hooks/useProfile";

interface SettingsNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SettingsLayout: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardComponent/settingsLayout");
  const { profileData, isLoading: isProfileLoading } = useProfile();
  const userRole = profileData?.role?.toLowerCase();
  const isAdmin = !isProfileLoading && userRole === "admin";
  const isModerator = !isProfileLoading && userRole === "moderator";
  const canViewActivityLogs = isAdmin || isModerator;

  const settingsNavItems: SettingsNavItem[] = [
    {
      label: t("nav.googleAccount"),
      path: "/main-dashboard/settings/google-account",
      icon: User,
    },
    {
      label: t("nav.manageGroups"),
      path: "/main-dashboard/settings/manage-groups",
      icon: FolderOpen,
    },
    {
      label: t("nav.teamMembers"),
      path: "/main-dashboard/settings/team-members",
      icon: Users,
    },
    {
      label: t("nav.subscription"),
      path: "/main-dashboard/settings/subscription",
      icon: CreditCard,
    },
    {
      label: t("nav.themeCustomization"),
      path: "/main-dashboard/settings/theme-customization",
      icon: Palette,
    },
    {
      label: t("nav.reportBranding"),
      path: "/main-dashboard/settings/report-branding",
      icon: FileText,
    },
    {
      label: t("nav.notifications"),
      path: "/main-dashboard/settings/notifications",
      icon: Bell,
    },
    {
      label: t("nav.integrations"),
      path: "/main-dashboard/settings/integrations",
      icon: Settings,
    },
    {
      label: t("nav.activityLogs"),
      path: "/main-dashboard/settings/activity",
      icon: Activity,
    },
  ];

  const location = useLocation();
  const isMobile = useIsMobile(1024); // Hide sidebar on screens smaller than 1024px
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Function to determine active path for navigation highlighting
  const getActivePath = (itemPath: string) => {
    const currentPath = location.pathname;

    // Handle base settings path - activate Google Account by default
    if (currentPath === "/main-dashboard/settings") {
      return "/main-dashboard/settings/google-account";
    }

    // Handle nested routes - map them to their parent navigation items
    if (currentPath.includes("/team-members/edit/")) {
      return "/main-dashboard/settings/team-members";
    }
    if (currentPath.includes("/listings/")) {
      return "/main-dashboard/settings/google-account";
    }

    return currentPath;
  };

  // Settings navigation component (reusable for both desktop and mobile)
  const SettingsNav = () => {
    // Filter out Activity tab for non-admin users
    const filteredNavItems = settingsNavItems.filter((item) => {
      if (item.path === "/main-dashboard/settings/activity") {
        return canViewActivityLogs;
      }
      return true;
    });

    return (
      <nav className="space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = getActivePath(item.path) === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsSheetOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white border border-border rounded-lg lg:hidden">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t("title")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {t("title")}
                </h3>
                <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
              </div>
              <SettingsNav />
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      {!isMobile && (
        <div
          className="w-64 bg-white border border-border rounded-lg p-4"
          style={{ minWidth: "270px" }}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t("title")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <SettingsNav />
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 bg-white border border-border rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};
