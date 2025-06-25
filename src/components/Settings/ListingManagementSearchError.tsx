
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ListingManagementSearchErrorProps {
  hasSearchTerm: boolean;
  searchTerm: string;
  hasFilters: boolean;
}

export const ListingManagementSearchError: React.FC<ListingManagementSearchErrorProps> = ({
  hasSearchTerm,
  searchTerm,
  hasFilters
}) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
      <div>
        <p className="text-yellow-800 text-sm">
          {hasSearchTerm 
            ? `No listings match "${searchTerm}". Try a different search term.`
            : hasFilters
            ? "No listings match your current filters. Try adjusting your filters."
            : "No listings found."
          }
        </p>
      </div>
    </div>
  );
};
