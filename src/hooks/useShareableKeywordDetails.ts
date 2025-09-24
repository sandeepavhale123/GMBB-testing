import { useQuery } from '@tanstack/react-query';
import { getShareableKeywordDetails, ShareableKeywordDetailsResponse } from '@/api/geoRankingApi';

interface UseShareableKeywordDetailsOptions {
  reportId: string;
  keywordId: number;
  dateId?: string;
  status?: number;
  enabled?: boolean;
  isDateBasedCall?: boolean;
}

export const useShareableKeywordDetails = ({ 
  reportId, 
  keywordId, 
  dateId,
  status = 1, 
  enabled = true,
  isDateBasedCall = false 
}: UseShareableKeywordDetailsOptions) => {
  return useQuery<ShareableKeywordDetailsResponse>({
    queryKey: ['shareable-keyword-details', reportId, keywordId, dateId, status, isDateBasedCall],
    queryFn: () => {
      // When it's a date-based call, send dateId as keywordId
      const apiKeywordId = isDateBasedCall && dateId ? parseInt(dateId) : keywordId;
      return getShareableKeywordDetails({ reportId, keywordId: apiKeywordId, status });
    },
    enabled: enabled && Boolean(reportId) && Boolean(keywordId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export type { ShareableKeywordDetailsResponse };