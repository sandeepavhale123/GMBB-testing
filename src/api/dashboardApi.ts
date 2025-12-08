import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// Dashboard Settings API Types
export interface SetDashboardRequest {
  dashboard: string;
}

export interface SetDashboardResponse {
  code: number;
  message: string;
  data: [];
}

// Dashboard Settings API function
const setDashboard = async (
  dashboard: string
): Promise<SetDashboardResponse> => {
  const response = await axiosInstance.post("/set-dashboard", { dashboard });
  return response.data;
};

// Category and State API Types
export interface CategoryAndStateData {
  categories: string[];
  states: string[];
}

export interface CategoryAndStateResponse {
  code: number;
  message: string;
  data: CategoryAndStateData;
}

// Category and State API function
const getCategoryAndStateData = async (): Promise<CategoryAndStateResponse> => {
  const response = await axiosInstance.post("/get-categoryandstate", {});
  return response.data;
};

// Custom hook for category and state data
export const useCategoryAndStateData = () => {
  return useQuery({
    queryKey: ["category-state-data"],
    queryFn: () => getCategoryAndStateData(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Types for dashboard API
interface DashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  state: string;
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
  isSync: number;
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
const getDashboardData = async (
  params: DashboardRequest
): Promise<DashboardResponse> => {
  const response = await axiosInstance.post("/get-default-dashboard", params);
  return response.data;
};

// Custom hook
export const useDashboardData = (
  params: DashboardRequest,
  enabled: boolean = true
) => {
  const query = useQuery({
    queryKey: ["dashboard-data", params],
    queryFn: () => getDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

// Insights Dashboard Types
interface InsightsDashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  state: string;
  insightDays: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface InsightsDashboardListing {
  id: string;
  profilePhoto: string;
  locationName: string;
  zipCode: string;
  storeCode: string;
  category: string;
  state: string;
  isSync: number;
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
const getInsightsDashboardData = async (
  params: InsightsDashboardRequest
): Promise<InsightsDashboardResponse> => {
  const response = await axiosInstance.post("/get-insight-dashboard", params);
  return response.data;
};

// Custom hook for insights dashboard
export const useInsightsDashboardData = (
  params: InsightsDashboardRequest,
  enabled: boolean = true
) => {
  const query = useQuery({
    queryKey: ["insights-dashboard-data", params],
    queryFn: () => getInsightsDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

// Review Dashboard Types
interface ReviewDashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  state: string;
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
  replyCount: number;
  isSync: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
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
const getReviewDashboardData = async (
  params: ReviewDashboardRequest
): Promise<ReviewDashboardResponse> => {
  const response = await axiosInstance.post("/get-review-dashboard", params);
  return response.data;
};

// Custom hook for review dashboard
export const useReviewDashboardData = (
  params: ReviewDashboardRequest,
  enabled: boolean = true
) => {
  const query = useQuery({
    queryKey: ["review-dashboard-data", params],
    queryFn: () => getReviewDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

// Listing Dashboard Types
interface ListingDashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  state: string;
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
const getListingDashboardData = async (
  params: ListingDashboardRequest
): Promise<ListingDashboardResponse> => {
  const response = await axiosInstance.post("/get-listing-dashboard", params);
  return response.data;
};

// Custom hook for listing dashboard
export const useListingDashboardData = (
  params: ListingDashboardRequest,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["listing-dashboard-data", params],
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
  state: string;
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
  isSync: number;
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
const getLocationDashboardData = async (
  params: LocationDashboardRequest
): Promise<LocationDashboardResponse> => {
  const response = await axiosInstance.post("/get-location-dashboard", params);
  return response.data;
};

// Custom hook for location dashboard
export const useLocationDashboardData = (
  params: LocationDashboardRequest,
  enabled: boolean = true
) => {
  const query = useQuery({
    queryKey: ["location-dashboard-data", params],
    queryFn: () => getLocationDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });

  return {
    ...query,
    refetch: query.refetch,
  };
};

// Post Dashboard Types
interface PostDashboardRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
  city: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  postStatus: string;
}

interface PostDashboardPost {
  id: string;
  title: string;
  content: string;
  status: string;
  listingId: string;
  listingName: string;
  zipcode: string;
  category: string;
  searchUrl: string;
  publishDate: string;
  media: {
    images: string;
  };
  tags: string;
  reason: string;
}

interface PostDashboardResponse {
  code: number;
  message: string;
  data: {
    posts: PostDashboardPost[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
}

// Post Dashboard API function
const getPostsDashboardData = async (
  params: PostDashboardRequest
): Promise<PostDashboardResponse> => {
  const response = await axiosInstance.post("/get-posts-dashboard", params);
  return response.data;
};

// Custom hook for post dashboard
export const usePostsDashboardData = (
  params: PostDashboardRequest,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["posts-dashboard-data", params],
    queryFn: () => getPostsDashboardData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled,
  });
};

// Generate Shareable Report API Types
export interface GenerateShareableReportRequest {
  listingId: string[];
  dashbaordFilterType: number;
}

export interface GenerateShareableReportResponse {
  code: number;
  message: string;
  data: {
    reportId: string;
  };
}

// Generate Shareable Report API function
export const generateShareableReport = async (
  request: GenerateShareableReportRequest
): Promise<GenerateShareableReportResponse> => {
  const response = await axiosInstance.post("/generate-shareable-report", request);
  return response.data;
};

// Change Dashboard Mode API Types
export interface ChangeDashboardModeRequest {
  dashboardType: 0 | 1; // 0 = single, 1 = multi
}

export interface ChangeDashboardModeResponse {
  code: number;
  message: string;
  data: [];
}

// Change Dashboard Mode API function
export const changeDashboardMode = async (
  request: ChangeDashboardModeRequest
): Promise<ChangeDashboardModeResponse> => {
  const response = await axiosInstance.post("/change-dashboard", request);
  return response.data;
};

// Export API functions
export { setDashboard };

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
  LocationDashboardRequest,
  PostDashboardPost,
  PostDashboardRequest,
};
