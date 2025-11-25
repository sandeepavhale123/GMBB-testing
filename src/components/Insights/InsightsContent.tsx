import React from "react";
import { VisibilitySummaryCard } from "./VisibilitySummaryCard";
import { TopSearchQueriesWithAPI } from "./TopSearchQueriesWithAPI";
import { CustomerInteractionsCard } from "./CustomerInteractionsCard";
import { CustomerActionsChart } from "./CustomerActionsChart";
import { CustomerSearchSourcesCard } from "./CustomerSearchSourcesCard";

export interface InsightsContentProps {
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

  return (
    <div className="space-y-6 bg-white">
      {/* Row 1: Visibility Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CustomerInteractionsCard
          isLoadingSummary={isLoadingSummary}
          summary={summary}
        />

        <TopSearchQueriesWithAPI />
      </div>

      {/* Row 2: Customer Search Sources - Full Width */}
      <CustomerSearchSourcesCard
        isLoadingSummary={isLoadingSummary}
        summary={summary}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <VisibilitySummaryCard
          isLoadingSummary={isLoadingSummary}
          isLoadingVisibility={isLoadingVisibility}
          summary={summary}
          visibilityTrends={visibilityTrends}
        />

        <CustomerActionsChart
          isLoadingSummary={isLoadingSummary}
          isLoadingVisibility={isLoadingVisibility}
          visibilityTrends={visibilityTrends}
          summary={summary}
        />
      </div>
    </div>
  );
};
