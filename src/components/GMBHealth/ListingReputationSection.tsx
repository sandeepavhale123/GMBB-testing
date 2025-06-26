
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Star } from 'lucide-react';

export const ListingReputationSection: React.FC = () => {
  const reviewStats = {
    totalReviews: 8,
    repliesCount: 6,
    averageRating: 5.0,
  };

  const ratingBreakdown = [
    { stars: 5, count: 8, percentage: 100 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Listing Reputation</CardTitle>
        <Badge variant="secondary" className="bg-green-100 text-green-700">100%</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Review Stats */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Review Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Reviews</span>
                <span className="font-semibold">{reviewStats.totalReviews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Replies Count</span>
                <span className="font-semibold">{reviewStats.repliesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{reviewStats.averageRating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Rating Breakdown</h3>
            <div className="space-y-2">
              {ratingBreakdown.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating.stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={rating.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-gray-600 w-8">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
