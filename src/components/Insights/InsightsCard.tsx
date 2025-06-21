
import React from 'react';
import { useInsightsData } from '../../hooks/useInsightsData';
import { useInsightsExport } from '../../hooks/useInsightsExport';
import { InsightsHeader } from './InsightsHeader';
import { InsightsErrorState } from './InsightsErrorState';
import { InsightsContent } from './InsightsContent';

export const InsightsCard: React.FC = () => {
  const {
    dateRange,
    customDateRange,
    selectedMonth,
    summary,
    visibilityTrends,
    customerActions,
    topKeywordQueries,
    isLoadingSummary,
    isLoadingVisibility,
    isLoadingCustomerActions,
    isLoadingTopQueries,
    summaryError,
    visibilityError,
    customerActionsError,
    topQueriesError,
    selectedListing,
    handleDateRangeChange,
    handleCustomDateRangeChange,
    handleMonthChange,
    handleRefresh
  } = useInsightsData();

  const { isExporting, exportRef, handleExportImage } = useInsightsExport(selectedListing);

  // Show error state
  if (summaryError || visibilityError || customerActionsError || topQueriesError) {
    return (
      <InsightsErrorState
        error={summaryError || visibilityError || customerActionsError || topQueriesError}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      <InsightsHeader
        dateRange={dateRange}
        customDateRange={customDateRange}
        showCustomPicker={false}
        isLoading={isLoadingSummary || isLoadingVisibility || isLoadingCustomerActions || isLoadingTopQueries}
        isExporting={isExporting}
        summary={summary}
        onDateRangeChange={handleDateRangeChange}
        onCustomDateRangeChange={handleCustomDateRangeChange}
        onRefresh={handleRefresh}
        onExportImage={handleExportImage}
      />

      {/* Exportable Content Area */}
      <div ref={exportRef}>
        <InsightsContent
          isLoadingSummary={isLoadingSummary}
          isLoadingVisibility={isLoadingVisibility}
          isLoadingCustomerActions={isLoadingCustomerActions}
          isLoadingTopQueries={isLoadingTopQueries}
          summary={summary}
          visibilityTrends={visibilityTrends}
          customerActions={customerActions}
          topKeywordQueries={topKeywordQueries}
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
};
