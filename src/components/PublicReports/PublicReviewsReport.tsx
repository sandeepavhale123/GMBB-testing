import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, MessageSquare, Heart } from 'lucide-react';

export const PublicReviewsReport: React.FC = () => {
  const { token } = useParams();

  // Sample data
  const reviewData = {
    companyName: 'Demo Business',
    companyLogo: null,
    overview: {
      averageRating: 4.3,
      totalReviews: 247,
      responseRate: 78,
      newReviews: 12
    },
    sentimentBreakdown: [
      { stars: 5, count: 145, percentage: 59 },
      { stars: 4, count: 62, percentage: 25 },
      { stars: 3, count: 25, percentage: 10 },
      { stars: 2, count: 10, percentage: 4 },
      { stars: 1, count: 5, percentage: 2 }
    ],
    recentReviews: [
      {
        rating: 5,
        text: "Excellent service and food quality. Will definitely come back!",
        author: "Sarah M.",
        date: "2024-01-15",
        responded: true
      },
      {
        rating: 4,
        text: "Great atmosphere and friendly staff. Food was good.",
        author: "John D.",
        date: "2024-01-14",
        responded: false
      },
      {
        rating: 5,
        text: "Amazing experience! Best restaurant in the area.",
        author: "Emily R.",
        date: "2024-01-13",
        responded: true
      }
    ],
    trends: {
      thisMonth: 4.3,
      lastMonth: 4.1,
      change: 0.2
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <PublicReportDashboardLayout
      title="Reviews Report"
      companyName={reviewData.companyName}
      companyLogo={reviewData.companyLogo}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{reviewData.overview.averageRating}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{reviewData.overview.totalReviews}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{reviewData.overview.responseRate}%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">+{reviewData.overview.newReviews}</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">This Month</div>
                <div className="text-2xl font-bold">{reviewData.trends.thisMonth}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-semibold">+{reviewData.trends.change}</span>
                </div>
                <div className="text-sm text-muted-foreground">vs last month</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Month</div>
                <div className="text-2xl font-bold text-muted-foreground">{reviewData.trends.lastMonth}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewData.sentimentBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{item.stars}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1">
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground w-16 text-right">
                    {item.count} ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewData.recentReviews.map((review, index) => (
                <div key={index} className="p-4 border rounded-lg" style={{marginTop:"10px",marginBottom:"10px"}}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="font-medium">{review.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                      <Badge variant={review.responded ? 'default' : 'secondary'}>
                        {review.responded ? 'Responded' : 'No Response'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportDashboardLayout>
  );
};