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
    isLoading,
    error,
    geoRankingData,
    filters,
    setFilters,
    underPerformingKeywords,
    rankingDistributionData,
    competitorData,
    aiInsights,
    isProcessingKeywords,
  } = useGeoRanking();

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
  if (isProcessingKeywords) {
    return <ProcessingKeywordsAlert />;
  }

  // Render the GeoRankingPage content if a listing is selected
  return (
    <div className="flex flex-col h-full">
      {/* GeoRanking Header */}
      <GeoRankingHeader onFiltersToggle={toggleFilters} />

      <div className="flex flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        <FiltersSidebar
          isOpen={isFiltersOpen}
          onClose={toggleFilters}
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-auto">
          {/* Metrics Cards */}
          <MetricsCards geoRankingData={geoRankingData} isLoading={isLoading} />

          {/* Geo Ranking Map Section */}
          <GeoRankingMapSection geoRankingData={geoRankingData} isLoading={isLoading} />

          {/* Underperforming Keywords Table */}
          <UnderPerformingTable
            underPerformingKeywords={underPerformingKeywords}
            isLoading={isLoading}
          />

          {/* Ranking Distribution Chart */}
          <RankingDistribution
            rankingDistributionData={rankingDistributionData}
            isLoading={isLoading}
          />

          {/* Competitor Analysis Section */}
          <CompetitorAnalysis competitorData={competitorData} isLoading={isLoading} />

          {/* AI Insights Section */}
          <AIInsights aiInsights={aiInsights} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
