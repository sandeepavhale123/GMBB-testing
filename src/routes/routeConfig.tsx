
import { Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import PostsPage from "@/pages/PostsPage";
import MediaPage from "@/pages/MediaPage";
import InsightsPage from "@/pages/InsightsPage";
import GeoRankingPage from "@/pages/GeoRankingPage";
import ReviewsPage from "@/pages/ReviewsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import BusinessesPage from "@/pages/BusinessesPage";
import TeamPage from "@/pages/TeamPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SettingsPage from "@/pages/SettingsPage";
import QAPage from "@/pages/QAPage";
import { GeoRankingReportPage } from "@/components/GeoRanking/GeoRankingReportPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { ListingProvider } from "@/context/ListingContext";

export interface RouteConfig {
  path: string;
  element: JSX.Element;
}

export const routeConfigs: RouteConfig[] = [
  // Root redirects
  {
    path: "/",
    element: <Navigate to="/location-dashboard/default" replace />
  },
  {
    path: "/location-dashboard",
    element: <Navigate to="/location-dashboard/default" replace />
  },
  
  // Main dashboard route
  {
    path: "/location-dashboard/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    )
  },
  
  // Auth routes
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    )
  },
  
  // Non-listing routes
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/team",
    element: (
      <ProtectedRoute>
        <TeamPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  
  // Listing-dependent routes with redirects
  {
    path: "/posts",
    element: <Navigate to="/posts/default" replace />
  },
  {
    path: "/posts/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <PostsPage />
        </ListingProvider>
      </ProtectedRoute>
    )
  },
  
  {
    path: "/media",
    element: <Navigate to="/media/default" replace />
  },
  {
    path: "/media/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <MediaPage />
        </ListingProvider>
      </ProtectedRoute>
    )
  },
  
  {
    path: "/insights",
    element: <Navigate to="/insights/default" replace />
  },
  {
    path: "/insights/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <InsightsPage />
        </ListingProvider>
      </ProtectedRoute>
    )
  },
  
  {
    path: "/geo-ranking",
    element: <Navigate to="/geo-ranking/default" replace />
  },
  {
    path: "/geo-ranking/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <GeoRankingPage />
        </ListingProvider>
      </ProtectedRoute>
    )
  },
  
  {
    path: "/geo-ranking-report",
    element: (
      <ProtectedRoute>
        <GeoRankingReportPage />
      </ProtectedRoute>
    )
  },
  
  {
    path: "/reviews",
    element: <Navigate to="/reviews/default" replace />
  },
  {
    path: "/reviews/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <ReviewsPage />
        </ListingProvider>
      </ProtectedRoute>
    )
  },
  
  // Redirect old /businesses URLs to /business-info
  {
    path: "/businesses",
    element: <Navigate to="/business-info/default" replace />
  },
  {
    path: "/businesses/:listingId",
    element: <Navigate to="/business-info/:listingId" replace />
  },
  
  {
    path: "/business-info",
    element: <Navigate to="/business-info/default" replace />
  },
  {
    path: "/business-info/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <BusinessesPage />
        </ListingProvider>
      </ProtectedRoute>
    )
  },
  
  {
    path: "/notifications",
    element: <Navigate to="/notifications/default" replace />
  },
  
  {
    path: "/qa",
    element: <Navigate to="/qa/default" replace />
  },
  {
    path: "/qa/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <QAPage />
        </ListingProvider>
      </ProtectedRoute>
    )
  },

  // Catch-all route - must be last
  {
    path: "*",
    element: <NotFound />
  }
];
