import { useQuery } from "@tanstack/react-query";
import { getPostActivity } from "../api/socialPosterApi";

export const usePostActivity = (timeRange: string) => {
  return useQuery({
    queryKey: ["social-poster", "post-activity", timeRange],
    queryFn: () => getPostActivity(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
