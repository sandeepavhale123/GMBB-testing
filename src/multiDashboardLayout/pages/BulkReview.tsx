import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BulkReviewSummary } from '@/components/BulkReview/BulkReviewSummary';
import { BulkReviewList } from '@/components/BulkReview/BulkReviewList';
export const BulkReview: React.FC = () => {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Review Management</h1>
          <p className="text-muted-foreground">Manage reviews across all your listings</p>
        </div>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          Bulk Response
        </Button>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <BulkReviewSummary />

        {/* Customer Reviews */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Customer Reviews</h3>
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              Bulk Response
            </Button>
          </div>

          <BulkReviewList />
        </div>
      </div>
    </div>;
};