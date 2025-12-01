import axiosInstance from "./axiosInstance";
import type {
  GeoOverviewResponse,
  GeoProjectsRequest,
  GeoProjectsResponse,
  CreditHistoryRequest,
  CreditHistoryResponse,
  CreateGeoProjectRequest,
  CreateGeoProjectResponse,
  UpdateGeoProjectRequest,
  UpdateGeoProjectResponse,
  DeleteGeoProjectRequest,
  DeleteGeoProjectResponse,
  UpdateApiKeyRequest,
  UpdateApiKeyResponse,
  GetMapApiKeyResponse,
  DeleteApiKeyRequest,
  DeleteApiKeyResponse,
} from "@/modules/GEO-Ranking/types";

// Types for API requests and responses
export interface DeleteKeywordRequest {
  listingId?: number; // Optional - used by Keywords Page
  projectId?: number; // Optional - used by GEO Ranking Module
  keywordIds: number[];
  isDelete: string;
}

export interface DeleteKeywordResponse {
  code: number;
  message: string;
  data?: {
    deleted_keywords: string[];
  };
}

// Response type for GEO Ranking Module delete
export interface DeleteGeoKeywordResponse {
  code: number;
  message: boolean | string;
  data?: {
    deleted_keywords: string[];
  };
}

export interface ShareableKeywordsRequest {
  reportId: string;
}

export interface ShareableKeywordsResponse {
  code: number;
  message: string;
  data: {
    projectName: string;
    keywords: Array<{
      id: string;
      keyword: string;
      date: string;
    }>;
    noOfKeyword: number;
  };
}
export interface KeywordData {
  id: string;
  keyword: string;
  date: string;
  encKey?: string;
}

export interface Credits {
  allowedCredit: string;
  remainingCredit: number;
}

export interface KeywordsListResponse {
  code: number;
  message: string;
  data: {
    credits: Credits;
    keywords: KeywordData[];
    noOfKeyword: number;
  };
}

export interface ProjectDetails {
  id: string;
  sab: string;
  keyword: string;
  mappoint: string;
  prev_id: string;
  distance: string;
  grid: string;
  last_checked: string;
  schedule: string;
  date: string;
}

export interface RankDetail {
  coordinate: string;
  positionId: string;
  rank: string;
}

export interface DateInfo {
  id: string;
  prev_id: number | string;
  date?: string;
}

export interface RankStats {
  atr: string;
  atrp: string;
  solvability: string;
}

export interface UnderPerformingArea {
  id: string;
  areaName: string;
  coordinate: string;
  compRank: number;
  compName: string;
  compRating: string;
  compReview: string;
  priority: string;
  youRank: string;
  youName: string;
  youRating: string;
  youReview: string;
}

export interface KeywordDetailsData {
  projectDetails: ProjectDetails;
  rankDetails: RankDetail[];
  dates: DateInfo[];
  rankStats: RankStats;
  underPerformingArea: UnderPerformingArea[];
}

export interface KeywordDetailsResponse {
  code: number;
  message: string;
  data: KeywordDetailsData;
}

export interface KeywordQueueResponse {
  code: number;
  message: string;
  data: [];
}

export type KeywordDetailsOrQueueResponse =
  | KeywordDetailsResponse
  | KeywordQueueResponse;

// New interfaces for keyword position details
export interface KeywordDetail {
  name: string;
  address: string;
  rating: string;
  review: string;
  position: number;
  selected: boolean;
}

export interface KeywordPositionResponse {
  code: number;
  message: string;
  data: {
    keywordDetails: KeywordDetail[];
    coordinate: string;
  };
}

export interface DefaultCoordinatesResponse {
  code: number;
  message: string;
  data: {
    latlong: string;
  };
}

// API functions
export const getKeywords = async (
  listingId: number
): Promise<KeywordsListResponse> => {
  const response = await axiosInstance.post("/get-keywords", {
    listingId,
  });
  return response.data;
};

export const getKeywordDetails = async (
  listingId: number,
  keywordId: string,
  dateId?: string
): Promise<KeywordDetailsResponse> => {
  const payload: any = {
    listingId,
    keywordId,
    status: 0,
  };

  const response = await axiosInstance.post("/get-keyword-details", payload);
  return response.data;
};

export const getKeywordPositionDetails = async (
  listingId: number,
  keywordId: string,
  positionId: string
): Promise<KeywordPositionResponse> => {
  const response = await axiosInstance.post("/get-keyword-position-details", {
    listingId,
    keywordId,
    positionId,
  });
  return response.data;
};

// New interface for grid coordinates
export interface GridCoordinatesResponse {
  code: number;
  message: string;
  data: {
    allCoordinates: string[];
  };
}

export const getDefaultCoordinates = async (
  listingId: number
): Promise<DefaultCoordinatesResponse> => {
  const response = await axiosInstance.post("/get-default-coordinates", {
    listingId,
  });
  return response.data;
};

// Module-specific API function for GEO Ranking module default coordinates
export const getDefaultCoordinatesForGeoModule = async (
  searchType: number,
  inputText: string
): Promise<DefaultCoordinatesResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/get-default-coordinates",
    {
      searchType,
      inputText,
    }
  );
  return response.data;
};

export const getGridCoordinates = async (
  listingId: number,
  distance: number | string,
  latlong: string,
  grid: number
): Promise<GridCoordinatesResponse> => {
  const response = await axiosInstance.post("/get-grid-coordinates", {
    listingId,
    grid,
    distance,
    latlong,
  });
  return response.data;
};

// Module-specific API function for GEO Ranking module (without listingId)
export const getGridCoordinatesForGeoModule = async (
  distance: number | string,
  latlong: string,
  grid: number
): Promise<GridCoordinatesResponse> => {
  const response = await axiosInstance.post("/get-grid-coordinates", {
    grid,
    distance,
    latlong,
  });
  return response.data;
};

// New interface for check rank request
export interface CheckRankRequest {
  listingId: number;
  language: string;
  keywords: string;
  mapPoint: string;
  distanceValue: number | string;
  gridSize: number;
  searchDataEngine: string;
  scheduleCheck: string;
  latlng: string[];
}

// New interface for check rank response
export interface CheckRankResponse {
  code: number;
  message: string;
  data?: {
    keywordId?: number;
  };
}

export const getKeywordDetailsWithStatus = async (
  listingId: number,
  keywordId: string,
  status: number
): Promise<KeywordDetailsOrQueueResponse> => {
  const response = await axiosInstance.post("/get-keyword-details", {
    listingId,
    keywordId,
    status,
  });
  return response.data;
};

export const addKeywords = async (
  requestData: CheckRankRequest
): Promise<CheckRankResponse> => {
  const response = await axiosInstance.post("/add-keywords", requestData);
  return response.data;
};

// New interface for keyword status response
export interface KeywordStatusResponse {
  code: number;
  message: string;
  data: {
    keywords: Array<{
      keyword: string;
    }>;
  };
}

export const checkKeywordStatus = async (
  listingId: number
): Promise<KeywordStatusResponse> => {
  const response = await axiosInstance.post("/check-keyword-status", {
    listingId,
  });
  return response.data;
};

// New interface for refresh keyword request
export interface RefreshKeywordRequest {
  listingId: number;
  keywordId: string;
}

// New interface for refresh keyword response
export interface RefreshKeywordResponse {
  code: number;
  message: string;
  data: {
    projectDetails: {
      id: string;
      bname: string;
      sab: string;
      keyword: string;
      mappoint: string;
      prev_id: string;
      distance: string;
      grid: string;
      schedule: string;
      date: string;
      lang: string;
    };
    coordinate: string[];
    keywordId: number;
  };
}

export const refreshKeyword = async (
  requestData: RefreshKeywordRequest
): Promise<RefreshKeywordResponse> => {
  const response = await axiosInstance.post("/refresh-keyword", requestData);
  return response.data;
};

// Keyword Search Volume API
export interface KeywordSearchRequest {
  keywords: string[];
  country?: string;
  language?: string;
}

export interface KeywordSearchData {
  keyword: string;
  competition: string;
  competition_index: number;
  search_volume: number;
  low_top_of_page_bid: number;
  high_top_of_page_bid: number;
  cpc: number;
  last_month_searches: number;
}

export interface KeywordSearchResponse {
  code: number;
  message: string;
  data: KeywordSearchData[];
}

export const getKeywordSearchVolume = async (
  requestData: KeywordSearchRequest
): Promise<KeywordSearchResponse> => {
  const response = await axiosInstance.post(
    "/get-keyword-search-volume",
    requestData
  );
  return response.data;
};

// Add Search Keyword API
export interface AddSearchKeywordRequest {
  listingId: number;
  keywords: string[];
  language: string;
  distanceValue: number;
  gridSize: number;
}

export interface AddSearchKeywordResponse {
  code: number;
  message: string;
  data: [];
}

export const addSearchKeyword = async (
  requestData: AddSearchKeywordRequest
): Promise<AddSearchKeywordResponse> => {
  const response = await axiosInstance.post("/add-search-keyword", requestData);
  return response.data;
};

// Get Search Keywords API
export interface SearchKeywordRequest {
  listingId?: number;
  projectId?: number;
  page: number;
  limit: number;
}

export interface SearchKeywordData {
  id: string;
  keyword: string;
  date: string;
  solv: string;
  atrp: string;
  atr: string;
  status: string;
}

export interface SearchKeywordResponse {
  code: number;
  message: string;
  data: {
    keywords: SearchKeywordData[];
    noOfKeyword: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export const getSearchKeywords = async (
  requestData: SearchKeywordRequest
): Promise<SearchKeywordResponse> => {
  const response = await axiosInstance.post("/get-search-keyword", requestData);
  return response.data;
};

export const deleteKeywords = async (
  requestData: DeleteKeywordRequest
): Promise<DeleteKeywordResponse> => {
  try {
    const response = await axiosInstance.post("/delete-keyword", requestData);
    return response.data;
  } catch (error) {
    // console.error("Error deleting keywords:", error);
    throw error;
  }
};

// Delete keywords specifically for GEO Ranking Module (uses /geomodule/delete-keyword endpoint)
export const deleteGeoKeywords = async (
  requestData: DeleteKeywordRequest
): Promise<DeleteGeoKeywordResponse> => {
  try {
    const response = await axiosInstance.post(
      "/geomodule/delete-keyword",
      requestData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGeoOverview = async (): Promise<GeoOverviewResponse> => {
  const response = await axiosInstance.post("/geomodule/get-geo-overview");
  return response.data;
};

export const getGeoProjects = async (
  requestData: GeoProjectsRequest
): Promise<GeoProjectsResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/get-geo-project",
    requestData
  );
  return response.data;
};

export const getGeoCreditHistory = async (
  requestData: CreditHistoryRequest
): Promise<CreditHistoryResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/get-geo-credit-history",
    requestData
  );
  return response.data;
};

export const createGeoProject = async (
  requestData: CreateGeoProjectRequest
): Promise<CreateGeoProjectResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/create-geo-project",
    requestData
  );
  return response.data;
};

// Update GEO Project API - Force refresh
export const updateGeoProject = async (
  requestData: UpdateGeoProjectRequest
): Promise<UpdateGeoProjectResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/update-geo-project-details",
    requestData
  );
  return response.data;
};

export const deleteGeoProject = async (
  requestData: DeleteGeoProjectRequest
): Promise<DeleteGeoProjectResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/delete-geo-project",
    requestData
  );
  return response.data;
};

// Google API Key Management APIs
export const getMapApiKey = async (): Promise<GetMapApiKeyResponse> => {
  const response = await axiosInstance.post("/get-mapapi-key");
  return response.data;
};

export const updateApiKey = async (
  requestData: UpdateApiKeyRequest
): Promise<UpdateApiKeyResponse> => {
  const response = await axiosInstance.post("/update-apikey", requestData);
  return response.data;
};

export const deleteApiKey = async (
  requestData: DeleteApiKeyRequest
): Promise<DeleteApiKeyResponse> => {
  const response = await axiosInstance.post("/delete-mapapi-key", requestData);
  return response.data;
};

// Project-specific API functions for View Project Details page
export const getKeywordsForProject = async (
  projectId: number
): Promise<KeywordsListResponse> => {
  const response = await axiosInstance.post("/get-keywords", {
    projectId,
  });
  return response.data;
};

export const getKeywordDetailsForProject = async (
  projectId: number,
  keywordId: string,
  dateId?: string
): Promise<KeywordDetailsResponse> => {
  const payload: any = {
    projectId,
    keywordId,
    status: 0,
  };

  const response = await axiosInstance.post("/get-keyword-details", payload);
  return response.data;
};

export const getKeywordPositionDetailsForProject = async (
  projectId: number,
  keywordId: string,
  positionId: string
): Promise<KeywordPositionResponse> => {
  const response = await axiosInstance.post("/get-keyword-position-details", {
    projectId,
    keywordId,
    positionId,
  });
  return response.data;
};

export const checkKeywordStatusForProject = async (
  projectId: number
): Promise<KeywordStatusResponse> => {
  const response = await axiosInstance.post("/check-keyword-status", {
    projectId,
  });
  return response.data;
};

export const refreshKeywordForProject = async (
  projectId: number,
  keywordId: string
): Promise<RefreshKeywordResponse> => {
  const response = await axiosInstance.post("/refresh-keyword", {
    projectId,
    keywordId,
  });
  return response.data;
};

// Add Keywords to Project API for GEO Module
export interface AddKeywordsToProjectRequest {
  projectId: string;
  businessName: string;
  language: string;
  keywords: string;
  mapPoint: string;
  distanceValue: number | string;
  gridSize: number;
  searchDataEngine: string;
  scheduleCheck: string;
  latlng: string[];
  coordinates?: string;
}

export interface AddKeywordsToProjectResponse {
  code: number;
  message: string;
  data?: {
    keywordId?: number;
  };
}

export const addKeywordsToProject = async (
  requestData: AddKeywordsToProjectRequest
): Promise<AddKeywordsToProjectResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/add-keywords",
    requestData
  );
  return response.data;
};

// Shareable Keywords API for public reports
export const getShareableKeywords = async (
  requestData: ShareableKeywordsRequest
): Promise<ShareableKeywordsResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/get-shareable-keywords",
    requestData
  );
  return response.data;
};

// Shareable keyword details API types and function
export interface ShareableKeywordDetailsRequest {
  reportId: string;
  keywordId: number;
  status: number;
}

export interface ShareableKeywordDetailsResponse {
  code: number;
  message: string;
  data: {
    projectDetails: {
      id: string;
      sab: string;
      keyword: string;
      mappoint: string;
      prev_id: string;
      distance: string;
      grid: string;
      last_checked: string;
      schedule: string;
      date: string;
      coordinate: string;
    };
    underPerformingArea: Array<{
      id: string;
      areaName: string;
      coordinate: string;
      compRank: number;
      compName: string;
      compRating: string;
      compReview: string;
      priority: string;
      youRank: string;
      youName: string;
      youRating: string;
      youReview: string;
    }>;
    rankDetails: Array<{
      coordinate: string;
      positionId: string;
      rank: string;
    }>;
    dates: Array<{
      id: string;
      prev_id: number;
      date: string;
    }>;
    rankStats: {
      atr: string;
      atrp: string;
      solvability: string;
    };
  };
}

export const getShareableKeywordDetails = async (
  requestData: ShareableKeywordDetailsRequest
): Promise<ShareableKeywordDetailsResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/get-shareable-keyword-details",
    requestData
  );
  return response.data;
};

// Shareable keyword position details interfaces
export interface ShareableKeywordPositionDetailsRequest {
  reportId: string;
  keywordId: number;
  positionId: number;
}

export interface ShareableKeywordPositionDetailsResponse {
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

export const getShareableKeywordPositionDetails = async (
  requestData: ShareableKeywordPositionDetailsRequest
): Promise<ShareableKeywordPositionDetailsResponse> => {
  const response = await axiosInstance.post(
    "/geomodule/get-shareable-keyword-position-details",
    requestData
  );
  return response.data;
};
