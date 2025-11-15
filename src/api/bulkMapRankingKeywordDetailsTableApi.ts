import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// Request Types
export interface BulkMapRankingKeywordDetailsTableRequest {
  keywordId: number;
  page: number;
  limit: number;
  search: string;
}

// Response Types
export interface KeywordDetailRow {
  id: string;
  keyId: string;
  businessName: string;
  city: string;
  zipcode: string;
  latlong: string;
  domain: string;
  rank: string; // Can be "20+" or numeric
  result: string | null;
  date: string; // "YYYY-MM-DD"
  cid: string;
  prev_id: string;
  status: string;
  kStatus: string; // "0" = completed, "1" = pending
  schedule: string;
}

export interface BulkMapRankingKeywordDetailsTableResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    per_page: number;
    total_records: number;
    total_pages: number;
    keywordDetails: KeywordDetailRow[];
  };
}

// API function
const getBulkMapRankingKeywordDetailsTable = async (
  params: BulkMapRankingKeywordDetailsTableRequest
): Promise<BulkMapRankingKeywordDetailsTableResponse> => {
  const response = await axiosInstance.post(
    "/get-mapranking-keyword-details",
    params
  );
  return response.data;
};

// Custom hook
export const useBulkMapRankingKeywordDetailsTable = (
  keywordId: number,
  page: number,
  limit: number,
  search: string
) => {
  return useQuery({
    queryKey: ["bulk-map-ranking-keyword-details-table", keywordId, page, limit, search],
    queryFn: () =>
      getBulkMapRankingKeywordDetailsTable({ keywordId, page, limit, search }),
    enabled: !!keywordId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
