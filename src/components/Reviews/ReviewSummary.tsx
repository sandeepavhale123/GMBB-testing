
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ReviewStats } from './ReviewStats';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { useListingContext } from '../../context/ListingContext';
import { fetchReviewSummary, clearSummaryError } from '../../store/slices/reviewsSlice';

export const ReviewSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const { 
    summaryCards, 
    starDistribution, 
    sentimentAnalysis, 
    summaryLoading, 
    summaryError 
  } = useAppSelector(state => state.reviews);

  // Fetch review summary when component mounts or listing changes
  useEffect(() => {
    if (selectedListing?.id) {
      dispatch(fetchReviewSummary(selectedListing.id));
    }
  }, [dispatch, selectedListing?.id]);

  const handleRetry = () => {
    if (selectedListing?.id) {
      dispatch(clearSummaryError());
      dispatch(fetchReviewSummary(selectedListing.id));
    }
  };

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

  // Error state
  if (summaryError) {
    return (
      <div className="space-y-6">
        <ReviewStats />
        <Card className="bg-white border border-red-200">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Review Summary</h3>
            <p className="text-gray-600 mb-4">{summaryError}</p>
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (summaryLoading || !summaryCards || !starDistribution || !sentimentAnalysis) {
    return (
      <div className="space-y-6">
        <ReviewStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-white border border-gray-200">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Convert star distribution to array for rendering
  const starDistributionArray = Object.entries(starDistribution)
    .map(([stars, data]) => ({
      stars: parseInt(stars),
      count: data.count,
      percentage: data.percentage
    }))
    .sort((a, b) => b.stars - a.stars);

  // Convert sentiment analysis to chart data
  const sentimentData = [
    { 
      name: 'Positive', 
      value: sentimentAnalysis.positive.percentage, 
      color: '#10B981',
      count: sentimentAnalysis.positive.count
    },
    { 
      name: 'Neutral', 
      value: sentimentAnalysis.neutral.percentage, 
      color: '#F59E0B',
      count: sentimentAnalysis.neutral.count
    },
    { 
      name: 'Negative', 
      value: sentimentAnalysis.negative.percentage, 
      color: '#EF4444',
      count: sentimentAnalysis.negative.count
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <ReviewStats />

      {/* Rating and Sentiment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Star Distribution */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {summaryCards.overall_rating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(summaryCards.overall_rating)}
              </div>
              <p className="text-sm text-gray-600">{summaryCards.total_reviews} total reviews</p>
            </div>
            
            <div className="space-y-3">
              {starDistributionArray.map((item) => (
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
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.count} reviews)`, 
                      name
                    ]} 
                  />
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
                  <span className="text-sm text-gray-600">
                    {item.name} {item.value}% ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
