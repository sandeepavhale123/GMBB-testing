export interface GeoProject {
  id: string;
  name: string;
  numberOfChecks: number;
  createdDate: string;
  notificationEmail: string;
  keywords: string[];
  isActive: boolean;
}

export interface CreditHistoryItem {
  id: string;
  keyword: string;
  credit: number;
  date: string;
}

export interface ApiCreditHistoryItem {
  created_at: string;
  type: string;
  credit: string;
  keyword: string;
}

export interface CreditHistoryRequest {
  page: number;
  limit: number;
  search: string;
}

export interface CreditHistoryResponse {
  code: number;
  message: string;
  data: {
    creditHistory: ApiCreditHistoryItem[];
  };
}

export interface GoogleApiKeyData {
  id: string;
  apiKey: string;
  isValid: boolean;
  lastValidated: string;
  quotaUsed: number;
  quotaLimit: number;
}

export interface GeoOverviewResponse {
  code: number;
  message: string;
  data: {
    noOfKeywords: number;
    scheduleKeywords: number;
    totalProject: number;
    credits: {
      allowedCredit: number;
      remainingCredit: number;
    };
  };
}

export interface DashboardSummary {
  totalProjects: number;
  totalKeywords: number;
  scheduledScans: number;
  availableCredits: number;
  allowedCredits: number;
}

// New interfaces for GEO Projects API
export interface GeoProjectsRequest {
  page: number;
  limit: number;
  search: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiProject {
  id: string;
  user_id: string;
  project_name: string;
  email: string | null;
  kcount: string;
  encKey: string;
}

export interface GeoProjectsResponse {
  code: number;
  message: string;
  data: {
    projects: ApiProject[];
    pagination: PaginationInfo;
  };
}