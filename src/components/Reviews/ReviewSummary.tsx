
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ReviewStats } from './ReviewStats';

export const ReviewSummary: React.FC = () => {
  const overallRating = 4.6;
  const totalReviews = 282;

  const starDistribution = [
    { stars: 5, count: 186, percentage: 66 },
    { stars: 4, count: 56, percentage: 20 },
    { stars: 3, count: 28, percentage: 10 },
    { stars: 2, count: 8, percentage: 3 },
    { stars: 1, count: 4, percentage: 1 }
  ];

  const sentimentData = [
    { name: 'Positive', value: 78, color: '#10B981' },
    { name: 'Neutral', value: 16, color: '#F59E0B' },
    { name: 'Negative', value: 6, color: '#EF4444' }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : index < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <ReviewStats />

      {/* Rating and Sentiment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Star Distribution */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">{overallRating}</div>
              <div className="flex justify-center mb-2">
                {renderStars(overallRating)}
              </div>
              <p className="text-sm text-gray-600">{totalReviews} total reviews</p>
            </div>
            
            <div className="space-y-3">
              {starDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8 text-gray-600">{item.stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name} {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
