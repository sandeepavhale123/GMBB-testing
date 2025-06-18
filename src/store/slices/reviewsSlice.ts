
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reviewService, GetReviewsRequest, GetReviewsResponse, Review, PaginationResponse } from '../../services/reviewService';

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

interface SummaryCards {
  total_reviews: number;
  pending_replies: number;
  ai_replies: number;
  manual_replies: number;
  overall_rating: number;
}

interface StarDistribution {
  [key: string]: {
    count: number;
    percentage: number;
  };
}

interface SentimentAnalysis {
  positive: { count: number; percentage: number };
  neutral: { count: number; percentage: number };
  negative: { count: number; percentage: number };
}

interface ReviewsState {
  reviews: Review[];
  pagination: PaginationResponse | null;
  reviewsLoading: boolean;
  reviewsError: string | null;
  filter: string;
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  sentimentFilter: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  currentPage: number;
  pageSize: number;
  // Add missing summary-related properties
  summaryCards: SummaryCards | null;
  starDistribution: StarDistribution | null;
  sentimentAnalysis: SentimentAnalysis | null;
  summaryLoading: boolean;
  summaryError: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  pagination: null,
  reviewsLoading: false,
  reviewsError: null,
  filter: 'all',
  searchQuery: '',
  sortBy: 'newest',
  sortOrder: 'desc',
  sentimentFilter: 'all',
  dateRange: {
    startDate: '',
    endDate: ''
  },
  currentPage: 1,
  pageSize: 10,
  // Initialize summary-related properties
  summaryCards: null,
  starDistribution: null,
  sentimentAnalysis: null,
  summaryLoading: false,
  summaryError: null,
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params: GetReviewsRequest) => {
    const response = await reviewService.getReviews(params);
    return response.data;
  }
);

export const fetchReviewSummary = createAsyncThunk(
  'reviews/fetchReviewSummary',
  async (listingId: string) => {
    // Mock implementation for now
    return {
      summaryCards: {
        total_reviews: 342,
        pending_replies: 12,
        ai_replies: 89,
        manual_replies: 241,
        overall_rating: 4.6
      },
      starDistribution: {
        '5': { count: 186, percentage: 54 },
        '4': { count: 89, percentage: 26 },
        '3': { count: 34, percentage: 10 },
        '2': { count: 20, percentage: 6 },
        '1': { count: 13, percentage: 4 }
      },
      sentimentAnalysis: {
        positive: { count: 275, percentage: 80 },
        neutral: { count: 34, percentage: 10 },
        negative: { count: 33, percentage: 10 }
      }
    };
  }
);

export const replyToReview = createAsyncThunk(
  'reviews/replyToReview',
  async ({ reviewId, replyText }: { reviewId: string; replyText: string }) => {
    // Mock API call for now
    return { reviewId, replyText };
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
      state.currentPage = 1;
    },
    setSentimentFilter: (state, action: PayloadAction<string>) => {
      state.sentimentFilter = action.payload;
      state.currentPage = 1;
    },
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.dateRange = action.payload;
      state.currentPage = 1;
    },
    clearDateRange: (state) => {
      state.dateRange = { startDate: '', endDate: '' };
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearReviewsError: (state) => {
      state.reviewsError = null;
    },
    clearSummaryError: (state) => {
      state.summaryError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload.reviews;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.error.message || 'Failed to fetch reviews';
      })
      .addCase(fetchReviewSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchReviewSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summaryCards = action.payload.summaryCards;
        state.starDistribution = action.payload.starDistribution;
        state.sentimentAnalysis = action.payload.sentimentAnalysis;
      })
      .addCase(fetchReviewSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.error.message || 'Failed to fetch review summary';
      })
      .addCase(replyToReview.fulfilled, (state, action) => {
        const { reviewId, replyText } = action.payload;
        const review = state.reviews.find(r => r.id === reviewId);
        if (review) {
          review.replied = true;
          review.reply_text = replyText;
          review.reply_date = new Date().toISOString();
        }
      })
      .addCase('RESET_STORE', () => {
        return initialState;
      });
  },
});

export const {
  setFilter,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  setSentimentFilter,
  setDateRange,
  clearDateRange,
  setCurrentPage,
  clearReviewsError,
  clearSummaryError
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
