import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../components/ThemeProvider";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header/Header";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { PostsPage } from "../components/Posts/PostsPage";
import { MediaPage } from "../components/Media/MediaPage";
import GalleryPage from "./GalleryPage";
import { InsightsPage } from "../components/Insights/InsightsPage";
import { Toaster } from "../components/ui/toaster";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Menu } from "lucide-react";
import { GeoRankingPage } from "../components/GeoRanking/GeoRankingPage";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { ReviewsManagementPage } from "../components/Reviews/ReviewsManagementPage";
import { QAManagementPage } from "../components/QA/QAManagementPage";
import { AITaskManagerPage } from "../components/AITaskManager/AITaskManagerPage";
import { useListingContext } from "@/context/ListingContext";
import { ListingLoader } from "../components/ui/listing-loader";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { isSubscriptionExpired } from "@/utils/subscriptionUtil";
import PlanExpiredPage from "@/pages/PlanExpiredPage";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const Index = () => {
  const { t } = useI18nNamespace("pages/index");
  const { user } = useAuthRedux();
  useAxiosAuth();
  const { isLoading } = useListingContext();
  const location = useLocation();
  const { profileData, isLoading: isProfileLoading } = useProfile();
  const planExpired = isSubscriptionExpired(profileData?.planExpDate || null);
  const role = profileData?.role?.toLowerCase();
  const isClientOrStaff = role === "client" || role === "staff";
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine active tab from URL.
  const getActiveTabFromUrl = () => {
    const pathParts = location.pathname.split("/");
    const route = pathParts[1];

    switch (route) {
      case "location-dashboard":
        return "overview";
      case "plan-expired":
        return "plan-expired";
      case "ai-tasks":
        return "ai-tasks";
      case "posts":
        return "posts";
      case "media":
        return "media";
      case "gallery":
        return "gallery";
      case "insights":
        return "insights";
      case "geo-ranking":
        return "geo-ranking";
      case "reviews":
        return "reviews";
      case "qa":
        return "qa";
      default:
        return "overview";
    }
  };

  const activeTab = getActiveTabFromUrl();

  useEffect(() => {
    if (planExpired && isClientOrStaff && activeTab !== "plan-expired") {
      navigate(`/plan-expired`, { replace: true });
    }
  }, [planExpired, isClientOrStaff, activeTab, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "plan-expired":
        return <PlanExpiredPage />;
      case "overview":
        return <Dashboard />;
      case "ai-tasks":
        return <AITaskManagerPage />;
      case "posts":
        return <PostsPage />;
      case "media":
        return <MediaPage />;
      case "gallery":
        return <GalleryPage />;
      case "insights":
        return <InsightsPage />;
      case "geo-ranking":
        return <GeoRankingPage />;
      case "reviews":
        return <ReviewsManagementPage />;
      case "qa":
        return <QAManagementPage />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{t("comingSoon")}</h2>
              <p className="text-gray-600">{t("comingSoonDescription")}</p>
            </div>
          </div>
        );
    }
  };
  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">{t("loadingUserProfile")}</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Mobile Navigation Sheet. */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar
              activeTab={activeTab}
              onTabChange={() => {}} // Navigation is handled by the sidebar itself now.
              collapsed={false}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            activeTab={activeTab}
            onTabChange={() => {}} // Navigation is handled by the sidebar itself now
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main Content .*/}
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
            showFilters={["posts", "reviews", "geo-ranking", "media", "insights"].includes(activeTab)}
          />

          {/* Page Content with Loading Overlay */}
          <main className="flex-1 p-3 pb-[100px] sm:p-4 sm:pb-[100px] md:p-6 md:pb-[100px] overflow-auto">
            <ListingLoader isLoading={isLoading}>{renderContent()}</ListingLoader>
          </main>
        </div>

        {/* <Toaster /> */}
      </div>
    </ThemeProvider>
  );
};

export default Index;
