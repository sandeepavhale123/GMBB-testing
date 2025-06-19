
import React from 'react';
import { VisibilitySummaryCard } from './VisibilitySummaryCard';
import { TopSearchQueriesCard } from './TopSearchQueriesCard';
import { CustomerInteractionsCard } from './CustomerInteractionsCard';
import { CustomerActionsChart } from './CustomerActionsChart';

interface InsightsContentProps {
  isLoadingSummary: boolean;
  isLoadingVisibility: boolean;
  isLoadingCustomerActions: boolean;
  summary: any;
  visibilityTrends: any;
  customerActions: any;
}

export const InsightsContent: React.FC<InsightsContentProps> = ({
  isLoadingSummary,
  isLoadingVisibility,
  isLoadingCustomerActions,
  summary,
  visibilityTrends,
  customerActions,
}) => {
  const customerActionsChartData = customerActions?.chart_data || (summary ? [
    { name: 'Website', value: summary.customer_actions.website_clicks.value },
    { name: 'Direction', value: summary.customer_actions.direction_requests.value },
    { name: 'Calls', value: summary.customer_actions.phone_calls.value },
    { name: 'Messages', value: summary.customer_actions.messages.value },
  ] : []);

  return (
    <div className="space-y-6 bg-white">
      {/* Row 1: Visibility Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <VisibilitySummaryCard
          isLoadingSummary={isLoadingSummary}
          isLoadingVisibility={isLoadingVisibility}
          summary={summary}
          visibilityTrends={visibilityTrends}
        />

        <TopSearchQueriesCard
          isLoading={isLoadingSummary}
          summary={summary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CustomerInteractionsCard
          isLoadingSummary={isLoadingSummary}
          summary={summary}
        />

        <CustomerActionsChart
          isLoadingSummary={isLoadingSummary}
          isLoadingCustomerActions={isLoadingCustomerActions}
          customerActionsChartData={customerActionsChartData}
          customerActions={customerActions}
          summary={summary}
        />
      </div>
    </div>
  );
};
