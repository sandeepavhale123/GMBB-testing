
import React from 'react';
import { BusinessProfileHeader } from './BusinessProfileHeader';
import { EnhancedStatsCards } from './EnhancedStatsCards';
import { HealthScoreSection } from './HealthScoreSection';
import { EnhancedActivityChart } from './EnhancedActivityChart';
import { PostOverviewCard } from './PostOverviewCard';
import { InsightsCard } from './InsightsCard';
import { BusinessOverview } from './BusinessOverview';
import { RecentActivity } from './RecentActivity';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Business Profile Header */}
      <BusinessProfileHeader />
      
      {/* Enhanced Stats Cards */}
      <EnhancedStatsCards />
      
      {/* Health Score & Quick Wins */}
      <HealthScoreSection />
      
      {/* Post Overview & Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostOverviewCard />
        <InsightsCard />
      </div>
      
      {/* Activity Chart */}
      <div className="grid grid-cols-1 gap-6">
        <EnhancedActivityChart />
      </div>
      
      {/* Business Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessOverview />
        <RecentActivity />
      </div>
    </div>
  );
};
