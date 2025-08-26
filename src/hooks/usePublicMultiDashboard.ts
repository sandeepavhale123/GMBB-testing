// This hook provides public multi-dashboard data without authentication
// Returns dummy data for public access
export const usePublicMultiDashboard = (token: string) => {
  // Mock trends data for public dashboard with proper structure
  const mockTrendsData = {
    data: {
      stats: {
        totalListings: 248,
        avgRating: "4.3",
        totalPosts: 156,
        totalReviews: 892,
      },
    },
  };

  return {
    data: mockTrendsData,
    isLoading: false,
    error: null,
    trendsData: mockTrendsData,
  };
};