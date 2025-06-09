
import { createSlice } from '@reduxjs/toolkit';

interface DashboardState {
  totalBusinesses: number;
  totalPosts: number;
  totalReviews: number;
  avgRating: number;
  viewsThisMonth: number;
  clicksThisMonth: number;
  callsThisMonth: number;
  directionsThisMonth: number;
  recentActivity: Array<{
    id: string;
    type: 'post' | 'review' | 'media';
    message: string;
    timestamp: string;
  }>;
  performanceData: Array<{
    date: string;
    views: number;
    clicks: number;
    calls: number;
  }>;
}

const initialState: DashboardState = {
  totalBusinesses: 12,
  totalPosts: 156,
  totalReviews: 324,
  avgRating: 4.7,
  viewsThisMonth: 15420,
  clicksThisMonth: 2180,
  callsThisMonth: 145,
  directionsThisMonth: 892,
  recentActivity: [
    { id: '1', type: 'review', message: 'New 5-star review received for Downtown Coffee', timestamp: '2 hours ago' },
    { id: '2', type: 'post', message: 'Weekly special post published for 3 locations', timestamp: '5 hours ago' },
    { id: '3', type: 'media', message: 'New photos uploaded to Main Street Bakery', timestamp: '1 day ago' },
  ],
  performanceData: [
    { date: 'Jan', views: 12000, clicks: 1800, calls: 120 },
    { date: 'Feb', views: 13500, clicks: 2100, calls: 135 },
    { date: 'Mar', views: 15420, clicks: 2180, calls: 145 },
  ],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateMetrics: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateMetrics } = dashboardSlice.actions;
export default dashboardSlice.reducer;
