
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

  const {
    listings,
    totalListings,
    activeListings,
    inactiveListings,
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

      {/* Statistics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <ListingStatisticsCards 
          totalListings={totalListings} 
          activeListings={activeListings} 
          inactiveListings={inactiveListings} 
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            No listings found for "{debouncedSearchTerm}". Try adjusting your search terms or filters.
          </p>
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
      ) : (
        <ListingsTable 
          listings={listings}
          onViewListing={handleViewListing}
          onToggleListing={handleToggleListing}
          loadingStates={loadingStates}
        />
      )}

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
    </div>
  );
};
