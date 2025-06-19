
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { insightsService, InsightsSummaryRequest, InsightsSummaryResponse, VisibilityTrendsRequest, VisibilityTrendsResponse, CustomerActionsRequest, CustomerActionsResponse } from '../../services/insightsService';

export interface InsightsState {
  summary: InsightsSummaryResponse['data'] | null;
  visibilityTrends: VisibilityTrendsResponse['data'] | null;
  customerActions: CustomerActionsResponse['data'] | null;
  isLoadingSummary: boolean;
  isLoadingVisibility: boolean;
  isLoadingCustomerActions: boolean;
  summaryError: string | null;
  visibilityError: string | null;
  customerActionsError: string | null;
  lastUpdated: string | null;
}

const initialState: InsightsState = {
  summary: null,
  visibilityTrends: null,
  customerActions: null,
  isLoadingSummary: false,
  isLoadingVisibility: false,
  isLoadingCustomerActions: false,
  summaryError: null,
  visibilityError: null,
  customerActionsError: null,
  lastUpdated: null,
};

// Async thunks
export const fetchInsightsSummary = createAsyncThunk(
  'insights/fetchSummary',
  async (params: InsightsSummaryRequest, { rejectWithValue }) => {
    try {
      const response = await insightsService.getInsightsSummary(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch insights summary');
    }
  }
);

export const fetchVisibilityTrends = createAsyncThunk(
  'insights/fetchVisibilityTrends',
  async (params: VisibilityTrendsRequest, { rejectWithValue }) => {
    try {
      const response = await insightsService.getVisibilityTrends(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch visibility trends');
    }
  }
);

export const fetchCustomerActions = createAsyncThunk(
  'insights/fetchCustomerActions',
  async (params: CustomerActionsRequest, { rejectWithValue }) => {
    try {
      const response = await insightsService.getCustomerActions(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer actions');
    }
  }
);

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.summaryError = null;
      state.visibilityError = null;
      state.customerActionsError = null;
    },
    setLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Insights Summary
    builder
      .addCase(fetchInsightsSummary.pending, (state) => {
        state.isLoadingSummary = true;
        state.summaryError = null;
      })
      .addCase(fetchInsightsSummary.fulfilled, (state, action) => {
        state.isLoadingSummary = false;
        state.summary = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchInsightsSummary.rejected, (state, action) => {
        state.isLoadingSummary = false;
        state.summaryError = action.payload as string;
      });

    // Visibility Trends
    builder
      .addCase(fetchVisibilityTrends.pending, (state) => {
        state.isLoadingVisibility = true;
        state.visibilityError = null;
      })
      .addCase(fetchVisibilityTrends.fulfilled, (state, action) => {
        state.isLoadingVisibility = false;
        state.visibilityTrends = action.payload;
      })
      .addCase(fetchVisibilityTrends.rejected, (state, action) => {
        state.isLoadingVisibility = false;
        state.visibilityError = action.payload as string;
      });

    // Customer Actions
    builder
      .addCase(fetchCustomerActions.pending, (state) => {
        state.isLoadingCustomerActions = true;
        state.customerActionsError = null;
      })
      .addCase(fetchCustomerActions.fulfilled, (state, action) => {
        state.isLoadingCustomerActions = false;
        state.customerActions = action.payload;
      })
      .addCase(fetchCustomerActions.rejected, (state, action) => {
        state.isLoadingCustomerActions = false;
        state.customerActionsError = action.payload as string;
      });
  },
});

export const { clearErrors, setLastUpdated } = insightsSlice.actions;
export default insightsSlice.reducer;
