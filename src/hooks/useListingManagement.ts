import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAccountListings } from "./useAccountListings";
import { useListingStatusToggle } from "./useListingStatusToggle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_QUERY_KEYS } from "@/api/dashboardQueryKeys";
import axiosInstance from "@/api/axiosInstance";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

type TogglePayload = { listingId: string; isActive: boolean };
export interface UseListingManagementParams {
  accountId: string;
  onListingStatusChange?: () => Promise<void>; // ADD THIS LINE
}

export const useListingManagement = ({
  accountId,
  onListingStatusChange, // ADD THIS PARAMETER
}: UseListingManagementParams) => {
  const queryClient = useQueryClient();
  const { t } = useI18nNamespace("hooks/useListingManagement");

  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Debounced search to prevent excessive API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
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
    loading: filteredDataLoading,
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

  // Fetch unfiltered statistics for summary cards - separate loading state
  const {
    totalListings: summaryTotalListings,
    activeListings: summaryActiveListings,
    inactiveListings: summaryInactiveListings,
    loading: summaryDataLoading,
    refetch: refetchSummary,
    profileEmail: profileEmail,
  } = useAccountListings({
    accountId,
    page: 1,
    limit: 1, // We only need the counts, not the actual listings
    search: "",
    status: "all",
    sortOrder: "asc",
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

  const handleViewListing = useCallback(
    (listingId: string) => {
      navigate(`/location-dashboard/${listingId}`);
      const listing = listings.find((l) => l.id === listingId);
      if (listing) {
        toast({
          title: t("viewListingSuccessTitle"),
          description: t("viewListingSuccessDesc", { name: listing.name }),
          // `Opening ${listing.name} listing page.`,
        });
      }
    },
    [navigate, listings, toast]
  );

  // const handleToggleListing = useCallback(
  //   async (listingId: string, isActive: boolean) => {
  //     try {
  //       await toggleListingStatus(
  //         listingId,
  //         parseInt(accountId),
  //         isActive,
  //         (data) => {
  //           // Refetch both filtered data and summary statistics
  //           refetch();
  //           refetchSummary();
  //         }
  //       );
  //     } catch (error) {
  //       // Error handling is done in the hook
  //       console.error("Failed to toggle listing:", error);
  //     }
  //   },
  //   [toggleListingStatus, accountId, refetch, refetchSummary]
  // );

  const handleToggleListing = useCallback(
    async (listingId: string, isActive: boolean) => {
      try {
        await toggleListingStatus(
          listingId,
          parseInt(accountId),
          isActive,
          async (data) => {
            // MAKE THIS ASYNC
            // Refetch both filtered data and summary statistics
            await refetch();
            await refetchSummary();

            // Trigger business listings refresh for dropdown sync
            if (onListingStatusChange) {
              try {
                await onListingStatusChange();
              } catch (error) {
                console.error(
                  "🔄 ListingManagement: Failed to refresh business listings:",
                  error
                );
              }
            }

            // ✅ Invalidate all dashboards so they refetch
            Object.values(DASHBOARD_QUERY_KEYS).forEach((key) => {
              queryClient.invalidateQueries({
                predicate: (query) =>
                  Array.isArray(query.queryKey) && query.queryKey[0] === key,
              });
            });
          }
        );
      } catch (error) {
        // Error handling is done in the hook
        console.error("Failed to toggle listing:", error);
      }
    },
    [
      toggleListingStatus,
      accountId,
      refetch,
      refetchSummary,
      onListingStatusChange,
      queryClient,
    ]
  );

  return {
    // State
    searchTerm,
    filterStatus,
    currentPage,
    debouncedSearchTerm,

    // Data
    listings,
    filteredTotalListings,
    filteredActiveListings,
    filteredInactiveListings,
    summaryTotalListings,
    summaryActiveListings,
    summaryInactiveListings,
    pagination,

    // Loading states - separate for filtered data and summary
    filteredDataLoading,
    summaryDataLoading,
    profileEmail,
    error,

    // Handlers
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleViewListing,
    handleToggleListing,

    // Utils
    refetch,
    isLoading,
  };
};
