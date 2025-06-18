import { createSlice } from '@reduxjs/toolkit';
import { ReviewsState } from './types';
import { fetchReviewSummary, fetchReviews, sendReviewReply, deleteReviewReply, generateAIReply } from './thunks';

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
  
  // Reply state
  replyLoading: false,
  replyError: null,
  deleteReplyLoading: false,
  deleteReplyError: null,
  
  // AI Generation state
  aiGenerationLoading: false,
  aiGenerationError: null,
  
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
    clearReplyError: (state) => {
      state.replyError = null;
    },
    clearDeleteReplyError: (state) => {
      state.deleteReplyError = null;
    },
    clearAIGenerationError: (state) => {
      state.aiGenerationError = null;
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
      // Reply cases
      .addCase(sendReviewReply.pending, (state) => {
        state.replyLoading = true;
        state.replyError = null;
      })
      .addCase(sendReviewReply.fulfilled, (state, action) => {
        state.replyLoading = false;
        // Update the specific review in the list
        const review = state.reviews.find(r => r.id === action.payload.reviewId.toString());
        if (review) {
          review.replied = true;
          review.reply_text = action.payload.replyText;
          review.reply_date = new Date().toISOString();
          review.reply_type = 'manual';
        }
      })
      .addCase(sendReviewReply.rejected, (state, action) => {
        state.replyLoading = false;
        state.replyError = action.payload as string;
      })
      // Delete reply cases
      .addCase(deleteReviewReply.pending, (state) => {
        state.deleteReplyLoading = true;
        state.deleteReplyError = null;
      })
      .addCase(deleteReviewReply.fulfilled, (state, action) => {
        state.deleteReplyLoading = false;
        // Update the specific review in the list to remove the reply
        const review = state.reviews.find(r => r.id === action.payload.reviewId);
        if (review) {
          review.replied = false;
          review.reply_text = '';
          review.reply_date = '';
          review.reply_type = '';
        }
      })
      .addCase(deleteReviewReply.rejected, (state, action) => {
        state.deleteReplyLoading = false;
        state.deleteReplyError = action.payload as string;
      })
      // AI Generation cases
      .addCase(generateAIReply.pending, (state) => {
        state.aiGenerationLoading = true;
        state.aiGenerationError = null;
      })
      .addCase(generateAIReply.fulfilled, (state, action) => {
        state.aiGenerationLoading = false;
        // The generated reply will be handled by the component
      })
      .addCase(generateAIReply.rejected, (state, action) => {
        state.aiGenerationLoading = false;
        state.aiGenerationError = action.payload as string;
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
  clearReviewsError,
  clearReplyError,
  clearDeleteReplyError,
  clearAIGenerationError
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
