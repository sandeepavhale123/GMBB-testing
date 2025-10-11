export interface SitemapRequest {
  sitemaps: string[]; // max 2 URLs
}

export interface PageSelection {
  pageId: string;
  url: string;
  pageType: string; // Dynamic page type from API
  targetKeyword: string;
}

export interface AuditRequest {
  selectedPages: PageSelection[]; // max 10
}

export interface DiscoveredPage {
  id: string;
  url: string;
  title?: string;
  discoveredFrom: string; // sitemap URL
}

export interface AuditResult {
  pageId: string;
  url: string;
  issues: SEOIssue[];
  severity: 'critical' | 'warning' | 'info';
  fixable: boolean;
  pageType: string;
  targetKeyword: string;
}

export interface SEOIssue {
  id: string;
  type: 'title' | 'meta-description' | 'h1' | 'alt-tags' | 'schema' | 'headings' | 'images';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  suggestion: string;
  fixable: boolean;
  currentValue?: string;
  suggestedValue?: string;
}

export interface FixRequest {
  fixes: {
    issueId: string;
    type: string;
    content: string;
    approved: boolean;
  }[];
}

export interface AuditProgress {
  status: 'pending' | 'scraping' | 'analyzing' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStep: string;
  pagesProcessed: number;
  totalPages: number;
}

export interface AIContentRequest {
  pageType: string;
  targetKeyword: string;
  currentContent?: string;
  contentType: 'title' | 'meta-description' | 'alt-tag' | 'schema';
}

export interface AIContentResponse {
  content: string;
  explanation: string;
}

export interface JSSnippet {
  projectId: string;
  snippet: string;
  isInstalled: boolean;
  lastVerified?: string;
}

export interface AutoSelectRequest {
  sitemap_urls: string[];
  max_pages: number;
}

export interface AutoSelectResponse {
  audit_id: string;
  selected_pages: Array<{
    page_id: string;
    url: string;
    priority: number;
    sitemap_url: string;
    estimated_type: string;
    suggested_keywords: string[];
  }>;
  total_available: number;
}

export interface GroupedIssue {
  issue_id: string;
  audit_page_id: string;
  page_url: string;
  page_type: string;
  target_keyword: string;
  severity: 'high' | 'medium' | 'low' | 'critical' | 'warning' | 'info';
  message: string;
  current_value: string;
  suggested_value?: string;
  suggestion?: string;
  element?: string;
  can_auto_fix?: boolean;
  fix_status?: 'pending' | 'applied' | 'approved' | 'rejected';
  fix_value?: string;
  approved?: number;
  is_merged?: boolean;
  sub_issues?: {
    count: number;
    issues: Array<{
      message: string;
      severity: string;
      suggestion: string;
    }>;
  };
}

export interface GroupedAuditResults {
  audit_id: string;
  completed_date: string;
  total_issues: number;
  issues_by_severity: {
    high: number;
    medium: number;
    low: number;
  };
  issues_by_category: {
    title: GroupedIssue[];
    'meta-description': GroupedIssue[];
    h1: GroupedIssue[];
    'alt-tags': GroupedIssue[];
    images: GroupedIssue[];
    schema: GroupedIssue[];
    headings: GroupedIssue[];
  };
}

export interface BulkFixRequest {
  fix_mode: 'all' | 'category' | 'individual';
  category?: string;
  fix_ids?: string[];
}

export interface BulkFixResponse {
  applied_count: number;
  success: boolean;
  js_snippet_required: boolean;
  js_snippet?: string;
  results: Array<{
    issue_id: string;
    status: string;
    message: string;
  }>;
}

export interface EmailNotificationStatus {
  email_sent: boolean;
  email_timestamp: string;
}