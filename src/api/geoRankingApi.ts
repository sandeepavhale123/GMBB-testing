import axiosInstance from './axiosInstance';

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

export interface KeywordDetailsResponse {
  code: number;
  message: string;
  data: {
    projectDetails: ProjectDetails;
    rankDetails: RankDetail[];
    dates: DateInfo[];
    rankStats: RankStats;
    underPerformingArea: UnderPerformingArea[];
  };
}

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

// New interface for default coordinates
export interface DefaultCoordinatesResponse {
  code: number;
  message: string;
  data: {
    latlong: string;
  };
}

// API functions
export const getKeywords = async (listingId: number): Promise<KeywordsListResponse> => {
  const response = await axiosInstance.post('/get-keywords', {
    listingId
  });
  return response.data;
};

export const getKeywordDetails = async (listingId: number, keywordId: string): Promise<KeywordDetailsResponse> => {
  const response = await axiosInstance.post('/get-keyword-details', {
    listingId,
    keywordId
  });
  return response.data;
};

export const getKeywordPositionDetails = async (listingId: number, keywordId: string, positionId: string): Promise<KeywordPositionResponse> => {
  const response = await axiosInstance.post('/get-keyword-position-details', {
    listingId,
    keywordId,
    positionId
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

export const getDefaultCoordinates = async (listingId: number): Promise<DefaultCoordinatesResponse> => {
  const response = await axiosInstance.post('/get-default-coordinates', {
    listingId
  });
  return response.data;
};

export const getGridCoordinates = async (
  listingId: number, 
  grid: number, 
  distance: number | string, 
  latlong: string
): Promise<GridCoordinatesResponse> => {
  const response = await axiosInstance.post('/get-grid-coordinates', {
    listingId,
    grid,
    distance,
    latlong
  });
  return response.data;
};
