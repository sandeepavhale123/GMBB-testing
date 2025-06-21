
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

export interface CustomerActionsRequest {
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

export interface CustomerActionsResponse {
  code: number;
  message: string;
  data: {
    timeframe: {
      start_date: string;
      end_date: string;
    };
    actions_breakdown: {
      website_clicks: {
        total: number;
        daily_average: number;
        peak_day: string;
        peak_value: number;
      };
      direction_requests: {
        total: number;
        daily_average: number;
        peak_day: string;
        peak_value: number;
      };
      phone_calls: {
        total: number;
        daily_average: number;
        peak_day: string;
        peak_value: number;
      };
      messages: {
        total: number;
        daily_average: number;
        peak_day: string;
        peak_value: number;
      };
    };
    chart_data: Array<{
      name: string;
      value: number;
    }>;
  };
}

export interface InsightsComparisonRequest {
  listingId: number;
  dateRange: string;
  startDate?: string;
  endDate?: string;
}

export interface InsightsComparisonResponse {
  code: number;
  message: string;
  data: {
    chart_data: Array<{
      month: string;
      searchViews: number;
      mapsViews: number;
      websiteClicks: number;
      phoneCalls: number;
      date_range: string;
    }>;
    summary: {
      total_search_views: number;
      total_maps_views: number;
      total_website_clicks: number;
      total_phone_calls: number;
      average_monthly_growth: number;
    };
  };
}

export const insightsService = {
  getInsightsSummary: async (params: InsightsSummaryRequest): Promise<InsightsSummaryResponse> => {
    const response = await axiosInstance({
      url: '/get-insights-summary',
      method: 'POST',
      data: params,
    });
    return response.data;
  },

  getVisibilityTrends: async (params: VisibilityTrendsRequest): Promise<VisibilityTrendsResponse> => {
    const response = await axiosInstance({
      url: '/get-visibility-trends',
      method: 'POST',
      data: params,
    });
    return response.data;
  },

  getCustomerActions: async (params: CustomerActionsRequest): Promise<CustomerActionsResponse> => {
    const response = await axiosInstance({
      url: '/get-customer-actions',
      method: 'POST',
      data: params,
    });
    return response.data;
  },

  getInsightsComparison: async (params: InsightsComparisonRequest): Promise<InsightsComparisonResponse> => {
    const response = await axiosInstance({
      url: '/get-insights-comparison',
      method: 'POST',
      data: params,
    });
    return response.data;
  },
};
