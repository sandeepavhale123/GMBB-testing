import React, { useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Star, MessageSquare, Clock, Bot, User, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '../ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchBulkReviewStats } from '../../store/slices/reviews/thunks';

export const BulkReviewSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const { summaryCards, starDistribution, sentimentAnalysis, summaryLoading, summaryError } = useAppSelector(
    (state) => state.reviews
  );

  useEffect(() => {
    dispatch(fetchBulkReviewStats());
  }, [dispatch]);

  // Handle error state
  if (summaryError) {
    return (
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Error loading summary data</span>
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => dispatch(fetchBulkReviewStats())}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle loading state
  if (summaryLoading || !summaryCards) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card border border-border">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <Skeleton className="h-12 w-12 rounded-lg mx-auto" />
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-card border border-border">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-2 flex-1" />
                  <Skeleton className="h-4 w-6" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Activity data for doughnut chart
  const activityData = [{
    name: 'AI Replies',
    value: summaryCards.ai_replies,
    color: '#10B981',
    percentage: Math.round(summaryCards.ai_replies / (summaryCards.ai_replies + summaryCards.manual_replies + summaryCards.pending_replies) * 100)
  }, {
    name: 'Manual Replies',
    value: summaryCards.manual_replies,
    color: '#8B5CF6',
    percentage: Math.round(summaryCards.manual_replies / (summaryCards.ai_replies + summaryCards.manual_replies + summaryCards.pending_replies) * 100)
  }, {
    name: 'Pending',
    value: summaryCards.pending_replies,
    color: '#F59E0B',
    percentage: Math.round(summaryCards.pending_replies / (summaryCards.ai_replies + summaryCards.manual_replies + summaryCards.pending_replies) * 100)
  }];
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, index) => <Star key={index} className={`w-4 h-4 ${index < Math.floor(rating) ? 'text-yellow-400 fill-current' : index < rating ? 'text-yellow-400 fill-current opacity-50' : 'text-gray-300'}`} />);
  };

  // Convert star distribution to array for rendering
  const starDistributionArray = Object.entries(starDistribution).map(([stars, data]) => ({
    stars: parseInt(stars),
    count: data.count,
    percentage: data.percentage
  })).sort((a, b) => b.stars - a.stars);

  // Stats data for the summary cards
  const stats = [{
    title: 'Total Reviews',
    value: summaryCards.total_reviews.toString(),
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  }, {
    title: 'Pending Replies',
    value: summaryCards.pending_replies.toString(),
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }, {
    title: 'AI Replies',
    value: summaryCards.ai_replies.toString(),
    icon: Bot,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }, {
    title: 'Manual Replies',
    value: summaryCards.manual_replies.toString(),
    icon: User,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }];
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* First Column - Stats Cards (4 cards in 2x2 grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(stat => {
        const Icon = stat.icon;
        return <Card key={stat.title} className="bg-card border border-border">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor} inline-flex mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      {/* Second Column - Overall Rating Card */}
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Overall Rating</p>
            <div className="p-2 rounded-lg bg-yellow-100 flex-shrink-0">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>

          {/* Overall Rating Display */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-foreground mb-3">
              {summaryCards.overall_rating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-3">
              {renderStars(summaryCards.overall_rating)}
            </div>
            <p className="text-sm text-muted-foreground">
              {summaryCards.total_reviews} reviews across all listings
            </p>
          </div>

          {/* Star Distribution with Progress Bars */}
          <div className="space-y-3">
            {starDistributionArray.map(item => <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{item.stars}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <Progress value={item.percentage} className="h-2" />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {item.count}
                </span>
              </div>)}
          </div>

          {/* Response Rate Display */}
          
        </CardContent>
      </Card>

      {/* Third Column - Activity Summary */}
      <Card className="bg-card border border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">
              Activity Summary
            </p>
            <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Doughnut Chart */}
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activityData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} paddingAngle={2} dataKey="value">
                    {activityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Response Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">AI Responses</span>
                </div>
                <span className="text-sm font-medium">{summaryCards.ai_replies} ({activityData[0].percentage}%)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm text-muted-foreground">Manual Responses</span>
                </div>
                <span className="text-sm font-medium">{summaryCards.manual_replies} ({activityData[1].percentage}%)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <span className="text-sm font-medium">{summaryCards.pending_replies} ({activityData[2].percentage}%)</span>
              </div>
            </div>

            {/* Progress Bar */}
            
          </div>
        </CardContent>
      </Card>
    </div>;
};