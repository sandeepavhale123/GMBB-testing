import React, { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "./layout";
import { NoListingSelected } from "@/components/ui/no-listing-selected";
import { useListingContext } from "@/context/ListingContext";

// Map routes to showFilters and pageType
const routeConfig: Record<string, { showFilters: boolean; pageType: string }> = {
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
  const { selectedListing, isInitialLoading } = useListingContext();
  
  // Get route segment (e.g., "posts" from "/posts/:listingId")
  const routeSegment = location.pathname.split("/")[1];
  const config = routeConfig[routeSegment] || { showFilters: false, pageType: "Page" };

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
        <ListingLayoutInner />
      </ThemeProvider>
    </Provider>
  );
};
