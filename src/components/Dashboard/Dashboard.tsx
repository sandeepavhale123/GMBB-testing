
import React from 'react';
import { BusinessProfileHeader } from './BusinessProfileHeader';
import { EnhancedStatsCards } from './EnhancedStatsCards';
import { HealthScoreSection } from './HealthScoreSection';
import { EnhancedActivityChart } from './EnhancedActivityChart';
import { PostManagementWidget } from './PostManagementWidget';
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
      
      {/* Activity Chart & Post Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedActivityChart />
        </div>
        <div className="lg:col-span-1">
          <PostManagementWidget />
        </div>
      </div>
      
      {/* Business Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessOverview />
        <RecentActivity />
      </div>
    </div>
  );
};
