
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ListingStatisticsCards } from './ListingStatisticsCards';
import { ListingSearchFilters } from './ListingSearchFilters';
import { ListingsTable } from './ListingsTable';
import { AccountListingPagination } from './AccountListingPagination';
import { useAccountListings } from '../../hooks/useAccountListings';
import { useListingStatusToggle } from '../../hooks/useListingStatusToggle';
import { Skeleton } from '../ui/skeleton';
import { Search } from 'lucide-react';

interface ListingManagementPageProps {
  accountId: string;
}

export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({
  accountId
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Debounced search to prevent excessive API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch filtered listings for the table
  const {
    listings,
    totalListings: filteredTotalListings,
    activeListings: filteredActiveListings,
    inactiveListings: filteredInactiveListings,
    pagination,
    loading,
    error,
    refetch,
  } = useAccountListings({
    accountId,
    page: currentPage,
    limit: 10,
    search: debouncedSearchTerm,
    status: filterStatus as any,
    sortOrder,
  });

  // Fetch unfiltered statistics for summary cards
  const {
    totalListings: summaryTotalListings,
    activeListings: summaryActiveListings,
    inactiveListings: summaryInactiveListings,
    refetch: refetchSummary,
  } = useAccountListings({
    accountId,
    page: 1,
    limit: 1, // We only need the counts, not the actual listings
    search: '',
    status: 'all',
    sortOrder: 'asc',
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
          // Refetch both filtered data and summary statistics
          refetch();
          refetchSummary();
          console.log('Updated active listings count:', data.activeListings);
        }
      );
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to toggle listing:', error);
    }
  }, [toggleListingStatus, accountId, refetch, refetchSummary]);

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

  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Manage Listings
          </h2>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <ListingStatisticsCards 
          totalListings={summaryTotalListings} 
          activeListings={summaryActiveListings} 
          inactiveListings={summaryInactiveListings} 
        />
      )}

      {/* Search and Filters */}
      <ListingSearchFilters 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onFilterChange={handleFilterChange}
      />

      {/* No Results Message */}
      {showNoResultsMessage && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mb-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-500 text-sm max-w-md">
              {hasSearchTerm 
                ? `No listings match "${debouncedSearchTerm}". Try a different search term.`
                : "No listings match your current filters. Try adjusting your filters."
              }
            </p>
          </div>
        </div>
      )}

      {/* Listings Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      ) : !showNoResultsMessage ? (
        <ListingsTable 
          listings={listings}
          onViewListing={handleViewListing}
          onToggleListing={handleToggleListing}
          loadingStates={loadingStates}
        />
      ) : null}

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
      {!loading && !showNoResultsMessage && (searchTerm || filterStatus !== 'all') && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {listings.length} of {filteredTotalListings} listings
        </div>
      )}
    </div>
  );
};
