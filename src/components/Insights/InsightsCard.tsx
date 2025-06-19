
import React from 'react';
import { useInsightsData } from '../../hooks/useInsightsData';
import { useInsightsExport } from '../../hooks/useInsightsExport';
import { InsightsHeader } from './InsightsHeader';
import { InsightsErrorState } from './InsightsErrorState';
import { InsightsContent } from './InsightsContent';
import { ExportHeader } from './ExportHeader';

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
    summaryError,
    visibilityError,
    customerActionsError,
    selectedListing,
    handleDateRangeChange,
    handleCustomDateRangeChange,
    handleRefresh
  } = useInsightsData();

  const { isExporting, exportRef, handleExportImage } = useInsightsExport(
    selectedListing, 
    dateRange, 
    customDateRange
  );

  // Show error state
  if (summaryError || visibilityError || customerActionsError) {
    return (
      <InsightsErrorState
        error={summaryError || visibilityError || customerActionsError}
        onRetry={handleRefresh}
      />
    );
  }

  // Prepare date range for export header
  const exportDateRange = customDateRange?.from && customDateRange?.to 
    ? { from: customDateRange.from, to: customDateRange.to }
    : summary?.timeframe 
      ? { 
          from: new Date(summary.timeframe.start_date), 
          to: new Date(summary.timeframe.end_date) 
        }
      : undefined;

  return (
    <div className="space-y-6">
      <InsightsHeader
        dateRange={dateRange}
        customDateRange={customDateRange}
        showCustomPicker={false}
        isLoading={isLoadingSummary || isLoadingVisibility || isLoadingCustomerActions}
        isExporting={isExporting}
        summary={summary}
        onDateRangeChange={handleDateRangeChange}
        onCustomDateRangeChange={handleCustomDateRangeChange}
        onRefresh={handleRefresh}
        onExportImage={handleExportImage}
      />

      {/* Exportable Content Area */}
      <div ref={exportRef} className="export-container">
        {/* Export Header - Only visible in exported image */}
        <ExportHeader 
          listingName={selectedListing?.name}
          dateRange={exportDateRange}
        />

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
