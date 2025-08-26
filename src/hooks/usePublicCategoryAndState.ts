import { useQuery } from '@tanstack/react-query';
import { getShareableCategoryAndState, ShareableCategoryAndStateResponse } from '@/api/publicDashboardApi';

export const usePublicCategoryAndState = (reportId: string) => {
  return useQuery({
    queryKey: ['publicCategoryAndState', reportId],
    queryFn: (): Promise<ShareableCategoryAndStateResponse> => 
      getShareableCategoryAndState({ reportId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!reportId,
  });
};