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

// Insights Dashboard Types
interface InsightsDashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  city: string;
}

interface InsightsDashboardListing {
  id: string;
  profilePhoto: string;
  locationName: string;
  zipCode: string;
  storeCode: string;
  category: string;
  state: string;
  visibility: {
    search_views: number;
    maps_views: number;
    total_views: number;
  };
  customer_actions: {
    website_clicks: number;
    direction_requests: number;
    phone_calls: number;
    messages: number;
  };
}

interface InsightsDashboardResponse {
  code: number;
  message: string;
  data: {
    listings: InsightsDashboardListing[];
    pagination: DashboardPagination;
  };
}

// Insights Dashboard API function
const getInsightsDashboardData = async (params: InsightsDashboardRequest): Promise<InsightsDashboardResponse> => {
  const response = await axiosInstance.post('/get-insight-dashboard', params);
  return response.data;
};

// Custom hook for insights dashboard
export const useInsightsDashboardData = (params: InsightsDashboardRequest) => {
  return useQuery({
    queryKey: ['insights-dashboard-data', params],
    queryFn: () => getInsightsDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export type { DashboardListing, DashboardPagination, DashboardRequest, InsightsDashboardListing, InsightsDashboardRequest };