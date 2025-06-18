
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

export const reviewService = {
  getReviewSummary: async (listingId: string): Promise<ReviewSummaryResponse> => {
    const response = await axiosInstance.post('/v1/get-review-summary', {
      listingId
    });
    return response.data;
  }
};
