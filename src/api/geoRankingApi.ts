import axiosInstance from "./axiosInstance";

// Types for API requests and responses
export interface KeywordData {
  id: string;
  keyword: string;
  date: string;
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
  
  console.log('🗺️ getKeywordDetails - API call:', {
    listingId,
    keywordId,
    dateId
  });
  
  const response = await axiosInstance.post("/get-keyword-details", payload);
  
  console.log('🗺️ getKeywordDetails - API response:', {
    code: response.data.code,
    rankDetailsCount: response.data.data?.rankDetails?.length || 0,
    datesCount: response.data.data?.dates?.length || 0
  });
  
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

export const getGridCoordinates = async (
  listingId: number,
  grid: number,
  distance: number | string,
  latlong: string
): Promise<GridCoordinatesResponse> => {
  const response = await axiosInstance.post("/get-grid-coordinates", {
    listingId,
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
  distanceValue: number;
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
  const response = await axiosInstance.post("/get-keyword-search-volume", requestData);
  return response.data;
};

// Add Search Keyword API
export interface AddSearchKeywordRequest {
  listingId: number;
  keywords: string[];
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
  listingId: number;
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
