export interface GeoProject {
  id: string;
  name: string;
  numberOfChecks: number;
  createdDate: string;
  notificationEmail: string;
  keywords: string[];
  isActive: boolean;
  encKey: string;
}

export interface CreditHistoryItem {
  id: string;
  keyword: string;
  credit: number;
  date: string;
  type: string;
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

// New interfaces for Google API Key management
export interface UpdateApiKeyRequest {
  apiKey: string;
}

export interface UpdateApiKeyResponse {
  code: number;
  message: string;
  data: {
    apiKey: string;
  };
}

export interface GetMapApiKeyResponse {
  code: number;
  message: string;
  data: {
    apiKey: string;
  };
}

export interface DeleteApiKeyRequest {
  isDelete: string;
}

export interface DeleteApiKeyResponse {
  code: number;
  message: string;
  data: [];
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
  created_at: string;
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

// New interfaces for Create GEO Project API
export interface CreateGeoProjectRequest {
  projectName: string;
  emails: string;
}

export interface CreateGeoProjectResponse {
  code: number;
  message: string;
  data: {
    project: {
      user_id: string;
      project_name: string;
      email: string;
      created_at: string;
      id: number;
      encKey: string;
    };
  };
}

// New interfaces for Update GEO Project API
export interface UpdateGeoProjectRequest {
  projectId: number;
  projectName: string;
  emails: string;
}

export interface UpdateGeoProjectResponse {
  code: number;
  message: string;
  data: {
    projectId: number;
    projectName: string;
    emails: string;
  };
}

// New interfaces for Delete GEO Project API
export interface DeleteGeoProjectRequest {
  projectId: number;
  confirm: string;
}

export interface DeleteGeoProjectResponse {
  code: number;
  message: string;
  data: {
    deletedProjectId: number;
    deletedMapIds: string[];
  };
}