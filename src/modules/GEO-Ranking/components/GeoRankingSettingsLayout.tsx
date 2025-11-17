import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Palette, Key } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface SettingsNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const GeoRankingSettingsLayout: React.FC = () => {
  const { t } = useI18nNamespace(
    "Geo-Ranking-module-component/GeoRankingSettings"
  );
  const settingsNavItems: SettingsNavItem[] = [
    {
      label: t("nav.theme"),
      path: "/module/geo-ranking/settings/theme-customization",
      icon: Palette,
    },
    {
      label: t("nav.apiKey"),
      path: "/module/geo-ranking/settings/google-api-key",
      icon: Key,
    },
  ];
  const location = useLocation();
  const isMobile = useIsMobile(1024); // Hide sidebar on screens smaller than 1024px
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Function to determine active path for navigation highlighting
  const getActivePath = (itemPath: string) => {
    const currentPath = location.pathname;

    // Handle base settings path - activate Theme Customization by default
    if (currentPath === "/module/geo-ranking/settings") {
      return "/module/geo-ranking/settings/theme-customization";
    }

    return currentPath;
  };

  // Settings navigation component (reusable for both desktop and mobile)
  const SettingsNav = () => (
    <nav className="space-y-1">
      {settingsNavItems.map((item) => {
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white border border-border rounded-lg lg:hidden">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t("title")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
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
                <p className="text-sm text-muted-foreground">
                  {t("description")}
                </p>
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
            <p className="text-sm text-muted-foreground">{t("description")}</p>
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

export default GeoRankingSettingsLayout;
