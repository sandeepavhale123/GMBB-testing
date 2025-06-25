
import React from 'react';
import { ListingManagementHeader } from './ListingManagementHeader';
import { ListingManagementContent } from './ListingManagementContent';
import { ListingErrorState } from './ListingErrorState';
import { useAccountListings } from '../../hooks/useAccountListings';

interface ListingManagementPageProps {
  accountId: string;
}

export const ListingManagementPage: React.FC<ListingManagementPageProps> = ({
  accountId
}) => {
  // Only fetch minimal data to check for errors
  const { error, refetch } = useAccountListings({
    accountId,
    page: 1,
    limit: 1,
  });

  if (error) {
    return (
      <ListingErrorState 
        error={error} 
        onRetry={refetch} 
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <ListingManagementHeader />
      <ListingManagementContent accountId={accountId} />
    </div>
  );
};
