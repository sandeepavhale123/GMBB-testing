import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getShareableReportData,
  ShareableReportRequest,
  ShareableResponse,
} from '@/api/publicDashboardApi';
import { getDashboardType, getDashboardFilterType } from '@/utils/dashboardMappings';

interface UsePublicDashboardDataParams {
  reportId: string;
  dashboardFilterType: number;
  page: number;
  limit: number;
  search: string;
  category: string;
  city: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  postStatus?: string;
  reviewFilter?: string;
}


export const usePublicDashboardData = (params: UsePublicDashboardDataParams): UseQueryResult<ShareableResponse> => {
  const {
    reportId,
    dashboardFilterType,
    page,
    limit,
    search,
    category,
    city,
    dateRange,
    postStatus,
    reviewFilter,
  } = params;

  const request: ShareableReportRequest = {
    reportId,
    dashboardFilterType,
    page,
    limit,
    search,
    category,
    city,
    ...(dateRange && { dateRange }),
    ...(postStatus && { postStatus }),
    ...(reviewFilter && { review: reviewFilter }),
  };

  return useQuery({
    queryKey: ['publicDashboard', reportId, dashboardFilterType, page, limit, search, category, city, dateRange, postStatus, reviewFilter],
    queryFn: async (): Promise<ShareableResponse> => {
      return await getShareableReportData(request);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Helper hook for getting metrics/stats data
export const usePublicDashboardStats = (reportId: string, dashboardFilterType?: number) => {
  const { data, isLoading, error } = usePublicDashboardData({
    reportId,
    dashboardFilterType: dashboardFilterType || 1, // Default to 1 if not provided
    page: 1,
    limit: 1,
    search: '',
    category: '',
    city: '',
  });

  // Extract stats from the response
  const stats = data?.data ? {
    totalListings: 'pagination' in data.data 
      ? ('totalResults' in data.data.pagination ? data.data.pagination.totalResults : data.data.pagination.totalPosts)
      : 0,
    avgRating: '4.3', // This would need to be calculated from API response
    totalPosts: 0, // This would come from a separate endpoint
    totalReviews: 0, // This would come from a separate endpoint
  } : null;

  return {
    data: stats ? { data: { stats } } : null,
    isLoading,
    error,
    trendsData: stats ? { data: { stats } } : null,
  };
};