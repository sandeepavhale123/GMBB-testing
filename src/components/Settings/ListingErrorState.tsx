
import React from 'react';

interface ListingErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ListingErrorState: React.FC<ListingErrorStateProps> = ({
  error,
  onRetry
}) => {
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
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
