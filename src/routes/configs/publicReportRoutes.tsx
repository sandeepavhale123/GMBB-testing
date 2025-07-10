import { Navigate } from "react-router-dom";
import { RouteConfig } from "../routeConfig";
import { PublicReportsLanding } from "@/components/PublicReports/PublicReportsLanding";
import { PublicGMBHealthReport } from "@/components/PublicReports/PublicGMBHealthReport";
import { PublicGeoRankingReport } from "@/components/PublicReports/PublicGeoRankingReport";
import { PublicReviewsReport } from "@/components/PublicReports/PublicReviewsReport";
import { PublicInsightsReport } from "@/components/PublicReports/PublicInsightsReport";
import { PublicMediaReport } from "@/components/PublicReports/PublicMediaReport";

export const publicReportRoutes: RouteConfig[] = [
  {
    path: "/public-reports",
    element: <PublicReportsLanding />,
  },
  {
    path: "/public-reports/gmb-health/:token",
    element: <PublicGMBHealthReport />,
  },
  {
    path: "/public-reports/geo-ranking/:token",
    element: <PublicGeoRankingReport />,
  },
  {
    path: "/public-reports/reviews/:token",
    element: <PublicReviewsReport />,
  },
  {
    path: "/public-reports/insights/:token",
    element: <PublicInsightsReport />,
  },
  {
    path: "/public-reports/media/:token",
    element: <PublicMediaReport />,
  },
];