import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

export interface TrendsStats {
  totalListings: number;
  avgRating: string;
  totalPosts: number;
  totalReviews: number;
}

export interface TrendsResponse {
  code: number;
  message: string;
  data: {
    stats: TrendsStats;
  };
}

export const getTrendsStats = async (): Promise<TrendsResponse> => {
  const response = await axiosInstance.get("/get-trend");
  return response.data;
};

export const useTrendsData = () => {
  return useQuery({
    queryKey: ["trends-stats"],
    queryFn: getTrendsStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};