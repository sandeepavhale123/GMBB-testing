export interface BulkReportProject {
  id: string;
  name: string;
  totalLocations: number;
  reportSections: string[];
  scheduleType: 'one-time' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  lastUpdate: string;
  emailRecipients: string[];
}

export interface ReportDetail {
  id: string;
  locationName: string;
  address: string;
  reportDate: string;
  status: 'generated' | 'failed' | 'pending';
  deliveryStatus: 'sent' | 'pending' | 'failed';
  recipients: string[];
  reportUrl?: string;
  errorMessage?: string;
  fileSize?: string;
  sections: string[];
  pdfUrl?: string;
  csvUrl?: string;
  htmlUrl?: string | null;
}

export interface BulkReportDetailsResponse {
  project: BulkReportProject;
  reports: ReportDetail[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  allInOnePdfReport?: string;
}

export interface BulkReportFilters {
  search: string;
  status: 'all' | 'generated' | 'failed' | 'pending';
  deliveryStatus: 'all' | 'sent' | 'pending' | 'failed';
}

// New types for bulk reports API
export interface GetAllBulkReportsRequest {
  page: number;
  limit: number;
  search: string;
  report_type: 'all' | 'onetime' | 'monthly' | 'weekly';
}

export interface BulkReportItem {
  id: string;
  title: string;
  listing_count: number;
  last_updated: string;
  next_update: string;
  schedule: 'ONETIME' | 'MONTHLY' | 'WEEKLY';
}

export interface BulkReportsPagination {
  total: number;
  page: number;
  limit: number;
}

export interface GetAllBulkReportsResponse {
  code: number;
  message: string;
  data: {
    reports: BulkReportItem[];
    pagination: BulkReportsPagination;
  };
}

// New types for view-report-details API
export interface ViewReportDetailsRequest {
  reportId: number;
  search: string;
  page: number;
  limit: number;
}

export interface ViewReportDetailsItem {
  gloc_id: number;
  listing_name: string;
  city: string;
  date: string;
  pdf_url: string;
  csv_url: string;
  html_url: string | null;
}

export interface ViewReportDetailsReport {
  report_id: string;
  title: string;
  schedule: 'ONETIME' | 'MONTHLY' | 'WEEKLY';
}

export interface ViewReportDetailsResponse {
  code: number;
  message: string;
  data: {
    report: ViewReportDetailsReport;
    allInOnePdfReport: string;
    items: ViewReportDetailsItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };
}