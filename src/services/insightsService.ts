
import axiosInstance from '../api/axiosInstance';

export interface InsightsSummaryRequest {
  listingId: number;
  dateRange: string;
  startDate?: string;
  endDate?: string;
}

export interface VisibilityTrendsRequest {
  listingId: number;
  dateRange: string;
  startDate?: string;
  endDate?: string;
}

export interface InsightsSummaryResponse {
  code: number;
  message: string;
  data: {
    timeframe: {
      start_date: string;
      end_date: string;
      previous_start_date: string;
      previous_end_date: string;
    };
    visibility_summary: {
      google_search_views: {
        current_period: number;
        previous_period: number;
        percentage_change: number;
        trend: 'up' | 'down';
      };
      google_maps_views: {
        current_period: number;
        previous_period: number;
        percentage_change: number;
        trend: 'up' | 'down';
      };
      total_views: number;
    };
    customer_actions: {
      website_clicks: {
        value: number;
        change_percentage: number;
        trend: 'up' | 'down';
      };
      direction_requests: {
        value: number;
        change_percentage: number;
        trend: 'up' | 'down';
      };
      phone_calls: {
        value: number;
        change_percentage: number;
        trend: 'up' | 'down';
      };
      messages: {
        value: number;
        change_percentage: number;
        trend: 'up' | 'down';
      };
      desktop_search: {
        value: number;
        change_percentage: number;
        trend: 'up' | 'down';
      };
      desktop_map: {
        value: number;
        change_percentage: number;
        trend: 'up' | 'down';
      };
      mobile_search: {
        value: number;
        change_percentage: number;
        trend: 'up' | 'down';
      };
      mobile_map: {
        value: number;
        change_percentage: number;
        trend: 'up' | 'down';
      };
    };
  };
}

export interface VisibilityTrendsResponse {
  code: number;
  message: string;
  data: {
    chart_data: Array<{
      name: string;
      search: number;
      maps: number;
      date_range: string;
    }>;
    summary: {
      total_search_views: number;
      total_maps_views: number;
      search_trend: string;
      maps_trend: string;
    };
  };
}

export const insightsService = {
  getInsightsSummary: async (params: InsightsSummaryRequest): Promise<InsightsSummaryResponse> => {
    const response = await axiosInstance({
      url: '/v1/get-insights-summary',
      method: 'POST',
      data: params,
    });
    return response.data;
  },

  getVisibilityTrends: async (params: VisibilityTrendsRequest): Promise<VisibilityTrendsResponse> => {
    const response = await axiosInstance({
      url: '/v1/get-insight-visibility',
      method: 'POST',
      data: params,
    });
    return response.data;
  },
};
