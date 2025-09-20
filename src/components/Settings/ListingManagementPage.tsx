import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingStatisticsCards } from "./ListingStatisticsCards";
import { ListingSearchFilters } from "./ListingSearchFilters";
import { ListingManagementSearchError } from "./ListingManagementSearchError";
import { ListingsTable } from "./ListingsTable";
import { AccountListingPagination } from "./AccountListingPagination";
import { ListingManagementLoading } from "./ListingManagementLoading";
import { ListingManagementError } from "./ListingManagementError";
import { ListingManagementSummary } from "./ListingManagementSummary";
import { useListingManagement } from "../../hooks/useListingManagement";
import { useListingContext } from "@/context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface ListingManagementPageProps {
  accountId: string;
}
export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({
  accountId,
}) => {
  const { t } = useI18nNamespace("Settings/listingManagementPage");
  const navigate = useNavigate();
  const location = useLocation();
  const { refetchListings } = useListingContext(); // ADD

  // Check if we're on multi dashboard
  const isMultiDashboard = location.pathname.includes("/main-dashboard");
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
    filteredDataLoading,
    summaryDataLoading,
    error,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleViewListing,
    handleToggleListing,
    refetch,
    isLoading,
  } = useListingManagement({
    accountId,
    onListingStatusChange: refetchListings, // ADD THIS PARAMETER
  });

  // Create loading states object for the table
  const loadingStates = React.useMemo(() => {
    const states: Record<string, boolean> = {};
    listings.forEach((listing) => {
      states[listing.id] = isLoading(listing.id);
    });
    return states;
  }, [listings, isLoading]);

  // Check if we have search term and no results
  const hasSearchTerm = debouncedSearchTerm.trim().length > 0;
  const hasFilters = filterStatus !== "all";
  const showSearchError =
    !filteredDataLoading &&
    listings.length === 0 &&
    (hasSearchTerm || hasFilters);

  // Show loading only on initial page load (when we have no data yet)
  if (summaryDataLoading && summaryTotalListings === 0) {
    return <ListingManagementLoading />;
  }
  const handleClearSearch = () => {
    handleSearchChange("");
  };
  if (error) {
    return (
      <ListingManagementError
        error={error}
        onRetry={refetch}
        onClearSearch={handleClearSearch}
      />
    );
  }
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          {isMultiDashboard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/main-dashboard/settings")}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200"
            >
              {t("listingManagementPage.backButton")}
            </Button>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("listingManagementPage.pageTitle")}
          </h2>
        </div>
      </div>

      {/* Statistics Cards - Never show loading after initial load */}
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

      {/* Search Error Message - appears below search box */}
      {showSearchError && (
        <ListingManagementSearchError
          hasSearchTerm={hasSearchTerm}
          searchTerm={debouncedSearchTerm}
          hasFilters={hasFilters}
        />
      )}

      {/* Listings Table - show loading state for table data only */}
      {filteredDataLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">
            {t("listingManagementPage.loadingListings")}
          </p>
        </div>
      ) : (
        !showSearchError && (
          <ListingsTable
            listings={listings}
            onViewListing={handleViewListing}
            onToggleListing={handleToggleListing}
            loadingStates={loadingStates}
          />
        )
      )}

      {/* Pagination */}
      {pagination &&
        pagination.total_pages &&
        pagination.total_pages > 1 &&
        !showSearchError && (
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
      {!showSearchError && (searchTerm || filterStatus !== "all") && (
        <ListingManagementSummary
          listingsCount={listings.length}
          totalListings={filteredTotalListings}
        />
      )}
    </div>
  );
};
