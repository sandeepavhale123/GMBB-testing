import React from 'react';
import { MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BulkReviewSummary } from '@/components/BulkReview/BulkReviewSummary';

export const BulkReview: React.FC = () => {
  return (
    <div className="space-y-6">
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

        {/* Recent Reviews */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">John Doe</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="text-sm text-foreground mb-2">
                    Great service! The staff was friendly and the food was delicious. 
                    Highly recommend this place to anyone looking for a good meal.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Downtown Dental Care
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Reply</Button>
                      <Button variant="outline" size="sm">Mark as Read</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};