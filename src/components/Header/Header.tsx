import React from "react";
import { Menu, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { toggleTheme } from "../../store/slices/themeSlice";
import { BusinessListingSelector } from "./BusinessListingSelector";
import { MobileBusinessSelector } from "./MobileBusinessSelector";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { PageTitle } from "./PageTitle";
import { PageBreadcrumb } from "./PageBreadcrumb";
import { HeaderProps } from "./types";
import { isAllowedDomain } from "@/lib/utils";
import { HeaderModulesMegaMenu } from "./HeaderModulesMegaMenu";
import { HeaderNotificationsMegaMenu } from "./HeaderNotificationsMegaMenu";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import DashboardModeSwitch from "../DashboardMode";
export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, showFilters, onShowFilters }) => {
  const { t } = useI18nNamespace("Header/header");
  const dispatch = useAppDispatch();
  const { isDark } = useAppSelector((state) => state.theme);
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Main header content */}
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="flex flex-wrap flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          {/* Left section - Menu + Title/Breadcrumbs (desktop) + Action buttons (mobile) */}
          <div className="flex items-center justify-between w-full sm:flex-1 sm:items-start sm:gap-4">
            {/* Menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="hover:bg-gray-100 p-1.5 sm:p-2 shrink-0"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </Button>

            {/* Title + Breadcrumbs - Desktop/Tablet only (shown on same row as menu) */}
            <div className="hidden sm:block w-full min-w-0 flex-1 overflow-hidden">
              <PageTitle />
              <div className="mt-2">
                <PageBreadcrumb />
              </div>
            </div>

            {/* Action buttons - Mobile only (shown on right side of Row 1) */}
            <div className="flex sm:hidden items-center gap-2 shrink-0">
              {isAllowedDomain() && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => (window.location.href = "https://old.gmbbriefcase.com/login")}
                  className="bg-white text-foreground border-2 hover:bg-gray-50 rounded-sm"
                >
                  <span className="hidden md:block ml-1">{t("header.backToOldVersion")} </span>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              <BusinessListingSelector />
              <MobileBusinessSelector />
              <LanguageSwitcher />
              <HeaderModulesMegaMenu />
              <HeaderNotificationsMegaMenu />
              <UserProfileDropdown className="rounded-sm text-slate-900 font-medium border-2" />
            </div>
          </div>

          {/* Title + Breadcrumbs - Mobile only (Row 2) */}
          <div className="sm:hidden w-full min-w-0 overflow-hidden">
            <PageTitle />
            <div className="mt-2">
              <PageBreadcrumb />
            </div>
          </div>

          {/* Action buttons - Desktop/Tablet only (right side) */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
            {/* {isAllowedDomain() && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  (window.location.href = "https://old.gmbbriefcase.com/login")
                }
                className="bg-white text-foreground border-2 hover:bg-gray-50 rounded-sm"
              >
                <span className="hidden md:block ml-1">
                  {t("header.backToOldVersion")}{" "}
                </span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            )} */}
            <BusinessListingSelector />
            <DashboardModeSwitch variant="light" />
            <MobileBusinessSelector />
            <LanguageSwitcher />
            <HeaderModulesMegaMenu />
            <HeaderNotificationsMegaMenu />
            <UserProfileDropdown className="rounded-sm text-slate-900 font-medium border-2" />
          </div>
        </div>
      </div>
    </header>
  );
};
