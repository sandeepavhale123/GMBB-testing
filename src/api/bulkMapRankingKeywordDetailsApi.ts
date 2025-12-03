import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// Request Types
export interface BulkMapRankingKeywordDetailsRequest {
  keywordId: number;
}

// Response Types
export interface RankDistribution {
  counts: {
    range_1_3: number;
    range_4_10: number;
    range_11_15: number;
    range_16_20: number;
    "range_20+": number;
  };
  percentages: {
    range_1_3: number;
    range_4_10: number;
    range_11_15: number;
    range_16_20: number;
    "range_20+": number;
  };
}

export interface KeywordDetails {
  keywordName: string;
  searchBy: string;
  scheduleFrequency: string;
  lastCheck: string; // "YYYY-MM-DD"
  nextCheck: string; // "YYYY-MM-DD"
}

export interface BulkMapRankingKeywordDetailsResponse {
  code: number;
  message: string;
  data: {
    rankDistribution: RankDistribution;
    keywordDetails: KeywordDetails;
  };
}

// API function
const getBulkMapRankingKeywordDetails = async (keywordId: number): Promise<BulkMapRankingKeywordDetailsResponse> => {
  const response = await axiosInstance.post("/get-mapranking-keyword-overview", {
    keywordId,
  });
  return response.data;
};

// Custom hook
export const useBulkMapRankingKeywordDetails = (keywordId: number) => {
  return useQuery({
    queryKey: ["bulk-map-ranking-keyword-details", keywordId],
    queryFn: () => getBulkMapRankingKeywordDetails(keywordId),
    enabled: !!keywordId,
    staleTime: 2 * 60 * 1000, // 2 minutes.
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
