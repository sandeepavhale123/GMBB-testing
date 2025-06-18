
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewService, SummaryCards, StarDistribution, SentimentAnalysis } from '../../services/reviewService';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  business: string;
  date: string;
  replied: boolean;
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  filter: 'all' | 'pending' | 'replied';
  dateRange: DateRange;
  // API data
  summaryCards: SummaryCards | null;
  starDistribution: StarDistribution | null;
  sentimentAnalysis: SentimentAnalysis | null;
  summaryLoading: boolean;
  summaryError: string | null;
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

const initialState: ReviewsState = {
  reviews: [
    {
      id: '1',
      customerName: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing coffee and friendly staff! Will definitely come back.',
      business: 'Downtown Coffee',
      date: '2024-06-08',
      replied: true
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      rating: 4,
      comment: 'Great atmosphere and delicious pastries.',
      business: 'Main Street Bakery',
      date: '2024-06-07',
      replied: false
    }
  ],
  loading: false,
  filter: 'all',
  dateRange: {},
  summaryCards: null,
  starDistribution: null,
  sentimentAnalysis: null,
  summaryLoading: false,
  summaryError: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    clearDateRange: (state) => {
      state.dateRange = {};
    },
    replyToReview: (state, action) => {
      const review = state.reviews.find(r => r.id === action.payload);
      if (review) {
        review.replied = true;
      }
    },
    clearSummaryError: (state) => {
      state.summaryError = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { setFilter, setDateRange, clearDateRange, replyToReview, clearSummaryError } = reviewsSlice.actions;
export default reviewsSlice.reducer;
