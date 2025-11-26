import { Navigate } from "react-router-dom";
import { lazyImport } from "../lazyImport";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ListingProvider } from "@/context/ListingContext";
import { ListingLayout } from "@/components/layout/ListingLayout";
import { RouteConfig } from "../routeConfig";

// Lazy load content components
const Dashboard = lazyImport(() => import("@/components/Dashboard/Dashboard").then(m => ({ default: m.Dashboard })));
const AITaskManagerPage = lazyImport(() => import("@/components/AITaskManager/AITaskManagerPage").then(m => ({ default: m.AITaskManagerPage })));
const PlanExpiredPage = lazyImport(() => import("@/pages/PlanExpiredPage"));
const PostsPage = lazyImport(() => import("@/pages/PostsPage"));
const MediaPage = lazyImport(() => import("@/pages/MediaPage"));
const GalleryPage = lazyImport(() => import("@/pages/GalleryPage"));
const InsightsPage = lazyImport(() => import("@/pages/InsightsPage"));
const GeoRankingPage = lazyImport(() => import("@/pages/GeoRankingPage"));
const AIChatbotPage = lazyImport(() => import("@/pages/AIChatbotPage"));
const ReviewsPage = lazyImport(() => import("@/pages/ReviewsPage"));
const BusinessesPage = lazyImport(() => import("@/pages/BusinessesPage"));
const QAPage = lazyImport(() => import("@/pages/QAPage"));
const ReportsPage = lazyImport(() => import("@/pages/ReportsPage"));
const GeoRankingReportPage = lazyImport(() => import("@/components/GeoRanking/GeoRankingReportPage"));
const CitationPage = lazyImport(() => import("@/pages/CitationPage"));
const HealthPage = lazyImport(() => import("@/pages/HealthPage"));
const KeywordsPage = lazyImport(() => import("@/pages/KeywordsPage"));
const AddKeywordsPage = lazyImport(() => import("@/pages/AddKeywordsPage"));
const BulkReportPage = lazyImport(() => import("@/pages/BulkReportPage"));
const GenerateBulkReportPage = lazyImport(() => import("@/pages/GenerateBulkReportPage"));
const ViewBulkReportDetails = lazyImport(() => import("@/pages/ViewBulkReportDetails"));

export const listingRoutes: RouteConfig[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <ListingLayout />
        </ListingProvider>
      </ProtectedRoute>
    ),
    children: [
      // Location Dashboard routes
      { path: "location-dashboard", element: <Navigate to="/location-dashboard/default" replace /> },
      { path: "location-dashboard/:listingId", element: <Dashboard /> },

      // AI Tasks routes
      { path: "ai-tasks", element: <Navigate to="/ai-tasks/default" replace /> },
      { path: "ai-tasks/:listingId", element: <AITaskManagerPage /> },

      // Plan expired route
      { path: "plan-expired", element: <PlanExpiredPage /> },

      // Posts routes
      { path: "posts", element: <Navigate to="/posts/default" replace /> },
      { path: "posts/:listingId", element: <PostsPage /> },

      // Media routes
      { path: "media", element: <Navigate to="/media/default" replace /> },
      { path: "media/:listingId", element: <MediaPage /> },

      // Gallery routes
      { path: "gallery", element: <Navigate to="/gallery/default" replace /> },
      { path: "gallery/:listingId", element: <GalleryPage /> },

      // Insights routes
      { path: "insights", element: <Navigate to="/insights/default" replace /> },
      { path: "insights/:listingId", element: <InsightsPage /> },

      // Keywords routes
      { path: "keywords", element: <Navigate to="/keywords/default" replace /> },
      { path: "keywords/:listingId", element: <KeywordsPage /> },
      { path: "keywords/:listingId/add", element: <AddKeywordsPage /> },

      // Geo ranking routes
      { path: "geo-ranking", element: <Navigate to="/geo-ranking/default" replace /> },
      { path: "geo-ranking/:listingId", element: <GeoRankingPage /> },

      // AI Chatbot routes
      { path: "ai-chatbot", element: <Navigate to="/ai-chatbot/default" replace /> },
      { path: "ai-chatbot/:listingId", element: <AIChatbotPage /> },

      // Citation routes
      { path: "citation", element: <Navigate to="/citation/default" replace /> },
      { path: "citation/:listingId", element: <CitationPage /> },

      // Geo ranking report routes
      { path: "geo-ranking-report", element: <GeoRankingReportPage /> },
      { path: "geo-ranking-report/:listingId", element: <GeoRankingReportPage /> },

      // Reviews routes
      { path: "reviews", element: <Navigate to="/reviews/default" replace /> },
      { path: "reviews/:listingId", element: <ReviewsPage /> },

      // Health routes
      { path: "health/:id", element: <HealthPage /> },

      // Business info routes (with redirect from old /businesses URLs)
      { path: "businesses", element: <Navigate to="/business-info/default" replace /> },
      { path: "businesses/:listingId", element: <Navigate to="/business-info/:listingId" replace /> },
      { path: "business-info", element: <Navigate to="/business-info/default" replace /> },
      { path: "business-info/:listingId", element: <BusinessesPage /> },

      // Notifications route
      { path: "notifications", element: <Navigate to="/notifications/default" replace /> },

      // Q&A routes
      { path: "qa", element: <Navigate to="/qa/default" replace /> },
      { path: "qa/:listingId", element: <QAPage /> },

      // Reports routes
      { path: "reports", element: <Navigate to="/reports/default" replace /> },
      { path: "reports/:listingId", element: <ReportsPage /> },

      // Bulk Reports routes
      { path: "bulk-reports", element: <Navigate to="/bulk-reports/default" replace /> },
      { path: "bulk-reports/:listingId", element: <BulkReportPage /> },

      // Generate bulk report routes
      { path: "generate-bulk-reports", element: <Navigate to="/generate-bulk-reports/default" replace /> },
      { path: "generate-bulk-reports/:listingId", element: <GenerateBulkReportPage /> },

      // View bulk report details route
      { path: "view-bulk-report-details/:reportId", element: <ViewBulkReportDetails /> },
    ],
  },
];
