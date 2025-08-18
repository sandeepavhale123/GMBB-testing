import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api/reportsApi';
import { GetAllBulkReportsResponse } from '@/types/bulkReportTypes';

export const useBulkReports = (
  page: number,
  limit: number = 10,
  search: string = '',
  reportType: 'all' | 'onetime' | 'monthly' | 'weekly' = 'all'
) => {
  return useQuery<GetAllBulkReportsResponse>({
    queryKey: ['bulk-reports', page, limit, search, reportType],
    queryFn: () => reportsApi.getAllBulkReports({
      page,
      limit,
      search,
      report_type: reportType
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};