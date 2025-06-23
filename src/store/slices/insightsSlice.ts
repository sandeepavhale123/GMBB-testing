
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { insightsService, InsightsSummaryRequest, InsightsSummaryResponse, VisibilityTrendsRequest, VisibilityTrendsResponse, CustomerActionsRequest, CustomerActionsResponse, InsightsComparisonRequest, InsightsComparisonResponse, RefreshInsightsRequest } from '../../services/insightsService';

export interface InsightsState {
  summary: InsightsSummaryResponse['data'] | null;
  visibilityTrends: VisibilityTrendsResponse['data'] | null;
  customerActions: CustomerActionsResponse['data'] | null;
  comparisonData: InsightsComparisonResponse['data']['chart_data'] | null;
  isLoadingSummary: boolean;
  isLoadingVisibility: boolean;
  isLoadingCustomerActions: boolean;
  isLoadingComparison: boolean;
  isRefreshing: boolean;
  summaryError: string | null;
  visibilityError: string | null;
  customerActionsError: string | null;
  comparisonError: string | null;
  refreshError: string | null;
  lastUpdated: string | null;
}

const initialState: InsightsState = {
  summary: null,
  visibilityTrends: null,
  customerActions: null,
  comparisonData: null,
  isLoadingSummary: false,
  isLoadingVisibility: false,
  isLoadingCustomerActions: false,
  isLoadingComparison: false,
  isRefreshing: false,
  summaryError: null,
  visibilityError: null,
  customerActionsError: null,
  comparisonError: null,
  refreshError: null,
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

export const fetchInsightsComparison = createAsyncThunk(
  'insights/fetchComparison',
  async (params: InsightsComparisonRequest, { rejectWithValue }) => {
    try {
      const response = await insightsService.getInsightsComparison(params);
      return response.data.chart_data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch insights comparison');
    }
  }
);

export const refreshInsights = createAsyncThunk(
  'insights/refreshInsights',
  async (params: RefreshInsightsRequest, { rejectWithValue }) => {
    try {
      const response = await insightsService.refreshInsights(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh insights');
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
      state.comparisonError = null;
      state.refreshError = null;
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

    // Insights Comparison
    builder
      .addCase(fetchInsightsComparison.pending, (state) => {
        state.isLoadingComparison = true;
        state.comparisonError = null;
      })
      .addCase(fetchInsightsComparison.fulfilled, (state, action) => {
        state.isLoadingComparison = false;
        state.comparisonData = action.payload;
      })
      .addCase(fetchInsightsComparison.rejected, (state, action) => {
        state.isLoadingComparison = false;
        state.comparisonError = action.payload as string;
      });

    // Refresh Insights
    builder
      .addCase(refreshInsights.pending, (state) => {
        state.isRefreshing = true;
        state.refreshError = null;
      })
      .addCase(refreshInsights.fulfilled, (state, action) => {
        state.isRefreshing = false;
      })
      .addCase(refreshInsights.rejected, (state, action) => {
        state.isRefreshing = false;
        state.refreshError = action.payload as string;
      });
  },
});

export const { clearErrors, setLastUpdated } = insightsSlice.actions;
export default insightsSlice.reducer;
