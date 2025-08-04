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
export const useDashboardData = (params: DashboardRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['dashboard-data', params],
    queryFn: () => getDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
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
export const useInsightsDashboardData = (params: InsightsDashboardRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['insights-dashboard-data', params],
    queryFn: () => getInsightsDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });
};

// Review Dashboard Types
interface ReviewDashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  city: string;
  review: "0" | "1" | "2" | "3" | "4" | "5" | "6";
}

interface ReviewDashboardListing {
  listingId: string;
  profilePhoto: string;
  listingName: string;
  zipCode: string;
  storeCode: string;
  city: string;
  reviewCount: string;
  avgRating: string;
  dnrActive: boolean;
  arActive: boolean;
  arAiActive: boolean;
  autoReplyStatus: string;
}

interface ReviewDashboardResponse {
  code: number;
  message: string;
  data: {
    listings: ReviewDashboardListing[];
    pagination: DashboardPagination;
  };
}

// Review Dashboard API function
const getReviewDashboardData = async (params: ReviewDashboardRequest): Promise<ReviewDashboardResponse> => {
  const response = await axiosInstance.post('/get-review-dashboard', params);
  return response.data;
};

// Custom hook for review dashboard
export const useReviewDashboardData = (params: ReviewDashboardRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['review-dashboard-data', params],
    queryFn: () => getReviewDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });
};

// Listing Dashboard Types
interface ListingDashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  city: string;
}

interface ListingDashboardListing {
  id: string;
  listingName: string;
  storeCode: string;
  status: string;
  lastUpdated: string;
  visibility: string;
  profilePhoto: string;
  completeness: number;
}

interface ListingDashboardResponse {
  code: number;
  message: string;
  data: {
    listings: ListingDashboardListing[];
    pagination: DashboardPagination;
  };
}

// Listing Dashboard API function
const getListingDashboardData = async (params: ListingDashboardRequest): Promise<ListingDashboardResponse> => {
  const response = await axiosInstance.post('/get-listing-dashboard', params);
  return response.data;
};

// Custom hook for listing dashboard
export const useListingDashboardData = (params: ListingDashboardRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['listing-dashboard-data', params],
    queryFn: () => getListingDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });
};

// Location Dashboard Types
interface LocationDashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  city: string;
}

interface LocationDashboardListing {
  listingId: string;
  profilePhoto: string;
  storeCode: string;
  listingName: string;
  address: string;
  zipCode: string;
  state: string;
  phone: string;
  website: string;
  photoCount: number;
  map: string;
  category: string;
  rating: string;
  openInfo: string;
}

interface LocationDashboardResponse {
  code: number;
  message: string;
  data: {
    listings: LocationDashboardListing[];
    pagination: DashboardPagination;
  };
}

// Location Dashboard API function
const getLocationDashboardData = async (params: LocationDashboardRequest): Promise<LocationDashboardResponse> => {
  const response = await axiosInstance.post('/get-location-dashboard', params);
  return response.data;
};

// Custom hook for location dashboard
export const useLocationDashboardData = (params: LocationDashboardRequest, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['location-dashboard-data', params],
    queryFn: () => getLocationDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });
};

export type { 
  DashboardListing, 
  DashboardPagination, 
  DashboardRequest, 
  InsightsDashboardListing, 
  InsightsDashboardRequest,
  ReviewDashboardListing,
  ReviewDashboardRequest,
  ListingDashboardListing,
  ListingDashboardRequest,
  LocationDashboardListing,
  LocationDashboardRequest
};