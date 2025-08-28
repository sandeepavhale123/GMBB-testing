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
  rankType: 'local' | 'organic';
  credit: number;
  date: string;
  projectName?: string;
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