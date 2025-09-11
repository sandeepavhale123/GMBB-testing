import apiClient from '@/api/axiosInstance';
import { useQuery } from '@tanstack/react-query';

// API Response interfaces
export interface ApiLead {
  id: string;
  email: string;
  business_name: string;
  phone: string;
  generated_date: string;
  report_id: string;
  reportTypeLabel: string;
  leadCategoryLabel: string;
  reports: {
    gmbReport: {
      status: number;
      viewUrl: string | null;
    };
    onPage: {
      status: number;
      viewUrl: string | null;
    };
    citation: {
      status: number;
      viewUrl: string | null;
    };
    prospect: {
      status: number;
      viewUrl: string | null;
    };
  };
}

export interface GetLeadsRequest {
  page: number;
  limit: number;
  search: string;
}

export interface GetLeadsResponse {
  code: number;
  message: string;
  data: {
    leads: ApiLead[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// API function
export const getLeads = async (params: GetLeadsRequest): Promise<GetLeadsResponse> => {
  const response = await apiClient.post<GetLeadsResponse>('/lead/get-dashboard-leads', params);
  return response.data;
};

// Credit History API interfaces
export interface CreditHistoryItem {
  id: string;
  user_id: string;
  business_name: string;
  credits: string;
  report_type: string;
  date: string;
}

export interface GetCreditHistoryRequest {
  page: number;
  limit: number;
  search: string;
}

export interface GetCreditHistoryResponse {
  code: number;
  message: string;
  data: {
    history: CreditHistoryItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// API functions
export const getCreditHistory = async (params: GetCreditHistoryRequest): Promise<GetCreditHistoryResponse> => {
  const response = await apiClient.post<GetCreditHistoryResponse>('/lead/get-lead-credit-history', params);
  return response.data;
};

// Credit Usage API interfaces
export interface GetCreditsResponse {
  code: number;
  message: string;
  data: {
    allowedCredit: number;
    remainingCredit: number;
  };
}

// API functions
export const getLeadCredits = async (): Promise<GetCreditsResponse> => {
  const response = await apiClient.post<GetCreditsResponse>('/lead/get-lead-credits', {});
  return response.data;
};

// React Query hooks
export const useLeads = (params: GetLeadsRequest) => {
  return useQuery({
    queryKey: ['leads', params.page, params.limit, params.search],
    queryFn: () => getLeads(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useCreditHistory = (params: GetCreditHistoryRequest) => {
  return useQuery({
    queryKey: ['creditHistory', params.page, params.limit, params.search],
    queryFn: () => getCreditHistory(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled: true,
  });
};

export const useLeadCredits = () => {
  return useQuery({
    queryKey: ['leadCredits'],
    queryFn: () => getLeadCredits(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};