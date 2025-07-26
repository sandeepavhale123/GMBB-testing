import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  GenerateAIAutoReplyRequest,
  review as reviewService,
  SaveAIAutoReplyRequest,
} from "../../../services/reviewService";
import { GetReviewsRequest, SendReplyRequest } from "./types";

// Async thunk for fetching review summary
export const fetchReviewSummary = createAsyncThunk(
  "reviews/fetchSummary",
  async (listingId: string, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviewSummary(listingId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch review summary"
      );
    }
  }
);

// Async thunk for fetching reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (params: GetReviewsRequest, { rejectWithValue }) => {
    try {
      const response = await reviewService.getReviews(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// Async thunk for sending review reply
export const sendReviewReply = createAsyncThunk(
  "reviews/sendReply",
  async (
    params: SendReplyRequest & { listingId: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await reviewService.sendReviewReply(params);

      // Refresh summary after successful reply
      if (params.listingId) {
        dispatch(fetchReviewSummary(params.listingId));
      }

      return {
        ...response,
        reviewId: params.reviewId,
        replyText: params.replyText,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send review reply"
      );
    }
  }
);

// Async thunk for deleting review reply
export const deleteReviewReply = createAsyncThunk(
  "reviews/deleteReply",
  async (
    { reviewId, listingId }: { reviewId: string; listingId: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await reviewService.deleteReviewReply(reviewId);

      // Refresh summary after successful delete
      if (listingId) {
        dispatch(fetchReviewSummary(listingId));
      }

      return { ...response, reviewId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review reply"
      );
    }
  }
);

// Async thunk for generating AI reply
export const generateAIReply = createAsyncThunk(
  "reviews/generateAIReply",
  async (
    { reviewId, listingId }: { reviewId: number; listingId: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await reviewService.generateAIReply(reviewId);

      // Refresh summary after successful AI reply generation
      if (listingId) {
        dispatch(fetchReviewSummary(listingId));
      }

      return { reviewId, replyText: response.data.replyText };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate AI reply"
      );
    }
  }
);

// Async thunk for refreshing review data
export const refreshReviewData = createAsyncThunk(
  "reviews/refreshReviewData",
  async (
    params: { locationId: string; reviewParams: GetReviewsRequest },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // First call the refresh API
      const refreshResponse = await reviewService.refreshReviews(
        params.locationId
      );

      // If refresh is successful (code 200), fetch updated data
      if (refreshResponse.code === 200) {
        // Fetch updated reviews and summary in parallel
        await Promise.all([
          dispatch(fetchReviews(params.reviewParams)),
          dispatch(fetchReviewSummary(params.locationId)),
        ]);
      }

      return refreshResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh review data"
      );
    }
  }
);

// Async thunk for auto review reply
export const fetchAutoReviewReplySettings = createAsyncThunk(
  "reviews/fetchAutoReviewReplySettings",
  async (listingId: number, { rejectWithValue }) => {
    try {
      const response = await reviewService.getAutoReviewReplySettings(
        listingId
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auto reply settings"
      );
    }
  }
);

export const updateDNRSetting = createAsyncThunk(
  "reviews/updateDNRSetting",
  async (
    { listingId, dnrStatus }: { listingId: number; dnrStatus: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await reviewService.updateDNRSetting({
        listingId,
        dnrStatus,
      });

      // Optionally refresh auto reply settings after update
      await dispatch(fetchAutoReviewReplySettings(listingId));

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update DNR setting"
      );
    }
  }
);

// save the auo ai response
export const saveAIAutoReply = createAsyncThunk(
  "reviews/saveAIAutoReply",
  async (payload: SaveAIAutoReplyRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await reviewService.saveAIAutoReply(payload);
      // Optionally: refetch settings after saving
      dispatch(fetchAutoReviewReplySettings(payload.listingId));
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save AI auto reply settings"
      );
    }
  }
);

export const generateAIAutoReply = createAsyncThunk(
  "reviews/generateAIAutoReply",
  async (payload: GenerateAIAutoReplyRequest, { rejectWithValue }) => {
    try {
      const response = await reviewService.generateAIAutoReply(payload);
      console.log("✅ Returned from service:", response);
      return response.data.replyText;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate AI auto reply"
      );
    }
  }
);
