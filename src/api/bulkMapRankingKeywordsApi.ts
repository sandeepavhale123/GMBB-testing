import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// Request Types
export interface BulkMapRankingKeywordsRequest {
  search: string;
  page: number;
  limit: number;
}

// Response Types
export interface BulkMapRankingKeyword {
  id: string;
  keyword: string;
  user_id: string;
  searchEngine: string;
  googleRegion: string;
  language: string;
  schedule: string; // "onetime", "daily", "weekly", "monthly"
  searchby: string;
  last_check: string; // Date string "YYYY-MM-DD"
  next_check: string; // Date string "YYYY-MM-DD"
  status: string; // "0" = completed, "1" = pending
  noOfKeyword: string; // Number as string
}

export interface BulkMapRankingKeywordsResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    per_page: number;
    total_records: number;
    total_pages: number;
    keywords: BulkMapRankingKeyword[];
  };
}

// API function
const getBulkMapRankingKeywords = async (
  params: BulkMapRankingKeywordsRequest
): Promise<BulkMapRankingKeywordsResponse> => {
  const response = await axiosInstance.post("/get-mapranking-keywords", params);
  return response.data;
};

// Delete Types
export interface DeleteMapRankingKeywordRequest {
  keywordId: number;
}

export interface DeleteMapRankingKeywordResponse {
  code: number;
  message: string;
  data: {
    keyId: number;
    status: string;
  };
}

// Delete API function
const deleteMapRankingKeyword = async (
  keywordId: number
): Promise<DeleteMapRankingKeywordResponse> => {
  const response = await axiosInstance.post("/delete-mapranking-keyword", {
    keywordId,
  });
  return response.data;
};

// Custom hook
export const useBulkMapRankingKeywords = (
  search: string,
  page: number,
  limit: number
) => {
  return useQuery({
    queryKey: ["bulk-map-ranking-keywords", search, page, limit],
    queryFn: () => getBulkMapRankingKeywords({ search, page, limit }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Export delete function
export { deleteMapRankingKeyword };
