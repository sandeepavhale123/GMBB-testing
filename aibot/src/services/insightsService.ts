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

export interface RefreshInsightsRequest {
  listingId: number;
}

export interface RefreshInsightsResponse {
  code: number;
  message: string;
  data: {
    listingId: number;
  };
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
      website: number;
      direction: number;
      messages: number;
      calls: number;
      date_range: string;
    }>;
    summary: {
      total_search_views: number;
      total_maps_views: number;
      total_website_views: number;
      total_direction_views: number;
      total_message_views: number;
      total_calls_views: number;
      search_trend: string;
      maps_trend: string;
      website_trend: string;
      direction_trend: string;
      message_trend: string;
      calls_trend: string;
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

export interface TopKeywordQueryRequest {
  listingId: number;
  month: string;
}

export interface TopKeywordQueryResponse {
  code: number;
  message: string;
  data: {
    MonthName: string;
    Monthdata: Array<{
      id: string;
      gmb_id: string;
      user_id: string;
      acc_id: string;
      keyword: string;
      impressions: string;
      yearmonth: string;
      fetched_at: string;
    }>;
    avaialbleRecords: string[];
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

  refreshInsights: async (params: RefreshInsightsRequest): Promise<RefreshInsightsResponse> => {
    const response = await axiosInstance({
      url: '/refresh-insights',
      method: 'POST',
      data: params,
    });
    return response.data;
  },

  getTopKeywordQuery: async (params: TopKeywordQueryRequest): Promise<TopKeywordQueryResponse> => {
    const response = await axiosInstance({
      url: '/get-top-keyword-query',
      method: 'POST',
      data: params,
    });
    return response.data;
  },
};
