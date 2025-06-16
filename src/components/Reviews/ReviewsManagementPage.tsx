
import React from 'react';
import { ReviewSummary } from './ReviewSummary';
import { ReviewsList } from './ReviewsList';

export const ReviewsManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ReviewSummary />
      <ReviewsList />
    </div>
  );
};
