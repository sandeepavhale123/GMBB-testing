import React, { useEffect, useMemo } from "react";
import { QAHeader } from "./QAHeader";
import { QAFilters } from "./QAFilters";
import { QASEOTipBanner } from "./QASEOTipBanner";
import { QAList } from "./QAList";
import { QAEmptyState } from "./QAEmptyState";
import { QAPagination } from "./QAPagination";
import { useListingContext } from "@/context/ListingContext";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useGetQASummaryQuery } from "@/api/qaApi";
import {
  setFilters,
  setPagination,
  setSorting,
  dismissTipBanner,
  setError,
} from "@/store/slices/qaSlice";
export const QAManagementPage: React.FC = () => {
  const { selectedListing } = useListingContext();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { filters, pagination, sorting, showTipBanner } = useAppSelector(
    (state) => state.qa
  );

  // Prepare API request
  const qaRequest = useMemo(() => {
    if (!selectedListing?.id) return null;
    return {
      listingId: parseInt(selectedListing.id),
      pagination,
      filters,
      sorting,
    };
  }, [selectedListing?.id, pagination, filters, sorting]);

  // API query
  const {
    data: qaData,
    isLoading,
    error,
    refetch,
  } = useGetQASummaryQuery(qaRequest!, {
    skip: !qaRequest,
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      dispatch(setError("Failed to load Q&A data"));
      toast({
        title: "Error",
        description: "Failed to load Q&A data",
        variant: "destructive",
      });
    }
  }, [error, dispatch, toast]);
  const handleSearchChange = (searchTerm: string) => {
    dispatch(
      setFilters({
        search: searchTerm,
      })
    );
  };
  const handleStatusChange = (status: "all" | "answered" | "unanswered") => {
    dispatch(
      setFilters({
        status,
      })
    );
  };
  const handlePageChange = (page: number) => {
    dispatch(
      setPagination({
        page,
      })
    );
  };
  const handleLimitChange = (limit: number) => {
    dispatch(
      setPagination({
        limit,
        page: 1,
      })
    );
  };
  if (!selectedListing) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No Listing Selected
          </h2>
          <p className="text-gray-600">
            Please select a business listing to view Q&A.
          </p>
        </div>
      </div>
    );
  }
  const questions = qaData?.data?.questions || [];
  const paginationInfo = qaData?.data?.pagination;
  const summary = qaData?.data?.summary;
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <QAFilters
        searchTerm={filters.search}
        onSearchChange={handleSearchChange}
        statusFilter={filters.status}
        onStatusChange={handleStatusChange}
      />

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Loading Q&A data...</p>
        </div>
      ) : questions.length > 0 ? (
        <>
          <QAList questions={questions} />
          {paginationInfo && (
            <QAPagination
              currentPage={paginationInfo.page}
              totalPages={paginationInfo.totalPages}
              total={paginationInfo.total}
              limit={pagination.limit}
              hasNext={paginationInfo.hasNext}
              hasPrev={paginationInfo.hasPrev}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          )}
        </>
      ) : (
        <QAEmptyState hasQuestions={false} />
      )}
    </div>
  );
};
