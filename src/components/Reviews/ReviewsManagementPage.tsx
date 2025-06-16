
import React from 'react';
import { ReviewSummary } from './ReviewSummary';
import { ReviewsList } from './ReviewsList';

export const ReviewsManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Title and Subtext */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reviews Management</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Monitor, respond to, and manage customer reviews across all your business locations to maintain your online reputation.
        </p>
      </div>
      
      <ReviewSummary />
      <ReviewsList />
    </div>
  );
};
