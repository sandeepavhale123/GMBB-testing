export interface Report {
  id: string;
  name: string;
  type: 'Individual' | 'Compare';
  reportSections: ReportSection[];
  dateRange: DateRange | CompareDateRange;
  createdAt: string;
  status: 'generating' | 'completed' | 'failed';
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
  type: 'Individual' | 'Compare';
  dateRange: DateRange | CompareDateRange;
  sections: string[];
  listingId: string;
}

export const REPORT_SECTIONS = [
  { id: 'insights', name: 'Insight Section' },
  { id: 'reviews', name: 'Review Section' },
  { id: 'posts', name: 'Post Section' },
  { id: 'media', name: 'Media Section' },
  { id: 'qa', name: 'Q & A Section' },
  { id: 'geo-ranking', name: 'GEO Ranking Section' },
] as const;

export type ReportSectionId = typeof REPORT_SECTIONS[number]['id'];