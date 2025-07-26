import { Navigate } from "react-router-dom";
import { RouteConfig } from "../routeConfig";
import { PublicReportSharedLayout } from "@/components/PublicReports/PublicReportSharedLayout";
import { PublicGMBHealthReportContent } from "@/components/PublicReports/Content/PublicGMBHealthReportContent";
import { PublicGeoRankingReportContent } from "@/components/PublicReports/Content/PublicGeoRankingReportContent";
import { PublicReviewsReportContent } from "@/components/PublicReports/Content/PublicReviewsReportContent";
import { PublicInsightsReportContent } from "@/components/PublicReports/Content/PublicInsightsReportContent";
import { PublicMediaReportContent } from "@/components/PublicReports/Content/PublicMediaReportContent";
import { PublicPostPerformanceReportContent } from "@/components/PublicReports/Content/PublicPostPerformanceReportContent";

export const publicReportRoutes: RouteConfig[] = [
  {
    path: "/public-reports/:token",
    element: <PublicReportSharedLayout />,
    children: [
      {
        path: "health",
        element: <PublicGMBHealthReportContent />,
      },
      {
        path: "ranking", 
        element: <PublicGeoRankingReportContent />,
      },
      {
        path: "review",
        element: <PublicReviewsReportContent />,
      },
      {
        path: "insight",
        element: <PublicInsightsReportContent />,
      },
      {
        path: "media",
        element: <PublicMediaReportContent />,
      },
      {
        path: "post",
        element: <PublicPostPerformanceReportContent />,
      },
      {
        path: "",
        element: <Navigate to="health" replace />,
      },
    ],
  },
  // Legacy routes for backward compatibility
  {
    path: "/gmb-health/:reportId",
    element: <Navigate to="/public-reports/$1/health" replace />,
  },
];
