import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// Types for dashboard API
interface DashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  city: string;
}

interface DashboardListing {
  id: string;
  listingName: string;
  storeCode: string;
  lastPost: string;
  upcomingPost: string;
  reviewReply: string;
  rating: string;
  qa: string;
  profilePhoto: string;
}

interface DashboardPagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
}

interface DashboardResponse {
  code: number;
  message: string;
  data: {
    listings: DashboardListing[];
    pagination: DashboardPagination;
  };
}

// API function
const getDashboardData = async (params: DashboardRequest): Promise<DashboardResponse> => {
  const response = await axiosInstance.post('/get-default-dashboard', params);
  return response.data;
};

// Custom hook
export const useDashboardData = (params: DashboardRequest) => {
  return useQuery({
    queryKey: ['dashboard-data', params],
    queryFn: () => getDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export type { DashboardListing, DashboardPagination, DashboardRequest };