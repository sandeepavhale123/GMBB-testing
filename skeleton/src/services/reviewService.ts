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
  reply_setting?: string;
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

export interface QAData {
  totalQuestion: number;
  totalAnswer: number;
}

export interface ReviewSummaryResponse {
  code: number;
  message: string;
  data: {
    summary_cards: SummaryCards;
    star_distribution: StarDistribution;
    sentiment_analysis: SentimentAnalysis;
    qadata: QAData;
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
  locationName: string;
  zipcode: string;
  platform: string;
  is_new: boolean;
  replied: boolean;
  reply_type: string;
  reply_setting?: string;
  review_url?: string;
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

export interface SaveAIAutoReplyRequest {
  listingId: number;
  tone: string;
  customPrompt?: string;
  reply_text: string;
  specific_star: string[];
  newStatus: number;
  oldStatus: number;
}

export interface SaveAIAutoReplyResponse {
  code: number;
  message: string;
  data?: any;
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
      oneTextStatus: number;
      startwo_reply: string;
      twoTextStatus: number;
      starthree_reply: string;
      threeTextStatus: number;
      starfour_reply: string;
      fourTextStatus: number;
      starfive_reply: string;
      fiveTextStatus: number;
      starone_wreply: string;
      oneStarStatus: number;
      startwo_wreply: string;
      twoStarStatus: number;
      starthree_wreply: string;
      threeStarStatus: number;
      starfour_wreply: string;
      fourStarStatus: number;
      starfive_wreply: string;
      fiveStarStatus: number;
    };
    autoAiSettings: {
      id: string;
      listingId: number;
      text_reply: string;
      customPrompt?: string;
      newStatus: string | number;
      oldStatus: string | number;
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

export interface GenerateAIAutoReplyRequest {
  reviewId: string | number;
  customPrompt?: string;
  tone: string;
  reviewReplyFormat: string;
}

export interface GenerateAIAutoReplyResponse {
  code: number;
  message: string;
  data: {
    replyText: any;
    reply_text: string;
  };
}

export interface UpdateAutoReplySettingRequest {
  listingId: number;
  type: string;
  status: number;
  text: string;
  rating: number;
}

export interface UpdateAutoReplySettingResponse {
  code: number;
  message: string;
  data: {
    id: string;
  };
}
export interface UpdateOldAutoReplySettingRequest {
  listingId: number;
  oldStatus: 0 | 1;
}

export interface UpdateOldAutoReplySettingResponse {
  code: number;
  message: string;
  data?: any;
}

// Export Reviews CSV interfaces
export interface ExportReviewsRequest {
  listingId: number[];
  reviewOpt: number;
  reviewByStar: string[];
  customDate: {
    fromDate: string;
    toDate: string;
  };
}

export interface ExportReviewsResponse {
  code: number;
  message: string;
  data: {
    fileUrl: string;
    fileName: string;
  };
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

  getBulkReviewStats: async (): Promise<ReviewSummaryResponse> => {
    const response = await axiosInstance.post("/get-bulk-reviews-stats");
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
    const response = await axiosInstance.post("/generate-ai-reply", {
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

  saveAIAutoReply: async (
    payload: SaveAIAutoReplyRequest
  ): Promise<SaveAIAutoReplyResponse> => {
    const response = await axiosInstance.post("/save-ai-autoreply", payload);
    return response.data;
  },
  generateAIAutoReply: async (
    payload: GenerateAIAutoReplyRequest
  ): Promise<GenerateAIAutoReplyResponse> => {
    const response = await axiosInstance.post("/generate-ai-reply", payload);

    return response.data;
  },

  updateAutoReplySetting: async (
    params: UpdateAutoReplySettingRequest
  ): Promise<UpdateAutoReplySettingResponse> => {
    const response = await axiosInstance.post(
      "/update-autoreply-setting",
      params
    );
    return response.data;
  },

  // reviewService.ts

  updateOldAutoReplySetting: async ({
    listingId,
    oldStatus,
  }: UpdateOldAutoReplySettingRequest): Promise<UpdateOldAutoReplySettingResponse> => {
    const response = await axiosInstance.post("/update-oldauto-reply", {
      listingId,
      oldStatus,
    });
    return response.data;
  },

  getBulkReviews: async (params: {
    pagination: {
      page: number;
      limit: number;
      offset: number;
    };
    filters: {
      search: string;
      status: string;
      dateRange: {
        startDate: string;
        endDate: string;
      };
      sentiment: string;
    };
    sorting: {
      sortBy: string;
      sortOrder: "asc" | "desc";
    };
  }): Promise<GetReviewsResponse> => {
    const response = await axiosInstance.post("/get-bulk-reviews", params);
    return response.data;
  },

  exportReviews: async (
    params: ExportReviewsRequest
  ): Promise<ExportReviewsResponse> => {
    const response = await axiosInstance.post(
      "/download-listing-reviews",
      params
    );
    return response.data;
  },
};

// Create a named export for backwards compatibility with the thunks file
// In case there are other imports using the default export
export { reviewService as review };
