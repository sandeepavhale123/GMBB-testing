
import React from 'react';
import { BusinessProfileHeader } from './BusinessProfileHeader';
import { EnhancedStatsCards } from './EnhancedStatsCards';
import { EnhancedActivityChart } from './EnhancedActivityChart';
import { PostOverviewCard } from './PostOverviewCard';
import { InsightsCard } from './InsightsCard';
import { QuickWinsCard } from './QuickWinsCard';
import { DailyActivitySummaryChart } from './DailyActivitySummaryChart';
import { ProgressDonutChart } from './ProgressDonutChart';
import { ReviewSummaryCard } from './ReviewSummaryCard';
import { QACard } from './QACard';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Business Profile Header */}
      <BusinessProfileHeader />
      
      {/* Enhanced Stats Cards */}
      <EnhancedStatsCards />
      
      {/* Post Overview & Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostOverviewCard />
        <InsightsCard />
      </div>
      
      {/* Quick Wins Card */}
      <QuickWinsCard />
      
      {/* Daily Activity Summary & Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyActivitySummaryChart />
        <ProgressDonutChart />
      </div>
      
      {/* Activity Chart */}
      <div className="grid grid-cols-1 gap-6">
        <EnhancedActivityChart />
      </div>
      
      {/* Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReviewSummaryCard />
        <QACard />
      </div>
    </div>
  );
};
