import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReviewsState } from './types';
import { ReplyTemplate, CreateTemplateRequest } from './templateTypes';
import { fetchReviewSummary, fetchReviews, sendReviewReply, deleteReviewReply, generateAIReply, refreshReviewData } from './thunks';

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
  
  // Refresh state
  refreshLoading: false,
  refreshError: null,
  
  // Auto Response state
  autoResponse: {
    enabled: false,
    templates: []
  },
  templateLoading: false,
  templateError: null,
  
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
      state.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSentimentFilter: (state, action) => {
      state.sentimentFilter = action.payload;
      state.currentPage = 1;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
      state.currentPage = 1;
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
    clearRefreshError: (state) => {
      state.refreshError = null;
    },
    
    // Auto Response reducers
    toggleAutoResponse: (state) => {
      state.autoResponse.enabled = !state.autoResponse.enabled;
    },
    addTemplate: (state, action: PayloadAction<CreateTemplateRequest>) => {
      const newTemplate: ReplyTemplate = {
        id: Date.now().toString(),
        starRating: action.payload.starRating,
        content: action.payload.content,
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Remove existing template for this star rating if it exists
      state.autoResponse.templates = state.autoResponse.templates.filter(
        t => t.starRating !== action.payload.starRating
      );
      
      state.autoResponse.templates.push(newTemplate);
    },
    updateTemplate: (state, action: PayloadAction<{ id: string; content: string; enabled: boolean }>) => {
      const template = state.autoResponse.templates.find(t => t.id === action.payload.id);
      if (template) {
        template.content = action.payload.content;
        template.enabled = action.payload.enabled;
        template.updatedAt = new Date().toISOString();
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.autoResponse.templates = state.autoResponse.templates.filter(
        t => t.id !== action.payload
      );
    },
    clearTemplateError: (state) => {
      state.templateError = null;
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
      })
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
      .addCase(sendReviewReply.pending, (state) => {
        state.replyLoading = true;
        state.replyError = null;
      })
      .addCase(sendReviewReply.fulfilled, (state, action) => {
        state.replyLoading = false;
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
      .addCase(deleteReviewReply.pending, (state) => {
        state.deleteReplyLoading = true;
        state.deleteReplyError = null;
      })
      .addCase(deleteReviewReply.fulfilled, (state, action) => {
        state.deleteReplyLoading = false;
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
      .addCase(generateAIReply.pending, (state) => {
        state.aiGenerationLoading = true;
        state.aiGenerationError = null;
      })
      .addCase(generateAIReply.fulfilled, (state, action) => {
        state.aiGenerationLoading = false;
      })
      .addCase(generateAIReply.rejected, (state, action) => {
        state.aiGenerationLoading = false;
        state.aiGenerationError = action.payload as string;
      })
      .addCase(refreshReviewData.pending, (state) => {
        state.refreshLoading = true;
        state.refreshError = null;
      })
      .addCase(refreshReviewData.fulfilled, (state) => {
        state.refreshLoading = false;
      })
      .addCase(refreshReviewData.rejected, (state, action) => {
        state.refreshLoading = false;
        state.refreshError = action.payload as string;
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
  clearAIGenerationError,
  clearRefreshError,
  toggleAutoResponse,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  clearTemplateError
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
