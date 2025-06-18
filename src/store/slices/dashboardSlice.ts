import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuickWin {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecentActivity {
  id: string;
  type: 'post' | 'review' | 'media';
  message: string;
  timestamp: string;
}

interface PostStatus {
  live: number;
  scheduled: number;
  failed: number;
}

interface QAStats {
  answered: number;
  pending: number;
  responseRate: number;
}

interface DashboardState {
  viewsThisMonth: number;
  clicksThisMonth: number;
  callsThisMonth: number;
  directionsThisMonth: number;
  quickWins: QuickWin[];
  recentActivity: RecentActivity[];
  postStatus: PostStatus;
  qaStats: QAStats;
  performanceData: Array<{
    date: string;
    views: number;
    clicks: number;
    calls: number;
  }>;
}

const initialState: DashboardState = {
  viewsThisMonth: 2453,
  clicksThisMonth: 892,
  callsThisMonth: 156,
  directionsThisMonth: 324,
  quickWins: [
    {
      id: '1',
      title: 'Add business photos',
      description: 'Upload high-quality photos to showcase your business',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Update business hours',
      description: 'Ensure your hours are accurate for the holidays',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Respond to reviews',
      description: 'Reply to recent customer reviews',
      priority: 'high'
    }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'post',
      message: 'New post published: Weekend Special Offer',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'review',
      message: 'New 5-star review received from Sarah M.',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      type: 'media',
      message: 'Photos uploaded to business gallery',
      timestamp: '1 day ago'
    }
  ],
  postStatus: {
    live: 8,
    scheduled: 3,
    failed: 1
  },
  qaStats: {
    answered: 24,
    pending: 3,
    responseRate: 89
  },
  performanceData: [
    { date: 'Jan', views: 1200, clicks: 300, calls: 45 },
    { date: 'Feb', views: 1800, clicks: 420, calls: 52 },
    { date: 'Mar', views: 2100, clicks: 580, calls: 68 },
    { date: 'Apr', views: 2453, clicks: 892, calls: 78 },
    { date: 'May', views: 2200, clicks: 750, calls: 85 },
    { date: 'Jun', views: 2800, clicks: 950, calls: 92 }
  ]
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    completeQuickWin: (state, action: PayloadAction<string>) => {
      state.quickWins = state.quickWins.filter(win => win.id !== action.payload);
    },
    addRecentActivity: (state, action: PayloadAction<RecentActivity>) => {
      state.recentActivity.unshift(action.payload);
      state.recentActivity = state.recentActivity.slice(0, 10);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase('RESET_STORE', () => {
        return initialState;
      });
  },
});

export const { completeQuickWin, addRecentActivity } = dashboardSlice.actions;
export default dashboardSlice.reducer;
