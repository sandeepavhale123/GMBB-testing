import { useQuery } from '@tanstack/react-query';
import { getShareableReport, ShareableReportConfigResponse } from '@/api/publicDashboardApi';

export const usePublicReportConfig = (reportId: string) => {
  return useQuery({
    queryKey: ['publicReportConfig', reportId],
    queryFn: (): Promise<ShareableReportConfigResponse> => 
      getShareableReport({ reportId }),
    staleTime: 10 * 60 * 1000, // 10 minutes (config doesn't change often)
    retry: 2,
    enabled: !!reportId,
  });
};