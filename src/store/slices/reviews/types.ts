import {
  SummaryCards,
  StarDistribution,
  SentimentAnalysis,
  Review,
  PaginationResponse,
  GetReviewsRequest,
  SendReplyRequest,
} from "../../../services/reviewService";
import { AutoResponseSettings, LatestReview } from "./templateTypes";

export interface ReviewsState {
  // Summary state
  summaryCards: SummaryCards | null;
  starDistribution: StarDistribution | null;
  sentimentAnalysis: SentimentAnalysis | null;
  summaryLoading: boolean;
  summaryError: string | null;

  // Reviews state
  reviews: Review[];
  pagination: PaginationResponse | null;
  reviewsLoading: boolean;
  reviewsError: string | null;

  // Reply state
  replyLoading: boolean;
  replyError: string | null;
  deleteReplyLoading: boolean;
  deleteReplyError: string | null;

  // AI Generation state
  aiGenerationLoading: boolean;
  aiGenerationError: string | null;

  // Refresh state
  refreshLoading: boolean;
  refreshError: string | null;

  // Auto Response state
  autoResponse: AutoReviewReplies;
  templateLoading: boolean;
  templateError: string | null;

  // Filter state
  filter: string;
  searchQuery: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  sentimentFilter: string;
  dateRange: {
    startDate?: string;
    endDate?: string;
  };
  currentPage: number;
  pageSize: number;

  dnrUpdating: boolean;
  dnrUpdateError: string | null;
}

// Re-export types from service for convenience
export type { GetReviewsRequest, SendReplyRequest };

export interface ReplyTemplate {
  id: string;
  starRating: number;
  content: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  isRatingOnly?: boolean;
}

export interface AutoAiSettings {
  id: string;
  listingId: number;
  text_reply: string;
  prompt: string;
  tone: string;
}

export interface AutoReviewReplies {
  // enabled: boolean;
  // templates: ReplyTemplate[];
  DNR?: boolean;
  autoSettings?: ReplyTemplate;
  autoAiSettings?: AutoAiSettings;
  review?: LatestReview;
}
