import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// API Types
export interface BulkMapRankingStatsResponse {
  code: number;
  message: string;
  data: {
    totalProjects: number;
    noOfKeywords: number;
    noOfSchedule: number;
    allowedCredit: number;
    remainingCredit: number;
  };
}

// API function
const getBulkMapRankingStats = async (): Promise<BulkMapRankingStatsResponse> => {
  const response = await axiosInstance.post("/get-mapranking-stat", {});
  return response.data;
};

// Custom hook
export const useBulkMapRankingStats = () => {
  return useQuery({
    queryKey: ["bulk-map-ranking-stats"],
    queryFn: () => getBulkMapRankingStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
