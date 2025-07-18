import React, { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useListingContext } from '../../context/ListingContext';
import { NoListingSelected } from '../ui/no-listing-selected';
import {
  fetchQASummary,
  fetchQAItems,
} from '../../store/slices/qaThunks';
import {
  setFilters,
  setPagination,
  setSorting,
  dismissTipBanner,
  resetFilters,
} from '../../store/slices/qaSlice';
import { QASummaryCard } from './QASummaryCard';
import { QAFilters } from './QAFilters';
import { QASorting } from './QASorting';
import { QAList } from './QAList';
import { QAPagination } from './QAPagination';
import { QATipBanner } from './QATipBanner';
import { Loader2 } from 'lucide-react';

export const QAManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedListing, isInitialLoading } = useListingContext();
  const {
    filters,
    pagination,
    sorting,
    summary,
    isLoading,
    error,
    showTipBanner,
  } = useAppSelector((state) => state.qa);

  const fetchInitialData = useCallback(() => {
    if (selectedListing?.id) {
      const listingId = parseInt(selectedListing.id, 10);
      dispatch(fetchQASummary(listingId));
      dispatch(fetchQAItems({ listingId, filters, pagination, sorting }));
    }
  }, [dispatch, selectedListing, filters, pagination, sorting]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const handlePaginationChange = (newPagination: Partial<typeof pagination>) => {
    dispatch(setPagination(newPagination));
  };

  const handleSortingChange = (newSorting: Partial<typeof sorting>) => {
    dispatch(setSorting(newSorting));
  };

  const handleDismissTipBanner = () => {
    dispatch(dismissTipBanner());
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  // Show no listing state
  if (!selectedListing && !isInitialLoading) {
    return <NoListingSelected />;
  }

  return (
    <div className="space-y-6">
      {showTipBanner && (
        <QATipBanner onDismiss={handleDismissTipBanner} />
      )}

      <QASummaryCard summary={summary} isLoading={isLoading} error={error} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <QAFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
          />
        </div>
        <div className="lg:col-span-3">
          <QASorting
            sorting={sorting}
            onSortingChange={handleSortingChange}
          />
          <QAList isLoading={isLoading} error={error} />
          <QAPagination
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </div>
    </div>
  );
};
