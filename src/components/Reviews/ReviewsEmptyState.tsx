
import React from 'react';
import { MessageSquare, Filter } from 'lucide-react';

interface ReviewsEmptyStateProps {
  hasFilters: boolean;
  totalReviewsCount: number;
}

export const ReviewsEmptyState: React.FC<ReviewsEmptyStateProps> = ({ 
  hasFilters, 
  totalReviewsCount 
}) => {
  const isFiltered = hasFilters && totalReviewsCount > 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            {isFiltered ? (
              <Filter className="h-8 w-8 text-gray-400" />
            ) : (
              <MessageSquare className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {isFiltered ? 'No reviews match your filters' : 'No reviews yet'}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {isFiltered 
              ? 'Try adjusting your search criteria or filters to see more results.'
              : 'Reviews will appear here once customers leave feedback on your business listings.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};
