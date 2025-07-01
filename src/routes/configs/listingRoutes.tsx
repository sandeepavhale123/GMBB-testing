
import { Suspense, lazy } from "react";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ListingProvider } from "@/context/ListingContext";
import { RouteConfig } from "../routeConfig";

// Lazy load components
const LocationDashboard = lazy(() => import("@/pages/Index"));
const InsightsPage = lazy(() => import("@/pages/InsightsPage"));
const PostsPage = lazy(() => import("@/pages/PostsPage"));
const ReviewsPage = lazy(() => import("@/pages/ReviewsPage"));
const QAPage = lazy(() => import("@/pages/QAPage"));
const MediaPage = lazy(() => import("@/pages/MediaPage"));
const GeoRankingPage = lazy(() => import("@/pages/GeoRankingPage"));
const GeoRankingReportPage = lazy(() => import("@/components/GeoRanking/GeoRankingReportPage"));

export const listingRoutes: RouteConfig[] = [
  {
    path: "/location-dashboard/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <LocationDashboard />
          </Suspense>
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/insights/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <InsightsPage />
          </Suspense>
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/posts/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <PostsPage />
          </Suspense>
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/reviews/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ReviewsPage />
          </Suspense>
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/qa/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <QAPage />
          </Suspense>
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/media/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <MediaPage />
          </Suspense>
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/geo-ranking/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <GeoRankingPage />
          </Suspense>
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/geo-ranking-report/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <GeoRankingReportPage />
          </Suspense>
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
];
