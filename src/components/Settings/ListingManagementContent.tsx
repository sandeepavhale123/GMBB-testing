import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ListingStatisticsCards } from './ListingStatisticsCards';
import { ListingSearchFilters } from './ListingSearchFilters';
import { ListingsTable } from './ListingsTable';
import { AccountListingPagination } from './AccountListingPagination';
import { ListingLoadingState } from './ListingLoadingState';
import { NoResultsMessage } from './NoResultsMessage';
import { useAccountListings } from '../../hooks/useAccountListings';
import { useListingStatusToggle } from '../../hooks/useListingStatusToggle';

interface ListingManagementContentProps {
  accountId: string;
}

export const ListingManagementContent: React.FC<ListingManagementContentProps> = ({
  accountId
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Debounced search with 3 second delay
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    listings,
    totalListings,
    activeListings,
    inactiveListings,
    pagination,
    loading,
    refetch,
  } = useAccountListings({
    accountId,
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    status: filterStatus as any,
    sortOrder,
  });

  const { toggleListingStatus, isLoading } = useListingStatusToggle();

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleViewListing = useCallback((listingId: string) => {
    navigate(`/business-info/${listingId}`);
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      toast({
        title: "Opening Listing",
        description: `Opening ${listing.name} listing page.`
      });
    }
    console.log(`Navigating to listing page for listing ${listingId}`);
  }, [navigate, listings, toast]);

  const handleToggleListing = useCallback(async (listingId: string, isActive: boolean) => {
    try {
      await toggleListingStatus(
        listingId, 
        parseInt(accountId), 
        isActive,
        (data) => {
          // Refetch data to get updated statistics and listing states
          refetch();
          console.log('Updated active listings count:', data.activeListings);
        }
      );
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to toggle listing:', error);
    }
  }, [toggleListingStatus, accountId, refetch]);

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
  const showNoResultsMessage = hasSearchTerm && !loading && listings.length === 0;

  if (loading) {
    return <ListingLoadingState />;
  }

  return (
    <>
      {/* Statistics Cards */}
      <ListingStatisticsCards 
        totalListings={totalListings} 
        activeListings={activeListings} 
        inactiveListings={inactiveListings} 
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
        <NoResultsMessage searchTerm={debouncedSearchTerm} />
      )}

      {/* Listings Table */}
      <ListingsTable 
        listings={listings}
        onViewListing={handleViewListing}
        onToggleListing={handleToggleListing}
        loadingStates={loadingStates}
      />

      {/* Pagination */}
      {pagination && pagination.total_pages && pagination.total_pages > 1 && (
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

      {/* Results count */}
      {!loading && (searchTerm || filterStatus !== 'all') && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {listings.length} of {totalListings} listings
        </div>
      )}
    </>
  );
};
