import axiosInstance from '../api/axiosInstance';

export interface ReviewSummaryRequest {
  listingId: string;
}

export interface SummaryCards {
  total_reviews: number;
  pending_replies: number;
  ai_replies: number;
  manual_replies: number;
  overall_rating: number;
}

export interface StarDistribution {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

export interface SentimentAnalysis {
  positive: {
    count: number;
    percentage: number;
  };
  neutral: {
    count: number;
    percentage: number;
  };
  negative: {
    count: number;
    percentage: number;
  };
}

export interface ReviewSummaryResponse {
  code: number;
  message: string;
  data: {
    summary_cards: SummaryCards;
    star_distribution: StarDistribution;
    sentiment_analysis: SentimentAnalysis;
  };
}

// New interfaces for get-reviews API
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface FilterParams {
  search: string;
  status: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  rating: {
    min: number;
    max: number;
  };
  sentiment: string;
  listingId: string;
}

export interface SortingParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface GetReviewsRequest {
  pagination: PaginationParams;
  filters: FilterParams;
  sorting: SortingParams;
}

export interface Review {
  id: string;
  listingId: string;
  accountId: string;
  customer_name: string;
  rating: number;
  comment: string;
  date: string;
  reply_text: string;
  reply_date: string;
  profile_image_url: string;
  platform: string;
  is_new: boolean;
  replied: boolean;
  reply_type: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetReviewsResponse {
  code: number;
  message: string;
  data: {
    reviews: Review[];
    pagination: PaginationResponse;
  };
}

export interface SendReplyRequest {
  reviewId: number;
  replyText: string;
  replyType: 'manual' | 'AI';
}

export interface SendReplyResponse {
  code: number;
  message: string;
  data?: any;
}

export interface GenerateAIReplyRequest {
  reviewId: number;
}

export interface GenerateAIReplyResponse {
  code: number;
  message: string;
  data: {
    replyText: string;
  };
}

export const reviewService = {
  getReviewSummary: async (listingId: string): Promise<ReviewSummaryResponse> => {
    const response = await axiosInstance.post('/v1/get-review-summary', {
      listingId
    });
    return response.data;
  },

  getReviews: async (params: GetReviewsRequest): Promise<GetReviewsResponse> => {
    const response = await axiosInstance.post('/v1/get-reviews', params);
    return response.data;
  },

  sendReviewReply: async (params: SendReplyRequest): Promise<SendReplyResponse> => {
    const response = await axiosInstance.post('/v1/sent-review-reply', params);
    return response.data;
  },

  deleteReviewReply: async (reviewId: string): Promise<SendReplyResponse> => {
    const response = await axiosInstance.post('/v1/delete-review-reply', {
      reviewId
    });
    return response.data;
  },

  generateAIReply: async (reviewId: number): Promise<GenerateAIReplyResponse> => {
    const response = await axiosInstance.post('/v1/generate-ai-responce', {
      reviewId
    });
    return response.data;
  }
};

// Create a named export for backwards compatibility with the thunks file
// In case there are other imports using the default export
export { reviewService as review };
