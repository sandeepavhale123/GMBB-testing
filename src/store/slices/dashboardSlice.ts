
import { createSlice } from '@reduxjs/toolkit';

interface BusinessProfile {
  name: string;
  address: string;
  avatar: string;
  lastUpdated: string;
}

interface HealthScore {
  score: number;
  status: 'good' | 'warning' | 'critical';
}

interface QuickWin {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface PostStatus {
  live: number;
  scheduled: number;
  failed: number;
}

interface ReviewBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface DashboardState {
  businessProfile: BusinessProfile;
  totalBusinesses: number;
  totalPosts: number;
  totalReviews: number;
  totalMedia: number;
  totalQuestion: number;
  totalAnswer: number;
  avgRating: number;
  viewsThisMonth: number;
  clicksThisMonth: number;
  callsThisMonth: number;
  directionsThisMonth: number;
  messagesThisMonth: number;
  mediaPosts: number;
  reviewsResponded: number;
  qaAnswered: number;
  healthScore: HealthScore;
  aiActions: number;
  manualActions: number;
  postStatus: PostStatus;
  reviewBreakdown: ReviewBreakdown;
  qaStats: {
    answered: number;
    pending: number;
    responseRate: number;
  };
  quickWins: QuickWin[];
  searchBreakdown: {
    desktop: number;
    mobile: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'post' | 'review' | 'media' | 'qa';
    message: string;
    timestamp: string;
  }>;
  performanceData: Array<{
    date: string;
    views: number;
    clicks: number;
    calls: number;
    posts: number;
    mediaResponded: number;
    reviews: number;
    qa: number;
  }>;
  selectedPeriod: '7d' | '30d' | '90d';
}

const initialState: DashboardState = {
  businessProfile: {
    name: 'Downtown Coffee Shop',
    address: '123 Main St, Downtown, City',
    avatar: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100',
    lastUpdated: '2 hours ago'
  },
  totalBusinesses: 12,
  totalPosts: 156,
  totalReviews: 324,
  totalMedia: 89,
  totalQuestion: 53,
  totalAnswer: 45,
  avgRating: 4.7,
  viewsThisMonth: 15420,
  clicksThisMonth: 2180,
  callsThisMonth: 145,
  directionsThisMonth: 892,
  messagesThisMonth: 67,
  mediaPosts: 89,
  reviewsResponded: 298,
  qaAnswered: 45,
  healthScore: {
    score: 85,
    status: 'good'
  },
  aiActions: 75,
  manualActions: 25,
  postStatus: {
    live: 12,
    scheduled: 5,
    failed: 2
  },
  reviewBreakdown: {
    5: 198,
    4: 89,
    3: 25,
    2: 8,
    1: 4
  },
  qaStats: {
    answered: 45,
    pending: 8,
    responseRate: 85
  },
  quickWins: [
    { id: '1', title: 'Add business hours', description: 'Complete your profile', priority: 'high' },
    { id: '2', title: 'Upload new photos', description: 'Keep content fresh', priority: 'medium' },
    { id: '3', title: 'Respond to reviews', description: '3 pending responses', priority: 'high' }
  ],
  searchBreakdown: {
    desktop: 60,
    mobile: 40
  },
  recentActivity: [
    { id: '1', type: 'review', message: 'New 5-star review received for Downtown Coffee', timestamp: '2 hours ago' },
    { id: '2', type: 'post', message: 'Weekly special post published for 3 locations', timestamp: '5 hours ago' },
    { id: '3', type: 'media', message: 'New photos uploaded to Main Street Bakery', timestamp: '1 day ago' },
    { id: '4', type: 'qa', message: 'Answered question about opening hours', timestamp: '2 days ago' }
  ],
  performanceData: [
    { date: 'Jan', views: 12000, clicks: 1800, calls: 120, posts: 45, mediaResponded: 30, reviews: 85, qa: 12 },
    { date: 'Feb', views: 13500, clicks: 2100, calls: 135, posts: 52, mediaResponded: 35, reviews: 92, qa: 15 },
    { date: 'Mar', views: 15420, clicks: 2180, calls: 145, posts: 59, mediaResponded: 38, reviews: 98, qa: 18 }
  ],
  selectedPeriod: '30d'
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateMetrics: (state, action) => {
      Object.assign(state, action.payload);
    },
    setPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    completeQuickWin: (state, action) => {
      state.quickWins = state.quickWins.filter(win => win.id !== action.payload);
    }
  },
});

export const { updateMetrics, setPeriod, completeQuickWin } = dashboardSlice.actions;
export default dashboardSlice.reducer;
