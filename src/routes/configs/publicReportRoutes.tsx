import { Navigate } from "react-router-dom";
import { RouteConfig } from "../routeConfig";
import { ThemePreloader } from "@/components/ThemePreloader";
import { PublicGMBHealthReport } from "@/components/PublicReports/PublicGMBHealthReport";
import { PublicGeoRankingReport } from "@/components/PublicReports/PublicGeoRankingReport";
import { PublicReviewsReport } from "@/components/PublicReports/PublicReviewsReport";
import { PublicInsightsReport } from "@/components/PublicReports/PublicInsightsReport";
import { PublicMediaReport } from "@/components/PublicReports/PublicMediaReport";
import { PublicPostPerformanceReport } from "@/components/PublicReports/PublicPostPerformanceReport";

export const publicReportRoutes: RouteConfig[] = [
  {
    path: "/gmb-health/:reportId",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <PublicGMBHealthReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/gmb-ranking/:token",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <PublicGeoRankingReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/gmb-review/:token",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <PublicReviewsReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/gmb-insight/:token",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <PublicInsightsReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/gmb-media/:token",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <PublicMediaReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/gmb-post/:token",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <PublicPostPerformanceReport />
      </ThemePreloader>
    ),
  },
];
