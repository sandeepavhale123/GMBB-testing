import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star, AlertCircle, RefreshCw, MessageSquare, Clock, Bot, User } from 'lucide-react';
import { Button } from '../ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
        className={`w-4 h-4 ${
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
    );
  }

  // Loading state
  if (summaryLoading || !summaryCards || !starDistribution || !sentimentAnalysis) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loading skeleton for 3 sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
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

  // Stats data for the first 4 cards
  const stats = [
    {
      title: 'Total Reviews',
      value: summaryCards.total_reviews.toString(),
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Replies',
      value: summaryCards.pending_replies.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'AI Replies',
      value: summaryCards.ai_replies.toString(),
      icon: Bot,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Manual Replies',
      value: summaryCards.manual_replies.toString(),
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* First Column - Stats Cards (4 cards in 2x2 grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-white border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-600 truncate">{stat.title}</p>
                  <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Second Column - Overall Rating Card */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">Overall Rating</p>
            <div className="p-2 rounded-lg bg-yellow-100 flex-shrink-0">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-3">
              {summaryCards.overall_rating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-3">
              {renderStars(summaryCards.overall_rating)}
            </div>
            <p className="text-sm text-gray-600">{summaryCards.total_reviews} reviews</p>
          </div>
        </CardContent>
      </Card>

      {/* Third Column - Sentiment Analysis Card */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">Sentiment Analysis</p>
            <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}% (${props.payload.count})`, 
                    name
                  ]} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
