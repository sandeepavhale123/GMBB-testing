
import { createAsyncThunk } from '@reduxjs/toolkit';
import { review as reviewService } from '../../../services/reviewService';
import { GetReviewsRequest, SendReplyRequest } from './types';

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

// Async thunk for sending review reply
export const sendReviewReply = createAsyncThunk(
  'reviews/sendReply',
  async (params: SendReplyRequest, { rejectWithValue }) => {
    try {
      const response = await reviewService.sendReviewReply(params);
      return { ...response, reviewId: params.reviewId, replyText: params.replyText };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send review reply');
    }
  }
);

// Async thunk for deleting review reply
export const deleteReviewReply = createAsyncThunk(
  'reviews/deleteReply',
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const response = await reviewService.deleteReviewReply(reviewId);
      return { ...response, reviewId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review reply');
    }
  }
);
