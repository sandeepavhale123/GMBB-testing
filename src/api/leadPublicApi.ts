import { publicAxiosInstance } from "./publicAxiosInstance";
import { useQuery } from "@tanstack/react-query";

// Import and re-export types from leadApi to reuse them
import type {
  GetGmbHealthReportRequest,
  GetGmbHealthReportResponse,
  GetCitationAuditReportRequest,
  GetCitationAuditReportResponse,
  GetGmbProspectReportRequest,
  GetGmbProspectReportResponse,
  GetLeadReportBrandingRequest,
  GetLeadReportBrandingResponse,
  GetLeadGeoKeywordsRequest,
  GetLeadGeoKeywordsResponse,
  GetLeadKeywordDetailsRequest,
  GetLeadKeywordDetailsResponse,
  GetKeywordPositionDetailsRequest,
  GetKeywordPositionDetailsResponse,
} from "./leadApi";

// Re-export types for external use
export type {
  GetGmbHealthReportRequest,
  GetGmbHealthReportResponse,
  GetCitationAuditReportRequest,
  GetCitationAuditReportResponse,
  GetGmbProspectReportRequest,
  GetGmbProspectReportResponse,
  GetLeadReportBrandingRequest,
  GetLeadReportBrandingResponse,
  GetLeadGeoKeywordsRequest,
  GetLeadGeoKeywordsResponse,
  GetLeadKeywordDetailsRequest,
  GetLeadKeywordDetailsResponse,
  GetKeywordPositionDetailsRequest,
  GetKeywordPositionDetailsResponse,
};

// ============= Public GMB Health Report API =============

export const getGmbHealthReportPublic = async (
  params: GetGmbHealthReportRequest
): Promise<GetGmbHealthReportResponse> => {
  const response = await publicAxiosInstance.post<GetGmbHealthReportResponse>(
    "/lead/get-gbp-report",
    params
  );
  return response.data;
};

export const useGetGmbHealthReportPublic = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["gmbHealthReportPublic", reportId, language],
    queryFn: () => getGmbHealthReportPublic({ reportId, language }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled: !!reportId,
  });
};

// ============= Public Citation Audit Report API =============

export const getCitationAuditReportPublic = async (
  params: GetCitationAuditReportRequest
): Promise<GetCitationAuditReportResponse> => {
  const response = await publicAxiosInstance.post<GetCitationAuditReportResponse>(
    "/lead/get-citation-report",
    params
  );
  return response.data;
};

export const useGetCitationAuditReportPublic = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["citationAuditReportPublic", reportId, language],
    queryFn: () => getCitationAuditReportPublic({ reportId, language }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled: !!reportId,
  });
};

// ============= Public GMB Prospect Report API =============

export const getGmbProspectReportPublic = async (
  params: GetGmbProspectReportRequest
): Promise<GetGmbProspectReportResponse> => {
  const response = await publicAxiosInstance.post<GetGmbProspectReportResponse>(
    "/lead/get-prospect-report",
    params
  );
  return response.data;
};

export const useGetGmbProspectReportPublic = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["lead-prospect-report-public", reportId, language],
    queryFn: () => getGmbProspectReportPublic({ reportId, language }),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// ============= Public Lead Report Branding API =============

export const getLeadReportBrandingPublic = async (
  params: GetLeadReportBrandingRequest
): Promise<GetLeadReportBrandingResponse> => {
  const response = await publicAxiosInstance.post<GetLeadReportBrandingResponse>(
    "/lead/get-report-branding",
    params
  );
  return response.data;
};

export const useGetLeadReportBrandingPublic = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["leadReportBrandingPublic", reportId, language],
    queryFn: () => getLeadReportBrandingPublic({ reportId, language }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    enabled: !!reportId,
  });
};

// ============= Public GEO Keywords API =============

export const getLeadGeoKeywordsPublic = async (
  params: GetLeadGeoKeywordsRequest
): Promise<GetLeadGeoKeywordsResponse> => {
  const response = await publicAxiosInstance.post<GetLeadGeoKeywordsResponse>(
    "/lead/get-geo-keywords",
    params
  );
  return response.data;
};

export const useGetLeadGeoKeywordsPublic = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["lead-geo-keywords-public", reportId, language],
    queryFn: () => getLeadGeoKeywordsPublic({ reportId, language }),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// ============= Public Keyword Details API =============

export const getLeadKeywordDetailsPublic = async (
  params: GetLeadKeywordDetailsRequest
): Promise<GetLeadKeywordDetailsResponse> => {
  const response = await publicAxiosInstance.post<GetLeadKeywordDetailsResponse>(
    "/lead/get-keyword-details",
    params
  );
  return response.data;
};

export const useGetLeadKeywordDetailsPublic = (
  reportId: string,
  keywordId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["lead-keyword-details-public", reportId, keywordId, language],
    queryFn: () =>
      getLeadKeywordDetailsPublic({ reportId, keywordId, language }),
    enabled: !!reportId && !!keywordId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// ============= Public Keyword Position Details API =============

export const getKeywordPositionDetailsPublic = async (
  params: GetKeywordPositionDetailsRequest
): Promise<GetKeywordPositionDetailsResponse> => {
  const response = await publicAxiosInstance.post<GetKeywordPositionDetailsResponse>(
    "/lead/get-keyword-position-details",
    params
  );
  return response.data;
};

export const useGetKeywordPositionDetailsPublic = (positionId: number | null) => {
  return useQuery({
    queryKey: ["lead-keyword-position-details-public", positionId],
    queryFn: () =>
      getKeywordPositionDetailsPublic({ positionId: positionId! }),
    enabled: !!positionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
