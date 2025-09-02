import { useQuery } from '@tanstack/react-query';
import { getShareableKeywords, ShareableKeywordsResponse } from '@/api/geoRankingApi';

interface UseShareableGeoKeywordsOptions {
  reportId: string;
  enabled?: boolean;
}

export const useShareableGeoKeywords = ({ reportId, enabled = true }: UseShareableGeoKeywordsOptions) => {
  return useQuery<ShareableKeywordsResponse>({
    queryKey: ['shareable-geo-keywords', reportId],
    queryFn: () => getShareableKeywords({ reportId }),
    enabled: enabled && Boolean(reportId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export type { ShareableKeywordsResponse };