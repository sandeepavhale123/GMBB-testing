import { publicAxiosInstance } from "./publicAxiosInstance";

// Common interfaces
export interface ShareableReportRequest {
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
  review?: string;
  language?: string;
  insightDays?: string;
  reviewDays?: string;
}

export interface ShareablePagination {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
}

export interface ShareablePostPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Default Dashboard
export interface ShareableDefaultListing {
  id: string;
  profilePhoto: string;
  listingName: string;
  zipCode: string;
  storeCode: string;
  lastPost: string;
  upcomingPost: string;
  reviewReply: string;
  rating: string;
  qa: string;
  isSync: number;
}

export interface ShareableDefaultResponse {
  code: number;
  message: string;
  data: {
    listings: ShareableDefaultListing[];
    pagination: ShareablePagination;
  };
}

// Insight Dashboard.
export interface ShareableInsightListing {
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

export interface ShareableInsightResponse {
  code: number;
  message: string;
  data: {
    listings: ShareableInsightListing[];
    pagination: ShareablePagination;
  };
}

// Review Dashboard
export interface ShareableReviewListing {
  id: string;
  profilePhoto: string;
  listingName: string;
  zipCode: string;
  storeCode: string;
  lastPost: string;
  upcomingPost: string;
  reviewReply: string;
  rating: string;
  qa: string;
  isSync: number;
}

export interface ShareableReviewResponse {
  code: number;
  message: string;
  data: {
    listings: ShareableReviewListing[];
    pagination: ShareablePagination;
  };
}

// Location Dashboard
export interface ShareableLocationListing {
  id: string;
  profilePhoto: string;
  listingName: string;
  zipCode: string;
  storeCode: string;
  lastPost: string;
  upcomingPost: string;
  reviewReply: string;
  rating: string;
  qa: string;
  isSync: number;
}

export interface ShareableLocationResponse {
  code: number;
  message: string;
  data: {
    listings: ShareableLocationListing[];
    pagination: ShareablePagination;
  };
}

// Post Dashboard
export interface ShareablePost {
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

export interface ShareablePostResponse {
  code: number;
  message: string;
  data: {
    posts: ShareablePost[];
    pagination: ShareablePostPagination;
  };
}

// Category and State API
export interface ShareableCategoryAndStateRequest {
  reportId: string;
  language?: string;
}

export interface ShareableCategoryAndStateResponse {
  code: number;
  message: string;
  data: {
    categories: string[];
    states: string[];
  };
}

// Report Configuration API
export interface ShareableReportConfigRequest {
  reportId: string;
  language?: string;
}

export interface ShareableReportStats {
  totalListings: number;
  avgHealthScore: number;
  avgRating: string;
  totalPosts: number;
  totalReviews: number;
}

export interface ShareableReportConfigResponse {
  code: number;
  message: string;
  data: {
    report: {
      reportId: string;
      dashboardFilterType: string;
    };
    stats: ShareableReportStats;
  };
}

// API Functions
export const getShareableReport = async (
  request: ShareableReportConfigRequest,
): Promise<ShareableReportConfigResponse> => {
  const response = await publicAxiosInstance.post("/get-shareable-report", request);
  return response.data;
};

export const getShareableCategoryAndState = async (
  request: ShareableCategoryAndStateRequest,
): Promise<ShareableCategoryAndStateResponse> => {
  const response = await publicAxiosInstance.post("/get-shareable-categoryandstate", request);
  return response.data;
};

// Dashboard-specific API Functions
export const getShareableDefaultData = async (request: ShareableReportRequest): Promise<ShareableDefaultResponse> => {
  const response = await publicAxiosInstance.post("/get-shareable-default-data", request);
  return response.data;
};

export const getShareableInsightData = async (request: ShareableReportRequest): Promise<ShareableInsightResponse> => {
  const response = await publicAxiosInstance.post("/get-shareable-insight-data", request);
  return response.data;
};

export const getShareableReviewData = async (request: ShareableReportRequest): Promise<ShareableReviewResponse> => {
  const response = await publicAxiosInstance.post("/get-shareable-review-data", request);
  return response.data;
};

export const getShareableLocationData = async (request: ShareableReportRequest): Promise<ShareableLocationResponse> => {
  const response = await publicAxiosInstance.post("/get-shareable-location-data", request);
  return response.data;
};

export const getShareablePostsData = async (request: ShareableReportRequest): Promise<ShareablePostResponse> => {
  const response = await publicAxiosInstance.post("/get-shareable-posts-data", request);
  return response.data;
};
