import { Navigate } from "react-router-dom";
import PostsPage from "@/pages/PostsPage";
import MediaPage from "@/pages/MediaPage";
import InsightsPage from "@/pages/InsightsPage";
import GeoRankingPage from "@/pages/GeoRankingPage";
import ReviewsPage from "@/pages/ReviewsPage";
import BusinessesPage from "@/pages/BusinessesPage";
import QAPage from "@/pages/QAPage";
import { GeoRankingReportPage } from "@/components/GeoRanking/GeoRankingReportPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ListingProvider } from "@/context/ListingContext";
import { RouteConfig } from "../routeConfig";
import HealthPage from "@/pages/HealthPage";
import { AppLayout } from "@/components/Layout";

export const listingRoutes: RouteConfig[] = [
  // Posts routes
  {
    path: "/posts",
    element: <Navigate to="/posts/default" replace />,
  },
  {
    path: "/posts/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <PostsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },

  // Media routes
  {
    path: "/media",
    element: <Navigate to="/media/default" replace />,
  },
  {
    path: "/media/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <MediaPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },

  // Insights routes
  {
    path: "/insights",
    element: <Navigate to="/insights/default" replace />,
  },
  {
    path: "/insights/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <InsightsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },

  // Geo ranking routes
  {
    path: "/geo-ranking",
    element: <Navigate to="/geo-ranking/default" replace />,
  },
  {
    path: "/geo-ranking/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <GeoRankingPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },

  // Geo ranking report routes - moved before other routes for proper matching
  {
    path: "/geo-ranking-report",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <GeoRankingReportPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/geo-ranking-report/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <GeoRankingReportPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },

  // Reviews routes
  {
    path: "/reviews",
    element: <Navigate to="/reviews/default" replace />,
  },
  {
    path: "/reviews/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <ReviewsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  //  Health routes
  {
    path: "/health",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <HealthPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/health/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <HealthPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },

  // Business info routes (with redirect from old /businesses URLs)
  {
    path: "/businesses",
    element: <Navigate to="/business-info/default" replace />,
  },
  {
    path: "/businesses/:listingId",
    element: <Navigate to="/business-info/:listingId" replace />,
  },

  {
    path: "/business-info",
    element: <Navigate to="/business-info/default" replace />,
  },
  {
    path: "/business-info/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <BusinessesPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },

  // Notifications route
  {
    path: "/notifications",
    element: <Navigate to="/notifications/default" replace />,
  },

  // Q&A routes
  {
    path: "/qa",
    element: <Navigate to="/qa/default" replace />,
  },
  {
    path: "/qa/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <QAPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
];