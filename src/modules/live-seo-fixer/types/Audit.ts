export interface SitemapRequest {
  sitemaps: string[];
}

export interface PageSelection {
  pageId: string;
  url: string;
  pageType: string;
  targetKeyword: string;
}

export type IssueSeverity = 'high' | 'medium' | 'low' | 'critical' | 'warning' | 'info';

export interface GroupedIssue {
  issue_id: string;
  audit_page_id: string;
  page_url: string;
  page_type: string;
  target_keyword: string;
  severity: IssueSeverity;
  message: string;
  current_value: string;
  suggested_value?: string;
  element?: string;
  approved?: number;
  fix_value?: string;
  page?: {
    url: string;
    title: string;
    type: string;
    target_keyword: string;
  };
}

export interface AuditProgress {
  status: 'pending' | 'scraping' | 'analyzing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  pagesProcessed: number;
  totalPages: number;
}

export interface AuditCategory {
  type: string;
  label: string;
  count: number;
  severity_distribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface DiscoveredPage {
  id: string;
  url: string;
  title?: string;
}

export interface AuditHistoryItem {
  id: string;
  created_date: string;
  pages_audited: number;
  issues_found: number;
  status: string;
}

export interface PageTypeOption {
  value: string;
  label: string;
}
