
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
    summary,
    visibilityTrends,
    customerActions,
    isLoadingSummary,
    isLoadingVisibility,
    isLoadingCustomerActions,
    isRefreshing,
    summaryError,
    visibilityError,
    customerActionsError,
    selectedListing,
    handleDateRangeChange,
    handleCustomDateRangeChange,
    handleRefresh
  } = useInsightsData();

  const { isExporting, exportRef, handleExportImage } = useInsightsExport(selectedListing);

  // Show error state
  if (summaryError || visibilityError || customerActionsError) {
    return (
      <InsightsErrorState
        error={summaryError || visibilityError || customerActionsError}
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
        isLoading={isLoadingSummary || isLoadingVisibility || isLoadingCustomerActions}
        isRefreshing={isRefreshing}
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
          summary={summary}
          visibilityTrends={visibilityTrends}
          customerActions={customerActions}
        />
      </div>
    </div>
  );
};
