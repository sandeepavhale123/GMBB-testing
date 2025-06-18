
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  reviewService, 
  SummaryCards, 
  StarDistribution, 
  SentimentAnalysis,
  Review,
  PaginationResponse,
  GetReviewsRequest
} from '../../services/reviewService';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface ReviewsState {
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

// Async thunk for fetching review summary
export const fetchReviewSummary = createAsyncThunk(
  'reviews/fetchSummary',
  async (listingId: string, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewSummary(listingId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch review summary');
    }
  }
);

// Async thunk for fetching reviews
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params: GetReviewsRequest, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviews(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

const initialState: ReviewsState = {
  // Summary state
  summaryCards: null,
  starDistribution: null,
  sentimentAnalysis: null,
  summaryLoading: false,
  summaryError: null,
  
  // Reviews state
  reviews: [],
  pagination: null,
  reviewsLoading: false,
  reviewsError: null,
  
  // Filter state
  filter: 'all',
  searchQuery: '',
  sortBy: 'newest',
  sortOrder: 'desc',
  sentimentFilter: 'all',
  dateRange: {},
  currentPage: 1,
  pageSize: 10,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when search changes
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 1; // Reset to first page when sort changes
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSentimentFilter: (state, action) => {
      state.sentimentFilter = action.payload;
      state.currentPage = 1; // Reset to first page when sentiment filter changes
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
      state.currentPage = 1; // Reset to first page when date range changes
    },
    clearDateRange: (state) => {
      state.dateRange = {};
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    replyToReview: (state, action) => {
      const review = state.reviews.find(r => r.id === action.payload.reviewId);
      if (review) {
        review.replied = true;
        review.reply_text = action.payload.replyText;
        review.reply_date = new Date().toISOString();
      }
    },
    clearSummaryError: (state) => {
      state.summaryError = null;
    },
    clearReviewsError: (state) => {
      state.reviewsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Summary cases
      .addCase(fetchReviewSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchReviewSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summaryCards = action.payload.summary_cards;
        state.starDistribution = action.payload.star_distribution;
        state.sentimentAnalysis = action.payload.sentiment_analysis;
      })
      .addCase(fetchReviewSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload as string;
      })
      // Reviews cases
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
        state.reviewsError = action.payload as string;
      })
      // Global store reset
      .addCase({ type: 'RESET_STORE' }, () => {
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
  replyToReview, 
  clearSummaryError,
  clearReviewsError
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
