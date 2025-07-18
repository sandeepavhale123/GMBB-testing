export interface Report {
  id: string;
  name: string;
  type: "Individual" | "Compare";
  reportSections: ReportSection[];
  dateRange: DateRange | CompareDateRange;
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

export const REPORT_SECTIONS = [
  { id: "gmb-health", name: "GMB Healt Report" },
  { id: "insights", name: "Insight Report" },
  { id: "reviews", name: "Review Report" },
  { id: "posts", name: "Post Report" },
  { id: "media", name: "Media Report" },
  { id: "geo-ranking", name: "GEO Ranking Report" },
] as const;

export type ReportSectionId = (typeof REPORT_SECTIONS)[number]["id"];
