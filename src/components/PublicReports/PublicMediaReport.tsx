import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportLayout } from './PublicReportLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Play, Eye, Heart, Share2, TrendingUp } from 'lucide-react';

export const PublicMediaReport: React.FC = () => {
  const { token } = useParams();

  // Sample data
  const mediaData = {
    companyName: 'Demo Business',
    companyLogo: null,
    overview: {
      totalMedia: 89,
      totalViews: 45620,
      engagementRate: 8.4,
      topPerformingMedia: 12
    },
    mediaTypes: [
      { type: 'Photos', count: 67, views: 32450, engagement: 7.8 },
      { type: 'Videos', count: 15, views: 10890, engagement: 12.3 },
      { type: 'Virtual Tours', count: 4, views: 1890, engagement: 15.6 },
      { type: 'Logos', count: 3, views: 390, engagement: 4.2 }
    ],
    topPerforming: [
      {
        id: 1,
        type: 'photo',
        title: 'Signature Dish Presentation',
        views: 2340,
        likes: 187,
        shares: 23,
        engagement: 9.8
      },
      {
        id: 2,
        type: 'video',
        title: 'Kitchen Behind the Scenes',
        views: 1890,
        likes: 234,
        shares: 45,
        engagement: 14.7
      },
      {
        id: 3,
        type: 'photo',
        title: 'Restaurant Interior',
        views: 1650,
        likes: 123,
        shares: 18,
        engagement: 8.5
      }
    ],
    monthlyTrends: [
      { month: 'Jan', views: 3200, engagement: 7.2 },
      { month: 'Feb', views: 3800, engagement: 8.1 },
      { month: 'Mar', views: 4100, engagement: 8.8 },
      { month: 'Apr', views: 4600, engagement: 9.2 }
    ]
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Image className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      default: return <Image className="h-4 w-4" />;
    }
  };

  return (
    <PublicReportLayout
      title="Media Performance Report"
      companyName={mediaData.companyName}
      companyLogo={mediaData.companyLogo}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <Image className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{mediaData.overview.totalMedia}</div>
              <div className="text-sm text-muted-foreground">Total Media</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{mediaData.overview.totalViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{mediaData.overview.engagementRate}%</div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{mediaData.overview.topPerformingMedia}</div>
              <div className="text-sm text-muted-foreground">Top Performing</div>
            </CardContent>
          </Card>
        </div>

        {/* Media Types Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Media Types Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaData.mediaTypes.map((media, index) => (
                <div key={index} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{media.type}</h3>
                    <Badge variant="outline">{media.count} items</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Views</span>
                      <span className="font-medium">{media.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engagement</span>
                      <span className="font-medium text-green-600">{media.engagement}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Media */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mediaData.topPerforming.map((media, index) => (
                <div key={media.id} className="flex items-center gap-4 p-4 rounded-lg border">
                  <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                    {getMediaIcon(media.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{media.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {media.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Heart className="h-3 w-3" />
                        {media.likes}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Share2 className="h-3 w-3" />
                        {media.shares}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{media.engagement}%</div>
                    <div className="text-sm text-muted-foreground">engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaData.monthlyTrends.map((trend, index) => (
                <div key={index} className="text-center p-4 rounded-lg border">
                  <div className="text-sm font-medium mb-2">{trend.month}</div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-blue-600">{trend.views.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">views</div>
                    <div className="text-sm font-semibold text-green-600">{trend.engagement}%</div>
                    <div className="text-xs text-muted-foreground">engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Media Engagement Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive engagement chart would be displayed here</p>
                <p className="text-sm text-muted-foreground">Showing media performance and engagement over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};