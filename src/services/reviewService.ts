import axiosInstance from "../api/axiosInstance";

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
  sortOrder: "asc" | "desc";
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
  replyType: "manual" | "AI";
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

export interface RefreshReviewsRequest {
  locationId: string;
}

export interface RefreshReviewsResponse {
  code: number;
  message: string;
  data: any[];
}

// --- Auto review reply ---
export interface AutoReviewReplySettingsResponse {
  code: number;
  message: string;
  data: {
    DNR: boolean;
    autoSettings: {
      id: string;
      listingId: number;
      starone_reply: string;
      startwo_reply: string;
      starthree_reply: string;
      starfour_reply: string;
      starfive_reply: string;
      starone_wreply: string;
      startwo_wreply: string;
      starthree_wreply: string;
      starfour_wreply: string;
      starfive_wreply: string;
    };
    autoAiSettings: {
      id: string;
      listingId: number;
      text_reply: string;
      prompt: string;
      tone: string;
      specific_star: string[];
    };
    review: {
      id: string;
      pro_photo: string;
      display_name: string;
      star_rating: string;
      review_cdate: string;
      comment: string;
    };
  };
}

export interface UpdateDNRSettingRequest {
  listingId: number;
  dnrStatus: number;
}

export interface UpdateDNRSettingResponse {
  code: number;
  message: string;
  data?: any;
}

export const reviewService = {
  getReviewSummary: async (
    listingId: string
  ): Promise<ReviewSummaryResponse> => {
    const response = await axiosInstance.post("/get-review-summary", {
      listingId,
    });
    return response.data;
  },

  getReviews: async (
    params: GetReviewsRequest
  ): Promise<GetReviewsResponse> => {
    const response = await axiosInstance.post("/get-reviews", params);
    return response.data;
  },

  sendReviewReply: async (
    params: SendReplyRequest
  ): Promise<SendReplyResponse> => {
    const response = await axiosInstance.post("/sent-review-reply", params);
    return response.data;
  },

  deleteReviewReply: async (reviewId: string): Promise<SendReplyResponse> => {
    const response = await axiosInstance.post("/delete-review-reply", {
      reviewId,
    });
    return response.data;
  },

  generateAIReply: async (
    reviewId: number
  ): Promise<GenerateAIReplyResponse> => {
    const response = await axiosInstance.post("/generate-ai-responce", {
      reviewId,
    });
    return response.data;
  },

  refreshReviews: async (
    locationId: string
  ): Promise<RefreshReviewsResponse> => {
    const response = await axiosInstance.post("/refresh-review", {
      locationId: parseInt(locationId),
    });
    return response.data;
  },

  getAutoReviewReplySettings: async (
    listingId: number
  ): Promise<AutoReviewReplySettingsResponse> => {
    const response = await axiosInstance.post("/get-reply-setting", {
      listingId,
    });
    return response.data;
  },

  updateDNRSetting: async (
    params: UpdateDNRSettingRequest
  ): Promise<UpdateDNRSettingResponse> => {
    const response = await axiosInstance.post("/update-dnr-setting", params);
    return response.data;
  },
};

// Create a named export for backwards compatibility with the thunks file
// In case there are other imports using the default export
export { reviewService as review };
