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
  pageSize: 10
};

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params: GetReviewsRequest) => {
    const response = await reviewService.getReviews(params);
    return response.data;
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
  clearReviewsError
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
