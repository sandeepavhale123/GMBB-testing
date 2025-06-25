
import React from 'react';
import { ListingStatisticsCards } from './ListingStatisticsCards';
import { ListingSearchFilters } from './ListingSearchFilters';
import { ListingsTable } from './ListingsTable';
import { AccountListingPagination } from './AccountListingPagination';
import { ListingManagementLoading } from './ListingManagementLoading';
import { ListingManagementError } from './ListingManagementError';
import { ListingManagementEmpty } from './ListingManagementEmpty';
import { ListingManagementSummary } from './ListingManagementSummary';
import { useListingManagement } from '../../hooks/useListingManagement';

interface ListingManagementPageProps {
  accountId: string;
}

export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({
  accountId
}) => {
  const {
    searchTerm,
    filterStatus,
    currentPage,
    debouncedSearchTerm,
    listings,
    filteredTotalListings,
    summaryTotalListings,
    summaryActiveListings,
    summaryInactiveListings,
    pagination,
    loading,
    error,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleViewListing,
    handleToggleListing,
    refetch,
    isLoading,
  } = useListingManagement({ accountId });

  // Create loading states object for the table
  const loadingStates = React.useMemo(() => {
    const states: Record<string, boolean> = {};
    listings.forEach(listing => {
      states[listing.id] = isLoading(listing.id);
    });
    return states;
  }, [listings, isLoading]);

  // Check if we have search term and no results
  const hasSearchTerm = debouncedSearchTerm.trim().length > 0;
  const hasFilters = filterStatus !== 'all';
  const showNoResultsMessage = !loading && listings.length === 0 && (hasSearchTerm || hasFilters);

  if (loading) {
    return <ListingManagementLoading />;
  }

  if (error) {
    return <ListingManagementError error={error} onRetry={refetch} />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Manage Listings
        </h2>
      </div>

      {/* Statistics Cards - Always show unfiltered totals */}
      <ListingStatisticsCards 
        totalListings={summaryTotalListings} 
        activeListings={summaryActiveListings} 
        inactiveListings={summaryInactiveListings} 
      />

      {/* Search and Filters */}
      <ListingSearchFilters 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onFilterChange={handleFilterChange}
      />

      {/* No Results Message */}
      {showNoResultsMessage && (
        <ListingManagementEmpty 
          hasSearchTerm={hasSearchTerm}
          searchTerm={debouncedSearchTerm}
        />
      )}

      {/* Listings Table */}
      {!showNoResultsMessage && (
        <ListingsTable 
          listings={listings}
          onViewListing={handleViewListing}
          onToggleListing={handleToggleListing}
          loadingStates={loadingStates}
        />
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages && pagination.total_pages > 1 && !showNoResultsMessage && (
        <div className="mt-6">
          <AccountListingPagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            hasNext={pagination.has_next || false}
            hasPrev={pagination.has_prev || false}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Results count - Show filtered results count */}
      {!showNoResultsMessage && (searchTerm || filterStatus !== 'all') && (
        <ListingManagementSummary 
          listingsCount={listings.length}
          totalListings={filteredTotalListings}
        />
      )}
    </div>
  );
};
