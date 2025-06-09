
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Star, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const ReviewSummaryCard: React.FC = () => {
  const { reviewBreakdown, totalReviews } = useAppSelector((state) => state.dashboard);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Review Summary</CardTitle>
          <span className="text-sm font-medium text-muted-foreground">{totalReviews} reviews</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span className="text-3xl font-bold">N/A</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Average rating</p>
          <div className="flex items-center justify-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">Trending up</span>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviewBreakdown[rating as keyof typeof reviewBreakdown];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <Progress value={percentage} className="h-2" />
                </div>
                <span className="text-sm font-medium text-muted-foreground w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
