import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export interface Report {
  id: string;
  report_id?: string;
  name: string;
  title?: string;
  type: "Individual" | "Compare";
  reportSections: ReportSection[];
  sections_visible?: string[];
  dateRange: DateRange | CompareDateRange;
  date_range?: DateRange | CompareDateRange;
  createdAt: string;
  status: "generating" | "completed" | "failed";
}

export interface ReportSection {
  id: string;
  name: string;
  enabled: boolean;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface CompareDateRange {
  period1: DateRange;
  period2: DateRange;
}

export interface CreateReportRequest {
  name: string;
  type: "Individual" | "Compare";
  dateRange: DateRange | CompareDateRange;
  sections: string[];
  listingId: string;
  domain: string;
  lang: string;
}

// API Payload interface that matches the backend expected format
export interface CreateReportPayload {
  name: string;
  type: "Compare" | "Individual";
  listingId: number | string;
  date_range:
    | {
        period1: {
          from: string;
          to: string;
        };
        period2: {
          from: string;
          to: string;
        };
      }
    | {
        from: string;
        to: string;
      };
  sections: string[];
  domain: string;
  lang: string;
}

export interface PerformanceHealthReportData {
  data: any;
  successScore: number;
  failedScore: number;
  reviews: {
    review: string;
    reply: string;
  };
  avgRating: number;
  gmbPhotos: string[];
  totalPosts?: number;
  locationName?: string;
  address?: string;
  companyLogo?: string;
  detailedBreakdown: {
    [key: string]: boolean;
  };
  competitorAndCitationData: Array<{
    [key: string]: any;
  }>;
  visibleSection: {
    insights: "0" | "1";
    reviews: "0" | "1";
    posts: "0" | "1";
    media: "0" | "1";
    "gmb-health": "0" | "1";
    "geo-ranking": "0" | "1";
  };
}

// export const REPORT_SECTIONS = [
//   { id: "gmb-health", name: "GMB Health Report" },
//   { id: "insights", name: "Insight Report" },
//   { id: "reviews", name: "Review Report" },
//   { id: "posts", name: "Post Report" },
//   { id: "media", name: "Media Report" },
//   { id: "geo-ranking", name: "GEO Ranking Report" },
//   { id: "citation", name: "Citation Report" },
// ] as const;

// export type ReportSectionId = (typeof REPORT_SECTIONS)[number]["id"];

export type ReportSectionId =
  | "gmb-health"
  | "insights"
  | "reviews"
  | "posts"
  | "media"
  | "geo-ranking"
  | "citation";

// ✅ Hook-based i18n integration
export function useReportSections() {
  // Load the namespace for report translations
  const { t } = useI18nNamespace("Reports/reportSections");

  // Each section name uses the i18n key pattern
  const REPORT_SECTIONS = [
    {
      id: "gmb-health",
      name: t("gmbHealthReport", { defaultValue: "GMB Health Report" }),
    },
    {
      id: "insights",
      name: t("insightReport", { defaultValue: "Insight Report" }),
    },
    {
      id: "reviews",
      name: t("reviewReport", { defaultValue: "Review Report" }),
    },
    { id: "posts", name: t("postReport", { defaultValue: "Post Report" }) },
    { id: "media", name: t("mediaReport", { defaultValue: "Media Report" }) },
    {
      id: "geo-ranking",
      name: t("geoRankingReport", { defaultValue: "GEO Ranking Report" }),
    },
    {
      id: "citation",
      name: t("citationReport", { defaultValue: "Citation Report" }),
    },
  ] as const;

  return REPORT_SECTIONS;
}

// Response interface for getAllReports API
export interface GetAllReportsResponse {
  code: number;
  message: string;
  data: {
    reports: Report[];
    isCitation: 0 | 1;
    isGeo: 0 | 1;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      total_pages: number;
      has_prev: boolean;
      has_next: boolean;
    };
  };
}
