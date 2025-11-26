import React, { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "./layout";
import { NoListingSelected } from "@/components/ui/no-listing-selected";
import { useListingContext } from "@/context/ListingContext";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { useProfile } from "@/hooks/useProfile";
import { isSubscriptionExpired } from "@/utils/subscriptionUtil";

// Map routes to showFilters and pageType
const routeConfig: Record<string, { showFilters: boolean; pageType: string }> = {
  "location-dashboard": { showFilters: false, pageType: "Dashboard" },
  "ai-tasks": { showFilters: false, pageType: "AI Tasks" },
  "plan-expired": { showFilters: false, pageType: "Plan Expired" },
  posts: { showFilters: true, pageType: "Posts" },
  media: { showFilters: true, pageType: "Media" },
  gallery: { showFilters: true, pageType: "Gallery" },
  insights: { showFilters: true, pageType: "Insights" },
  reviews: { showFilters: true, pageType: "Reviews" },
  keywords: { showFilters: false, pageType: "Keywords" },
  "geo-ranking": { showFilters: false, pageType: "Geo Ranking" },
  citation: { showFilters: false, pageType: "Citations" },
  qa: { showFilters: false, pageType: "Q&A" },
  health: { showFilters: false, pageType: "Health" },
  reports: { showFilters: false, pageType: "Reports" },
  "business-info": { showFilters: true, pageType: "Business Info" },
  "ai-chatbot": { showFilters: false, pageType: "AI Chatbot" },
  "bulk-reports": { showFilters: false, pageType: "Bulk Reports" },
  "generate-bulk-reports": { showFilters: false, pageType: "Generate Bulk Reports" },
  "geo-ranking-report": { showFilters: false, pageType: "Geo Ranking Report" },
};

const ListingLayoutInner: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedListing, isInitialLoading } = useListingContext();
  const { profileData, isLoading: isProfileLoading } = useProfile();
  
  // Get route segment (e.g., "posts" from "/posts/:listingId")
  const routeSegment = location.pathname.split("/")[1];
  const config = routeConfig[routeSegment] || { showFilters: false, pageType: "Page" };

  // Handle plan expired redirect
  useEffect(() => {
    const planExpired = isSubscriptionExpired(profileData?.planExpDate || null);
    const role = profileData?.role?.toLowerCase();
    const isClientOrStaff = role === "client" || role === "staff";
    
    if (planExpired && isClientOrStaff && routeSegment !== "plan-expired") {
      navigate("/plan-expired", { replace: true });
    }
  }, [profileData, routeSegment, navigate]);

  // Show loading state while profile loads
  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Show no listing selected state
  if (!selectedListing && !isInitialLoading) {
    return (
      <Layout showFilters={config.showFilters}>
        <NoListingSelected pageType={config.pageType} />
      </Layout>
    );
  }

  return (
    <Layout showFilters={config.showFilters}>
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Outlet />
      </Suspense>
    </Layout>
  );
};

export const ListingLayout: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingLayoutInner />
        </DashboardTypeGuard>
      </ThemeProvider>
    </Provider>
  );
};
