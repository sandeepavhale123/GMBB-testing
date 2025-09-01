import { useQuery } from '@tanstack/react-query';
import { getShareableKeywordDetails, ShareableKeywordDetailsResponse } from '@/api/geoRankingApi';

interface UseShareableKeywordDetailsOptions {
  reportId: string;
  keywordId: number;
  status?: number;
  enabled?: boolean;
}

export const useShareableKeywordDetails = ({ 
  reportId, 
  keywordId, 
  status = 1, 
  enabled = true 
}: UseShareableKeywordDetailsOptions) => {
  return useQuery<ShareableKeywordDetailsResponse>({
    queryKey: ['shareable-keyword-details', reportId, keywordId, status],
    queryFn: () => getShareableKeywordDetails({ reportId, keywordId, status }),
    enabled: enabled && Boolean(reportId) && Boolean(keywordId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export type { ShareableKeywordDetailsResponse };