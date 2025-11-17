import { lazyImport } from "../lazyImport";
const PublicGMBHealthReport = lazyImport(
  () => import("@/components/PublicReports/PublicGMBHealthReport")
);
const PublicGeoRankingReport = lazyImport(
  () => import("@/components/PublicReports/PublicGeoRankingReport")
);
const PublicReviewsReport = lazyImport(
  () => import("@/components/PublicReports/PublicReviewsReport")
);
const PublicInsightsReport = lazyImport(
  () => import("@/components/PublicReports/PublicInsightsReport")
);
const PublicMediaReport = lazyImport(
  () => import("@/components/PublicReports/PublicMediaReport")
);
const PublicPostPerformanceReport = lazyImport(
  () => import("@/components/PublicReports/PublicPostPerformanceReport")
);
const PublicCitationReport = lazyImport(
  () => import("@/components/PublicReports/PublicCitationReport")
);
const ShareableGEORankingReport = lazyImport(
  () =>
    import(
      "@/modules/GEO-Ranking/sharable-report/pages/sharable-GEO-ranking-report"
    )
);
const GmbHealthReport = lazyImport(
  () => import("@/modules/lead-module/public-reports/pages/GmbHealthReport")
);
const GmbProspectReport = lazyImport(
  () => import("@/modules/lead-module/public-reports/pages/GmbProspectReport")
);
const CitationAuditReport = lazyImport(
  () => import("@/modules/lead-module/public-reports/pages/CitationAuditReport")
);
const LeadGeoRankingReport = lazyImport(
  () =>
    import("@/modules/lead-module/public-reports/pages/LeadGeoRankingReport")
);

const PublicMultiDashboardReport = lazyImport(
  () => import("@/multiDashboardLayout/public-pages/multi-dashboard-report")
);
const ReviewFeedback = lazyImport(
  () => import("@/modules/Reputation-module/public-pages/ReviewFeedback")
);
const PublicFeedbackForm = lazyImport(
  () => import("@/modules/Reputation-module/public-pages/PublicFeedbackForm")
);
import { RouteConfig } from "../routeConfig";
import { ThemePreloader } from "@/components/ThemePreloader";

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
  {
    path: "/gmb-citation/:token",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <PublicCitationReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/multi-dashboard-report/:token",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <PublicMultiDashboardReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/sharable-GEO-ranking-report/:reportId",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <ShareableGEORankingReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/lead/gbp/:reportId",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <GmbHealthReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/lead/prospect/:reportId",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <GmbProspectReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/lead/citation/:reportId",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <CitationAuditReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/lead/geo/:reportId",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <LeadGeoRankingReport />
      </ThemePreloader>
    ),
  },
  {
    path: "/review-feedback",
    element: (
      <ThemePreloader loadFromAPI={true}>
        <ReviewFeedback />
      </ThemePreloader>
    ),
  },
  {
    path: "/feedback/form/:formId",
    element: <PublicFeedbackForm />,
  },
];
