import { useQuery } from "@tanstack/react-query";
import { getPostingActivityByPlatform } from "../api/socialPosterApi";

export const usePostingActivity = (timeRange: string) => {
  return useQuery({
    queryKey: ["social-poster", "posting-activity", timeRange],
    queryFn: () => getPostingActivityByPlatform(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
