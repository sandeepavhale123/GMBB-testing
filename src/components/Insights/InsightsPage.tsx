import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchInsightsSummary, fetchVisibilityTrends } from '../../store/slices/insightsSlice';
import { useListingContext } from '../../context/ListingContext';
import { InsightsHeader } from './InsightsHeader';
import { InsightsContent } from './InsightsContent';
import { InsightsErrorState } from './InsightsErrorState';
import { NoListingSelected } from '../ui/no-listing-selected';
import { Loader2 } from 'lucide-react';

export const InsightsPage = () => {
  const dispatch = useAppDispatch();
  const { selectedListing, isInitialLoading } = useListingContext();
  const { summary, visibilityTrends, isLoadingSummary, isLoadingVisibility } = useAppSelector((state) => state.insights);
  const [insightsDateRange, setInsightsDateRange] = useState("30");

  useEffect(() => {
    if (selectedListing?.id) {
      const params = {
        listingId: parseInt(selectedListing.id, 10),
        dateRange: insightsDateRange,
        startDate: "",
        endDate: "",
      };

      console.log("Fetching insights data with params:", params);

      dispatch(fetchInsightsSummary(params));
      dispatch(fetchVisibilityTrends(params));
    }
  }, [selectedListing?.id, insightsDateRange, dispatch]);

  // Show loading state during initial load
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  // Show no listing state
  if (!selectedListing && !isInitialLoading) {
    return <NoListingSelected />;
  }

  return (
    <div className="space-y-6">
      <InsightsHeader />
      <InsightsContent
        summary={summary}
        visibilityTrends={visibilityTrends}
        isLoadingSummary={isLoadingSummary}
        isLoadingVisibility={isLoadingVisibility}
        isLoadingCustomerActions={false}
        customerActions={[]}
      />
    </div>
  );
};
