import { Navigate } from "react-router-dom";
import { lazyImport } from "../lazyImport";
const PostsPage = lazyImport(() => import("@/pages/PostsPage"));
const MediaPage = lazyImport(() => import("@/pages/MediaPage"));
const GalleryPage = lazyImport(() => import("@/pages/GalleryPage"));
const InsightsPage = lazyImport(() => import("@/pages/InsightsPage"));
const GeoRankingPage = lazyImport(() => import("@/pages/GeoRankingPage"));
const AIChatbotPage = lazyImport(() => import("@/pages/AIChatbotPage"));
const ReviewsPage = lazyImport(() => import("@/pages/ReviewsPage"));
import BusinessesPage from "@/pages/BusinessesPage";
import QAPage from "@/pages/QAPage";
import ReportsPage from "@/pages/ReportsPage";
const GeoRankingReportPage = lazyImport(
  () => import("@/components/GeoRanking/GeoRankingReportPage")
);
const CitationPage = lazyImport(() => import("@/pages/CitationPage"));
const HealthPage = lazyImport(() => import("@/pages/HealthPage"));
const KeywordsPage = lazyImport(() => import("@/pages/KeywordsPage"));
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ListingProvider } from "@/context/ListingContext";
import { RouteConfig } from "../routeConfig";
const AddKeywordsPage = lazyImport(() => import("@/pages/AddKeywordsPage"));
const BulkReportPage = lazyImport(() => import("@/pages/BulkReportPage"));
const GenerateBulkReportPage = lazyImport(
  () => import("@/pages/GenerateBulkReportPage")
);
const ViewBulkReportDetails = lazyImport(
  () => import("@/pages/ViewBulkReportDetails")
);

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

  // Gallery routes
  {
    path: "/gallery",
    element: <Navigate to="/gallery/default" replace />,
  },
  {
    path: "/gallery/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <GalleryPage />
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

  // Keywords routes
  {
    path: "/keywords",
    element: <Navigate to="/keywords/default" replace />,
  },
  {
    path: "/keywords/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <KeywordsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/keywords/:listingId/add",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <AddKeywordsPage />
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

  // AI Chatbot routes
  {
    path: "/ai-chatbot",
    element: <Navigate to="/ai-chatbot/default" replace />,
  },
  {
    path: "/ai-chatbot/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <AIChatbotPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // Citation routes
  {
    path: "/citation",
    element: <Navigate to="/citation/default" replace />,
  },
  {
    path: "/citation/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <CitationPage />
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
    path: "/health/:id",
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

  // Bulk Reports routes
  {
    path: "/bulk-reports",
    element: <Navigate to="/bulk-reports/default" replace />,
  },
  {
    path: "/bulk-reports/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <BulkReportPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // generate bulk report routes
  {
    path: "/generate-bulk-reports",
    element: <Navigate to="/generate-bulk-reports/default" replace />,
  },
  {
    path: "/generate-bulk-reports/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <GenerateBulkReportPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // generate bulk report routes
  {
    path: "/view-bulk-report-details/:reportId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <ViewBulkReportDetails />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
];
