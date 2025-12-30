import React, { useState } from "react";
import { Provider } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { store } from "../store/store";
import { ThemeProvider } from "../components/ThemeProvider";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header/Header";
import { Sheet, SheetContent } from "../components/ui/sheet";
import { SettingsSubHeader } from "../components/Settings/SettingsSubHeader";
import { SubscriptionPage } from "../components/Settings/SubscriptionPage";
import { IntegrationsPage } from "../components/Settings/IntegrationsPage";
import { BrandingPage } from "../components/Settings/BrandingPage";
import { ReportBrandingPage } from "../components/Settings/ReportBrandingPage";
import TeamMembersPage from "../components/Settings/TeamMembersPage";
import { EditTeamMemberSettings } from "../components/Settings/EditTeamMemberSettings";
import { useProfile } from "@/hooks/useProfile";
import { isSubscriptionExpired } from "@/utils/subscriptionUtil";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const SettingsPage = () => {
  const { t } = useI18nNamespace("pages/settingsPage");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profileData } = useProfile();
  const isPlanExpired = isSubscriptionExpired(profileData?.planExpDate);
  const role = profileData?.role?.toLowerCase();
  const isStaffOrClient = role === "staff" || role === "client";

  // Get active tab from route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/subscription")) {
      return "subscription";
    }
    if (path.includes("/theme-customization")) {
      return "theme-customization";
    }
    if (path.includes("/report-branding")) {
      return "report-branding";
    }
    if (path.includes("/integrations")) {
      return "integrations";
    }
    if (path.includes("/team-members")) {
      return "team-members";
    }
    return "team-members"; // default
  };

  // Check if we're on edit team member route
  const isEditTeamMember = () => {
    return location.pathname.includes("/settings/team-members/edit/");
  };

  // Redirect base /settings to /settings/team-members
  if (location.pathname === "/settings") {
    return <Navigate to="/settings/team-members" replace />;
  }

  const activeTab = getActiveTab();
  const isProfileLoaded = !!profileData?.role && !!profileData?.planExpDate;
  if (
    isProfileLoaded &&
    isPlanExpired === true &&
    activeTab !== "subscription" &&
    activeTab !== "team-members"
  ) {
    return <Navigate to="/settings/subscription" replace />;
  }

  const renderTabContent = () => {
    if (isPlanExpired && isStaffOrClient) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-lg font-semibold text-red-600">
            {t("settingsPage.planExpired.title")}
          </h2>
          <p className="text-sm mt-2 text-gray-600">
            {t("settingsPage.planExpired.description")}
          </p>
        </div>
      );
    }

    // Check if we're on edit team member route
    if (isEditTeamMember()) {
      return <EditTeamMemberSettings />;
    }

    switch (activeTab) {
      case "subscription":
        return <SubscriptionPage />;
      case "theme-customization":
        return <BrandingPage />;
      case "report-branding":
        return <ReportBrandingPage />;
      case "integrations":
        return <IntegrationsPage />;
      case "team-members":
        return <TeamMembersPage />;
      default:
        return <TeamMembersPage />;
    }
  };

  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 flex w-full">
          {/* Mobile Navigation Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar
                activeTab="settings"
                onTabChange={() => {}}
                collapsed={false}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex">
            <Sidebar
              activeTab="settings"
              onTabChange={() => {}}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
              sidebarCollapsed ? "md:ml-16" : "md:ml-64"
            }`}
          >
            {/* Header */}
            <Header
              onToggleSidebar={() => {
                if (window.innerWidth < 768) {
                  setMobileMenuOpen(true);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              showFilters={false}
            />

            {/* Settings Sub Header - Only show on main view and not on edit team member */}
            {!isEditTeamMember() && (
              <SettingsSubHeader activeTab={activeTab} />
            )}

            {/* Page Content */}
            <main className="flex-1 overflow-auto bg-gray-50">
              <div className="min-h-full">{renderTabContent()}</div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default SettingsPage;