import React, { useState, useEffect } from 'react';
import { useListingContext } from '../../context/ListingContext';
import { GeoRankingHeader } from './GeoRankingHeader';
import { MetricsCards } from './MetricsCards';
import { FiltersSidebar } from './FiltersSidebar';
import { GeoRankingMapSection } from './GeoRankingMapSection';
import { UnderPerformingTable } from './UnderPerformingTable';
import { RankingDistribution } from './RankingDistribution';
import { CompetitorAnalysis } from './CompetitorAnalysis';
import { AIInsights } from './AIInsights';
import { GeoRankingEmptyState } from './GeoRankingEmptyState';
import { ProcessingKeywordsAlert } from './ProcessingKeywordsAlert';
import { NoListingSelected } from '../ui/no-listing-selected';
import { useGeoRanking } from '../../hooks/useGeoRanking';
import { Loader2 } from 'lucide-react';

export const GeoRankingPage = () => {
  const { selectedListing, isInitialLoading } = useListingContext();
  const {
    keywords,
    selectedKeyword,
    selectedDate,
    keywordDetails,
    credits,
    loading: keywordsLoading,
    pageLoading,
    error: keywordsError,
    refreshing,
    refreshError,
    refreshProgress,
    handleRefreshKeyword,
    processingKeywords,
    isPolling,
    pollingProgress,
    handleKeywordChange,
    handleDateChange,
    startCustomPolling,
    completePolling,
  } = useGeoRanking(selectedListing?.id ? parseInt(selectedListing.id, 10) : 0);

  // State for controlling the visibility of the filters sidebar
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Function to toggle the filters sidebar
  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

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

  // Check if keywords are still being processed
  if (processingKeywords) {
    return <ProcessingKeywordsAlert keywords={keywords} />;
  }

  // Render the GeoRankingPage content if a listing is selected
  return (
    <div className="flex flex-col h-full">
      {/* GeoRanking Header */}
      <GeoRankingHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        <FiltersSidebar />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-auto">
          {/* Metrics Cards */}
          <MetricsCards />

          {/* Geo Ranking Map Section */}
          <GeoRankingMapSection />

          {/* Underperforming Keywords Table */}
          <UnderPerformingTable />

          {/* Ranking Distribution Chart */}
          <RankingDistribution />

          {/* Competitor Analysis Section */}
          <CompetitorAnalysis />

          {/* AI Insights Section */}
          <AIInsights />
        </div>
      </div>
    </div>
  );
};