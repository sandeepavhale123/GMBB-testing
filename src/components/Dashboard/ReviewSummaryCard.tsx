
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star } from 'lucide-react';

export const ReviewSummaryCard: React.FC = () => {
  const overallRating = 4.6;
  const totalReviews = 282;

  const starDistribution = [
    { stars: 5, count: 186, percentage: 66 },
    { stars: 4, count: 56, percentage: 20 },
    { stars: 3, count: 28, percentage: 10 },
    { stars: 2, count: 8, percentage: 3 },
    { stars: 1, count: 4, percentage: 1 }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Review Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{overallRating}</div>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(4)}
            </div>
            <div className="text-sm text-gray-600 mt-1">{totalReviews} reviews</div>
          </div>
        </div>
        
        {/* Rating Breakdown with Stars */}
        <div className="space-y-2">
          {starDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{item.stars}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-600 h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
