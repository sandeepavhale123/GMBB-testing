
import React from 'react';
import { StatsCards } from './StatsCards';
import { PerformanceChart } from './PerformanceChart';
import { RecentActivity } from './RecentActivity';
import { BusinessOverview } from './BusinessOverview';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart - takes 2 columns */}
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        
        {/* Business Overview - takes 1 column */}
        <div className="lg:col-span-1">
          <BusinessOverview />
        </div>
      </div>
      
      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};
