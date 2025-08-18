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