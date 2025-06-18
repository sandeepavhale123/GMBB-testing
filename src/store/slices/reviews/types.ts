
import { 
  SummaryCards, 
  StarDistribution, 
  SentimentAnalysis,
  Review,
  PaginationResponse,
  GetReviewsRequest,
  SendReplyRequest
} from '../../../services/reviewService';

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface ReviewsState {
  // Existing summary data
  summaryCards: SummaryCards | null;
  starDistribution: StarDistribution | null;
  sentimentAnalysis: SentimentAnalysis | null;
  summaryLoading: boolean;
  summaryError: string | null;
  
  // Reviews list data
  reviews: Review[];
  pagination: PaginationResponse | null;
  reviewsLoading: boolean;
  reviewsError: string | null;
  
  // Reply state
  replyLoading: boolean;
  replyError: string | null;
  
  // Delete reply state
  deleteReplyLoading: boolean;
  deleteReplyError: string | null;
  
  // AI Generation state
  aiGenerationLoading: boolean;
  aiGenerationError: string | null;
  
  // Filter and search state
  filter: 'all' | 'pending' | 'replied';
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  sentimentFilter: string;
  dateRange: DateRange;
  currentPage: number;
  pageSize: number;
}

export type { GetReviewsRequest, SendReplyRequest };
