
import React from 'react';

interface NoResultsMessageProps {
  searchTerm: string;
}

export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({
  searchTerm
}) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <p className="text-yellow-800 text-sm">
        No listings found for "{searchTerm}". Try adjusting your search terms or filters.
      </p>
    </div>
  );
};
