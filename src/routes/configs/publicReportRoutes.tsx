import { Navigate } from "react-router-dom";
import { RouteConfig } from "../routeConfig";
import { PublicGMBHealthReport } from "@/components/PublicReports/PublicGMBHealthReport";
import { PublicGeoRankingReport } from "@/components/PublicReports/PublicGeoRankingReport";
import { PublicReviewsReport } from "@/components/PublicReports/PublicReviewsReport";
import { PublicInsightsReport } from "@/components/PublicReports/PublicInsightsReport";
import { PublicMediaReport } from "@/components/PublicReports/PublicMediaReport";
import { PublicPostPerformanceReport } from "@/components/PublicReports/PublicPostPerformanceReport";

export const publicReportRoutes: RouteConfig[] = [
  {
    path: "/gmb-health/:reportId",
    element: <PublicGMBHealthReport />,
  },
  {
    path: "/gmb-ranking/:token",
    element: <PublicGeoRankingReport />,
  },
  {
    path: "/gmb-review/:token",
    element: <PublicReviewsReport />,
  },
  {
    path: "/gmb-insight/:token",
    element: <PublicInsightsReport />,
  },
  {
    path: "/gmb-media/:token",
    element: <PublicMediaReport />,
  },
  {
    path: "/gmb-post/:token",
    element: <PublicPostPerformanceReport />,
  },
];
