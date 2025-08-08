import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Star, MessageSquare, Clock, Bot, User, TrendingUp } from 'lucide-react';
import { Progress } from '../ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
export const BulkReviewSummary: React.FC = () => {
  // Mock data - in real implementation, this would come from Redux/API
  const summaryData = {
    overall_rating: 4.2,
    total_reviews: 156,
    pending_replies: 12,
    ai_replies: 89,
    manual_replies: 43,
    response_rate: 85
  };

  // Mock star distribution data
  const starDistribution = {
    5: {
      count: 78,
      percentage: 50
    },
    4: {
      count: 47,
      percentage: 30
    },
    3: {
      count: 16,
      percentage: 10
    },
    2: {
      count: 8,
      percentage: 5
    },
    1: {
      count: 7,
      percentage: 5
    }
  };

  // Activity data for doughnut chart
  const activityData = [{
    name: 'AI Replies',
    value: summaryData.ai_replies,
    color: '#10B981',
    percentage: Math.round(summaryData.ai_replies / (summaryData.ai_replies + summaryData.manual_replies + summaryData.pending_replies) * 100)
  }, {
    name: 'Manual Replies',
    value: summaryData.manual_replies,
    color: '#8B5CF6',
    percentage: Math.round(summaryData.manual_replies / (summaryData.ai_replies + summaryData.manual_replies + summaryData.pending_replies) * 100)
  }, {
    name: 'Pending',
    value: summaryData.pending_replies,
    color: '#F59E0B',
    percentage: Math.round(summaryData.pending_replies / (summaryData.ai_replies + summaryData.manual_replies + summaryData.pending_replies) * 100)
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
    value: summaryData.total_reviews.toString(),
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  }, {
    title: 'Pending Replies',
    value: summaryData.pending_replies.toString(),
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }, {
    title: 'AI Replies',
    value: summaryData.ai_replies.toString(),
    icon: Bot,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }, {
    title: 'Manual Replies',
    value: summaryData.manual_replies.toString(),
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
              {summaryData.overall_rating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-3">
              {renderStars(summaryData.overall_rating)}
            </div>
            <p className="text-sm text-muted-foreground">
              {summaryData.total_reviews} reviews across all listings
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
                <span className="text-sm font-medium">{summaryData.ai_replies} ({activityData[0].percentage}%)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm text-muted-foreground">Manual Responses</span>
                </div>
                <span className="text-sm font-medium">{summaryData.manual_replies} ({activityData[1].percentage}%)</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <span className="text-sm font-medium">{summaryData.pending_replies} ({activityData[2].percentage}%)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round((summaryData.total_reviews - summaryData.pending_replies) / summaryData.total_reviews * 100)}% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{
                width: `${(summaryData.total_reviews - summaryData.pending_replies) / summaryData.total_reviews * 100}%`
              }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};