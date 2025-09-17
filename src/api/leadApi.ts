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

// Lead Classifier Interfaces
export interface GetLeadClassifierDetailsRequest {
  leadId: number;
}

export interface GetLeadClassifierDetailsResponse {
  code: number;
  message: string;
  data: {
    email: string | null;
    business_name: string;
    phone: string;
    website: string;
    address: string;
    leadCategoryLabel: string;
    leadCategoryValue: string;
    leadnote: string;
  };
}

export interface UpdateLeadClassifierDetailsRequest {
  leadId: number;
  leadCategoryValue: number;
  leadNote: string;
}

export interface UpdateLeadClassifierDetailsResponse {
  code: number;
  message: string;
  data: {
    leadId: number;
    leadCategoryValue: number;
    leadNote: string;
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

// Lead Summary API interfaces
export interface GetLeadSummaryResponse {
  code: number;
  message: string;
  data: {
    totalLeads: number;
    credits: {
      remaining: number;
      total: number;
    };
    totalEmailTemplates: number;
    convertedLeads: number;
  };
}

// Lead Summary API function
export const getLeadSummary = async (): Promise<GetLeadSummaryResponse> => {
  const response = await apiClient.post<GetLeadSummaryResponse>('/lead/get-lead-summary', {});
  return response.data;
};

// Lead Summary React Query hook
export const useLeadSummary = () => {
  return useQuery({
    queryKey: ['leadSummary'],
    queryFn: () => getLeadSummary(),
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

// GEO Report API interfaces
export interface CreateGeoReportRequest {
  reportId: string;
  keywords: string;
  distanceValue: number;
  gridSize: number;
}

export interface CreateGeoReportResponse {
  code: number;
  message: string;
  data: {
    reportId: string;
    reportUrl: string;
  };
}

// GEO Report API function
export const createGeoReport = async (params: CreateGeoReportRequest): Promise<CreateGeoReportResponse> => {
  const response = await apiClient.post<CreateGeoReportResponse>('/lead/create-geo-report', params);
  return response.data;
};

// GEO Report React Query hook
export const useCreateGeoReport = () => {
  return useMutation({
    mutationFn: createGeoReport,
    onSuccess: (data) => {
      toast.success('GEO Ranking report created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create GEO ranking report');
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
    reportDetails: {
      bname: string;
      website: string;
      address: string;
      state: string;
      phone: string;
      email: string;
      category: string;
      mapurl: string;
    };
    existingCitation: Array<{
      title: string;
      url: string;
      host: string;
      found_bname: string;
      found_phone: string;
      created_at: string;
      count: number;
    }>;
    possibleCitation: Array<{
      sitename: string;
      host: string | null;
      site_status: string;
      url: string;
    }>;
    summary: {
      totalCitations: number;
      accuracyScore: number;
      missingCitations: number;
      duplicateListings: number;
    };
  };
}

// Get Citation Audit Report API function
export const getCitationAuditReport = async (params: GetCitationAuditReportRequest): Promise<GetCitationAuditReportResponse> => {
  const response = await apiClient.post<GetCitationAuditReportResponse>('/lead/get-citation-report', params);
  return response.data;
};

// Lead Report Branding interfaces
export interface GetLeadReportBrandingRequest {
  reportId: string;
}

export interface GetLeadReportBrandingResponse {
  code: number;
  message: string;
  data: {
    company_name: string;
    company_email: string;
    company_website: string;
    company_phone: string;
    company_address: string;
    company_logo: string;
  };
}

// Get Lead Report Branding function
export const getLeadReportBranding = async (
  params: GetLeadReportBrandingRequest
): Promise<GetLeadReportBrandingResponse> => {
  const response = await apiClient.post("/lead/get-report-branding", params);
  return response.data;
};

// Get Lead Report Branding React Query hook
export const useGetLeadReportBranding = (reportId: string) => {
  return useQuery({
    queryKey: ['leadReportBranding', reportId],
    queryFn: () => getLeadReportBranding({ reportId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled: !!reportId,
  });
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

// GMB Prospect Report API interfaces
export interface CreateGmbProspectReportRequest {
  reportId: string;
}

export interface CreateGmbProspectReportResponse {
  code: number;
  message: string;
  data: {
    reportId: string;
    reportUrl: string;
  };
}

export interface GetGmbProspectReportRequest {
  reportId: string;
}

export interface GetGmbProspectReportResponse {
  code: number;
  message: string;
  data: {
    reportDetails: {
      bname: string;
      website: string;
      address: string;
      state: string;
      phone: string;
      email: string;
      category: string;
      mapurl: string;
    };
    scoreDetails: {
      totalPass: number;
      totalFail: number;
      passPercent: number;
      failPercent: number;
    };
    breakdownDetails: Array<{
      id: number;
      title: string;
      impact: string;
      status: string;
    }>;
    compData: Array<{
      position: string | number;
      bname: string;
      cid: string;
      rating: number;
      reviews: number;
    }>;
    citationCompData: Array<{
      position: string | number;
      bname: string;
      cid: string;
      localCitation: number;
    }>;
    advancedSuggestions: Array<{
      id: number;
      suggestion: string;
      impact: string;
    }>;
    recommendationsSummary: string[];
  };
}

// GMB Prospect Report API functions
export const createGmbProspectReport = async (params: CreateGmbProspectReportRequest): Promise<CreateGmbProspectReportResponse> => {
  const response = await apiClient.post<CreateGmbProspectReportResponse>('/lead/create-prospect-report', params);
  return response.data;
};

export const getGmbProspectReport = async (params: GetGmbProspectReportRequest): Promise<GetGmbProspectReportResponse> => {
  const response = await apiClient.post<GetGmbProspectReportResponse>('/lead/get-prospect-report', params);
  return response.data;
};

// GMB Prospect Report React Query hooks
export const useCreateGmbProspectReport = () => {
  return useMutation({
    mutationFn: createGmbProspectReport,
    onSuccess: (data) => {
      toast.success('GMB Prospect report created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create GMB Prospect report');
    },
  });
};

export const useGetGmbProspectReport = (reportId: string) => {
  return useQuery({
    queryKey: ['lead-prospect-report', reportId],
    queryFn: () => getGmbProspectReport({ reportId }),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// ============= GEO Report API =============

export interface CreateLeadGeoReportRequest {
  reportId: string;
  keywords: string;
  distanceValue: number;
  gridSize: number;
}

export interface CreateLeadGeoReportResponse {
  success: boolean;
  message: string;
  data?: {
    reportId: string;
  };
}

export interface GetLeadGeoReportRequest {
  reportId: string;
}

export interface GetLeadGeoReportResponse {
  success: boolean;
  data: {
    keywords: Array<{
      id: string;
      keyword: string;
      date: string;
    }>;
    projectName: string;
  };
}

// GEO Keywords API interfaces
export interface GetLeadGeoKeywordsRequest {
  reportId: string;
}

export interface GetLeadGeoKeywordsResponse {
  code: number;
  message: string;
  data: {
    reportDetails: {
      bname: string;
      website: string;
      address: string;
      state: string;
      phone: string;
      email: string;
      category: string;
      mapurl: string;
    };
    keywordDetails: Array<{
      keywordId: string;
      keyword: string;
      date: string;
    }>;
  };
}

// Keyword Details API interfaces
export interface GetLeadKeywordDetailsRequest {
  reportId: string;
  keywordId: string;
}

export interface GetLeadKeywordDetailsResponse {
  code: number;
  message: string;
  data: {
    rankDetails: Array<{
      positionId: string;
      rank: string;
      coordinate: string;
    }>;
    rankStats: {
      atr: string;
      atrp: string;
      solvability: string;
    };
  };
}

// GEO Report API functions
export const createLeadGeoReport = async (params: CreateLeadGeoReportRequest): Promise<CreateLeadGeoReportResponse> => {
  const response = await apiClient.post<CreateLeadGeoReportResponse>('/lead/create-geo-report', params);
  return response.data;
};

export const getLeadGeoReport = async (params: GetLeadGeoReportRequest): Promise<GetLeadGeoReportResponse> => {
  const response = await apiClient.post<GetLeadGeoReportResponse>('/lead/get-geo-report', params);
  return response.data;
};

// GEO Keywords API functions
export const getLeadGeoKeywords = async (params: GetLeadGeoKeywordsRequest): Promise<GetLeadGeoKeywordsResponse> => {
  const response = await apiClient.post<GetLeadGeoKeywordsResponse>('/lead/get-geo-keywords', params);
  return response.data;
};

export const getLeadKeywordDetails = async (params: GetLeadKeywordDetailsRequest): Promise<GetLeadKeywordDetailsResponse> => {
  const response = await apiClient.post<GetLeadKeywordDetailsResponse>('/lead/get-keyword-details', params);
  return response.data;
};

// GEO Report React Query hooks
export const useCreateLeadGeoReport = () => {
  return useMutation({
    mutationFn: createLeadGeoReport,
    onSuccess: (data) => {
      toast.success('GEO Ranking report created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create GEO Ranking report');
    },
  });
};

export const useGetLeadGeoReport = (reportId: string) => {
  return useQuery({
    queryKey: ['lead-geo-report', reportId],
    queryFn: () => getLeadGeoReport({ reportId }),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useGetLeadGeoKeywords = (reportId: string) => {
  return useQuery({
    queryKey: ['lead-geo-keywords', reportId],
    queryFn: () => getLeadGeoKeywords({ reportId }),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useGetLeadKeywordDetails = (reportId: string, keywordId: string) => {
  return useQuery({
    queryKey: ['lead-keyword-details', reportId, keywordId],
    queryFn: () => getLeadKeywordDetails({ reportId, keywordId }),
    enabled: !!reportId && !!keywordId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Keyword Position Details API interfaces
export interface GetKeywordPositionDetailsRequest {
  positionId: number;
}

export interface GetKeywordPositionDetailsResponse {
  code: number;
  message: string;
  data: {
    keywordDetails: Array<{
      name: string;
      address: string;
      rating: string;
      review: string;
      position: number;
      selected: boolean;
    }>;
    coordinate: string;
  };
}

// Keyword Position Details API function
export const getKeywordPositionDetails = async (params: GetKeywordPositionDetailsRequest): Promise<GetKeywordPositionDetailsResponse> => {
  const response = await apiClient.post<GetKeywordPositionDetailsResponse>('/lead/get-keyword-position-details', params);
  return response.data;
};

// Keyword Position Details React Query hook
export const useGetKeywordPositionDetails = (positionId: number | null) => {
  return useQuery({
    queryKey: ['lead-keyword-position-details', positionId],
    queryFn: () => getKeywordPositionDetails({ positionId: positionId! }),
    enabled: !!positionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Lead Classifier API Functions
export const getLeadClassifierDetails = async (params: GetLeadClassifierDetailsRequest): Promise<GetLeadClassifierDetailsResponse> => {
  const { data } = await apiClient.post('/lead/get-leadclassifer-details', {
    leadId: params.leadId
  });
  return data;
};

export const updateLeadClassifierDetails = async (params: UpdateLeadClassifierDetailsRequest): Promise<UpdateLeadClassifierDetailsResponse> => {
  const { data } = await apiClient.post('/lead/update-leadclassifer-details', {
    leadId: params.leadId,
    leadCategoryValue: params.leadCategoryValue,
    leadNote: params.leadNote
  });
  return data;
};

// Lead Classifier React Query hooks
export const useGetLeadClassifierDetails = (leadId: number | null) => {
  return useQuery({
    queryKey: ['lead-classifier-details', leadId],
    queryFn: () => getLeadClassifierDetails({ leadId: leadId! }),
    enabled: !!leadId,
    retry: 2,
  });
};

export const useUpdateLeadClassifierDetails = () => {
  return useMutation({
    mutationFn: updateLeadClassifierDetails,
    onSuccess: () => {
      toast.success('Lead classification updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update lead classification');
    },
  });
};