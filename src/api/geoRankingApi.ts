
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

export interface KeywordDetailsResponse {
  code: number;
  message: string;
  data: {
    projectDetails: ProjectDetails;
    rankDetails: RankDetail[];
    dates: DateInfo[];
    rankStats: RankStats;
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
