import { Navigate } from "react-router-dom";
import PostsPage from "@/pages/PostsPage";
import MediaPage from "@/pages/MediaPage";
import InsightsPage from "@/pages/InsightsPage";
import GeoRankingPage from "@/pages/GeoRankingPage";
import ReviewsPage from "@/pages/ReviewsPage";
import BusinessesPage from "@/pages/BusinessesPage";
import QAPage from "@/pages/QAPage";
import ReportsPage from "@/pages/ReportsPage";
import { GeoRankingReportPage } from "@/components/GeoRanking/GeoRankingReportPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ListingProvider } from "@/context/ListingContext";
import { RouteConfig } from "../routeConfig";
import HealthPage from "@/pages/HealthPage";

export const listingRoutes: RouteConfig[] = [
  // Posts routes
  {
    path: "/posts",
    element: <Navigate to="/posts/default" replace />,
  },
  {
    path: "/posts/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <PostsPage />
        </ListingProvider>
      </ProtectedRoute>
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
      <ProtectedRoute>
        <ListingProvider>
          <MediaPage />
        </ListingProvider>
      </ProtectedRoute>
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
      <ProtectedRoute>
        <ListingProvider>
          <InsightsPage />
        </ListingProvider>
      </ProtectedRoute>
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
      <ProtectedRoute>
        <ListingProvider>
          <GeoRankingPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // Geo ranking report routes - moved before other routes for proper matching
  {
    path: "/geo-ranking-report",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <GeoRankingReportPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/geo-ranking-report/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <GeoRankingReportPage />
        </ListingProvider>
      </ProtectedRoute>
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
      <ProtectedRoute>
        <ListingProvider>
          <ReviewsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  //  Health routes
  // {
  //   path: "/health",
  //   element: (
  //     <ProtectedRoute>
  //       <ListingProvider>
  //         <HealthPage />
  //       </ListingProvider>
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: "/health/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <HealthPage />
        </ListingProvider>
      </ProtectedRoute>
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
      <ProtectedRoute>
        <ListingProvider>
          <BusinessesPage />
        </ListingProvider>
      </ProtectedRoute>
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
      <ProtectedRoute>
        <ListingProvider>
          <QAPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // Reports routes
  {
    path: "/reports",
    element: <Navigate to="/reports/default" replace />,
  },
  {
    path: "/reports/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <ReportsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
];
