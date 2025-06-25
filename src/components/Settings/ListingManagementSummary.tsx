
import React from 'react';

interface ListingManagementSummaryProps {
  listingsCount: number;
  totalListings: number;
}

export const ListingManagementSummary: React.FC<ListingManagementSummaryProps> = ({
  listingsCount,
  totalListings
}) => {
  return (
    <div className="mt-4 text-sm text-gray-600">
      Showing {listingsCount} of {totalListings} listings
    </div>
  );
};
