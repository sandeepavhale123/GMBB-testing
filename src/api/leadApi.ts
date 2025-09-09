import apiClient from '@/lib/axios';
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

// React Query hook
export const useLeads = (params: GetLeadsRequest) => {
  return useQuery({
    queryKey: ['leads', params.page, params.limit, params.search],
    queryFn: () => getLeads(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};