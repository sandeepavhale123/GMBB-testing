import apiClient from '@/api/axiosInstance';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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

// Add Lead API interfaces
export interface AddLeadRequest {
  inputtype: "0" | "1" | "2"; // 0 - google auto suggest, 1 - map url, 2-cid
  inputtext: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface AddLeadResponse {
  code: number;
  message: string;
  data: {
    leadId: number;
  };
}

// Add Lead API function
export const addLead = async (params: AddLeadRequest): Promise<AddLeadResponse> => {
  const response = await apiClient.post<AddLeadResponse>('/lead/add-lead', params);
  return response.data;
};

// GMB Health Report API interfaces
export interface CreateGmbHealthReportRequest {
  reportId: string;
}

export interface CreateGmbHealthReportResponse {
  code: number;
  message: string;
  data: {
    reportId: string;
    reportUrl: string;
  };
}

// GMB Health Report API function
export const createGmbHealthReport = async (params: CreateGmbHealthReportRequest): Promise<CreateGmbHealthReportResponse> => {
  const response = await apiClient.post<CreateGmbHealthReportResponse>('/lead/create-gbp-report', params);
  return response.data;
};

// GMB Health Report React Query hook
export const useCreateGmbHealthReport = () => {
  return useMutation({
    mutationFn: createGmbHealthReport,
    onSuccess: (data) => {
      toast.success('GMB Health report created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create GMB Health report');
    },
  });
};

// Get GMB Health Report API interfaces
export interface GetGmbHealthReportRequest {
  reportId: string;
}

export interface GetGmbHealthReportResponse {
  code: number;
  message: string;
  data: {
    reportId: string;
    healthScore: string;
    reviewCount: string;
    reviewRating: string;
    businessInfo: {
      businessName: string;
      address: string;
      category: string;
      phoneNumber: string;
      website: string;
      mapUrl: string;
      photo: string;
    };
    listingReputation: {
      reviewCount: string;
      averageRating: string;
      reviews: Array<{
        position: number;
        source: string;
        body: string;
        id: string;
        rating: number;
        source_link: string;
        source_image: string;
        source_id: string;
        source_review_count: number;
        date: string;
        date_utc: string;
      }>;
    };
    communication: {
      posts: Array<{
        image: string;
        link: string;
        date: string;
        title: string;
        body: string;
        position: number;
      }>;
      businessHours: {
        per_day: Array<{
          name: string;
          value: string;
          date: string;
          day_number: number;
          parsed: Array<{
            open: string;
            close: string;
          }>;
        }>;
      };
      photos: Array<{
        thumbnail: string;
        image: string;
      }>;
    };
    comparison: Array<{
      name: string;
      category: string;
      additionalCategory: string;
      website: string;
      reviewCount: number;
      rating: number;
      keywordInName: string;
    }>;
    top20Competitors: {
      searchInfo: {
        searchUrl: string;
        searchKeyword: string;
        searchLocation: string;
        message: string;
      };
      yourBusiness: {
        position: number;
        name: string;
        address: string;
        phoneNumber: string;
        category: string;
        website: string;
        mapUrl: string;
        reviewCount: string;
        averageRating: string;
      };
      competitors: Array<{
        position: number;
        name: string;
        address: string;
        phoneNumber: string;
        category: string;
        additionalCategory: string;
        website: string;
        mapUrl: string;
        reviewCount: number;
        averageRating: number;
        isYourBusiness: boolean;
      }>;
    };
    categories: {
      topCategory: Array<{
        rank: number;
        categories: Array<{
          category: string;
          count: number;
        }>;
      }>;
      all: Array<{
        category: string;
        count: number;
      }>;
    };
    recommendations: {
      gmbChecklist: Array<{
        title: string;
        description: string;
      }>;
      quickHack: string[];
    };
  };
}

// Get GMB Health Report API function
export const getGmbHealthReport = async (params: GetGmbHealthReportRequest): Promise<GetGmbHealthReportResponse> => {
  const response = await apiClient.post<GetGmbHealthReportResponse>('/lead/get-gbp-report', params);
  return response.data;
};

// Get GMB Health Report React Query hook
export const useGetGmbHealthReport = (reportId: string) => {
  return useQuery({
    queryKey: ['gmbHealthReport', reportId],
    queryFn: () => getGmbHealthReport({ reportId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled: !!reportId,
  });
};

// Lead Citation Report API interfaces
export interface CreateLeadCitationReportRequest {
  leadId: string;
  bname: string;
  phone: string;
  city: string;
  keyword: string;
  lat: string;
  long: string;
  short_country: string;
}

export interface CreateLeadCitationReportResponse {
  code: number;
  message: string;
  data: {
    reportId: string;
    reportUrl: string;
  };
}

// Lead Citation Report API function
export const createLeadCitationReport = async (params: CreateLeadCitationReportRequest): Promise<CreateLeadCitationReportResponse> => {
  const response = await apiClient.post<CreateLeadCitationReportResponse>('/lead/create-citation-report', params);
  return response.data;
};

// Lead Citation Report React Query hook
export const useCreateLeadCitationReport = () => {
  return useMutation({
    mutationFn: createLeadCitationReport,
    onSuccess: (data) => {
      toast.success('Citation audit report created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create citation audit report');
    },
  });
};

// Get Citation Audit Report API interfaces
export interface GetCitationAuditReportRequest {
  reportId: string;
}

export interface GetCitationAuditReportResponse {
  code: number;
  message: string;
  data: {
    reportId: string;
    listingName: string;
    address: string;
    date: string;
    citations: {
      total: number;
      listed: number;
      nonListed: number;
      missing: number;
      duplicates: number;
      accuracy: number;
    };
    existingCitations: Array<{
      siteName: string;
      businessName: string;
      phone: string;
    }>;
    possibleCitations: Array<{
      siteName: string;
      businessName: string;
      phone: string;
    }>;
  };
}

// Get Citation Audit Report API function
export const getCitationAuditReport = async (params: GetCitationAuditReportRequest): Promise<GetCitationAuditReportResponse> => {
  const response = await apiClient.post<GetCitationAuditReportResponse>('/lead/get-citation-report', params);
  return response.data;
};

// Get Citation Audit Report React Query hook
export const useGetCitationAuditReport = (reportId: string) => {
  return useQuery({
    queryKey: ['citationAuditReport', reportId],
    queryFn: () => getCitationAuditReport({ reportId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled: !!reportId,
  });
};