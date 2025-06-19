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

// Async thunk for generating AI reply
export const generateAIReply = createAsyncThunk(
  'reviews/generateAIReply',
  async (reviewId: number, { rejectWithValue }) => {
    try {
      const response = await reviewService.generateAIReply(reviewId);
      return { reviewId, replyText: response.data.replyText };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate AI reply');
    }
  }
);

// Async thunk for refreshing review data
export const refreshReviewData = createAsyncThunk(
  'reviews/refreshReviewData',
  async (params: { locationId: string; reviewParams: GetReviewsRequest }, { dispatch, rejectWithValue }) => {
    try {
      // First call the refresh API
      const refreshResponse = await reviewService.refreshReviews(params.locationId);
      
      // If refresh is successful (code 200), fetch updated data
      if (refreshResponse.code === 200) {
        // Fetch updated reviews
        await dispatch(fetchReviews(params.reviewParams));
        // Fetch updated summary
        await dispatch(fetchReviewSummary(params.locationId));
      }
      
      return refreshResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh review data');
    }
  }
);
