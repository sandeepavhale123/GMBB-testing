import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../api/socialPosterApi";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["social-poster", "dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
