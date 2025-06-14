
import React from 'react';
import { ReviewStats } from './ReviewStats';
import { ReviewSummary } from './ReviewSummary';
import { ReviewsList } from './ReviewsList';

export const ReviewsManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ReviewStats />
      <ReviewSummary />
      <ReviewsList />
    </div>
  );
};
