import React, { useEffect, useState } from "react";
import { Plus, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileDropdown } from "@/components/Header/UserProfileDropdown";
import { ModulesMegaMenu } from "./ModulesMegaMenu";
import { NotificationsMegaMenu } from "./NotificationsMegaMenu";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { useAppSelector } from "@/hooks/useRedux";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { FaComments, FaQuestion } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { isAllowedDomain } from "@/lib/utils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DashboardModeSwitch } from "@/components/DashboardMode";

export const Header: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardComponent/header");
  const logoData = useThemeLogo();
  const theme = useAppSelector((state) => state.theme);
  const navigate = useNavigate();
  const { profileData } = useProfile();

  const getBackToOldVersionUrl = () => {
    return profileData?.dashboardType === 2
      ? "https://old.gmbbriefcase.com/login"
      : "https://old.gmbbriefcase.com/login";
  };
  const isAdmin = profileData?.role?.toLowerCase() === "admin";

  React.useEffect(() => {
    if (isAdmin) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://client.crisp.chat/l.js";
      document.head.appendChild(script);
      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = "0a5a5d0b-5517-45e0-be41-6bbe43d41696";
      (window as any).CRISP_READY_TRIGGER = function () {
        const visitorEmail = (window as any).$crisp?.get("user:email");
        if (!visitorEmail) {
          (window as any).$crisp.push([
            "set",
            "user:email",
            profileData?.username,
          ]);
        }
      };
      return () => {
        // Cleanup: Remove Crisp script and globals when component unmounts
        document.head.removeChild(script);
        delete (window as any).$crisp;
        delete (window as any).CRISP_WEBSITE_ID;
        delete (window as any).CRISP_READY_TRIGGER;
      };
    }
  }, [isAdmin, profileData?.username]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[50] w-full px-4 py-3 border-b border-border"
        style={{
          backgroundColor: theme.bg_color || "hsl(var(--background))",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoData.darkLogo}
              alt={t("alt.logo")}
              className="h-10 w-auto"
            />
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Dashboard Mode Toggle */}
            {/* <DashboardModeSwitch /> */}

            {isAllowedDomain() && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-foreground hover:bg-gray-50"
                onClick={() =>
                  (window.location.href = getBackToOldVersionUrl())
                }
              >
                <span className="hidden md:block ml-1">
                  {t("buttons.backToOldVersion")}{" "}
                </span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}

            <LanguageSwitcher />

            <ModulesMegaMenu />

            <NotificationsMegaMenu />

            <UserProfileDropdown />
          </div>
        </div>
      </header>
    </>
  );
};
