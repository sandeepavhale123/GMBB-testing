import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface SettingsSubHeaderProps {
  activeTab: string;
}

export const SettingsSubHeader: React.FC<SettingsSubHeaderProps> = ({
  activeTab,
}) => {
  const { t } = useI18nNamespace("Settings/settingsSubHeader");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const tabs = [
    {
      id: "team-members",
      label: t("settingsSubHeader.tabs.teamMembers"),
      path: "/settings/team-members",
    },
    {
      id: "subscription",
      label: t("settingsSubHeader.tabs.subscription"),
      path: "/settings/subscription",
    },
    {
      id: "theme-customization",
      label: t("settingsSubHeader.tabs.themeCustomization"),
      path: "/settings/theme-customization",
    },
    {
      id: "report-branding",
      label: t("settingsSubHeader.tabs.reportBranding"),
      path: "/settings/report-branding",
    },
    {
      id: "integrations",
      label: t("settingsSubHeader.tabs.integrations"),
      path: "/settings/integrations",
    },
  ];

  const isActiveTab = (tabId: string) => {
    return location.pathname.includes(tabId);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Desktop Tabs - Left Aligned */}
          <div className="hidden sm:flex">
            <div className="flex space-x-8 flex-wrap -mb-[1px]">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActiveTab(tab.id)
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end sm:justify-end ml-auto">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="sm:hidden mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`text-left py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                    isActiveTab(tab.id)
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};