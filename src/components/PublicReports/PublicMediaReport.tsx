import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Image, Play, Eye, Heart, Share2, TrendingUp, Video, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const PublicMediaReport: React.FC = () => {
  const { token } = useParams();
  const [isComparison, setIsComparison] = useState(false);

  // Sample data for individual mode
  const individualData = {
    companyName: 'Demo Business',
    companyLogo: null,
    overview: {
      totalMedia: 89,
      totalPhotos: 67,
      totalVideos: 15,
      topPerforming: 12
    },
    chartData: [
      { date: 'Jan 1', uploads: 8},
      { date: 'Jan 8', uploads: 12},
      { date: 'Jan 15', uploads: 10 },
      { date: 'Jan 22', uploads: 15 },
      { date: 'Jan 29', uploads: 13},
      { date: 'Feb 5', uploads: 18},
      { date: 'Feb 12', uploads: 14 }
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
    ]
  };

  // Sample data for comparison mode
  const comparisonData = {
    ...individualData,
    current: {
      totalMedia: 89,
      totalPhotos: 67,
      totalVideos: 15,
      topPerforming: 12
    },
    previous: {
      totalMedia: 76,
      totalPhotos: 58,
      totalVideos: 12,
      topPerforming: 9
    },
    chartData: [
      { date: 'Jan 1', currentUploads: 8, previousUploads: 6 },
      { date: 'Jan 8', currentUploads: 12, previousUploads: 9 },
      { date: 'Jan 15', currentUploads: 10, previousUploads: 8},
      { date: 'Jan 22', currentUploads: 15, previousUploads: 11 },
      { date: 'Jan 29', currentUploads: 13, previousUploads: 10 },
      { date: 'Feb 5', currentUploads: 18, previousUploads: 12 },
      { date: 'Feb 12', currentUploads: 14, previousUploads: 11 }
    ]
  };

  const currentData = isComparison ? comparisonData : individualData;

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Image className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      default: return <Image className="h-4 w-4" />;
    }
  };

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: change,
      isPositive: change >= 0
    };
  };

  const renderChangeIndicator = (current: number, previous: number) => {
    const { value, isPositive } = calculateChange(current, previous);
    return (
      <div className={`flex items-center justify-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        <span>{Math.abs(value).toFixed(1)}% vs previous</span>
      </div>
    );
  };

  return (
    <PublicReportDashboardLayout
      title="Media Performance Report"
      companyName={currentData.companyName}
      companyLogo={currentData.companyLogo}
    >
      <div className="space-y-6">

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <Image className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison ? comparisonData.current.totalMedia : currentData.overview.totalMedia}
              </div>
              <div className="text-sm text-muted-foreground">Total Media</div>
              {isComparison && renderChangeIndicator(comparisonData.current.totalMedia, comparisonData.previous.totalMedia)}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <Image className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison ? comparisonData.current.totalPhotos : currentData.overview.totalPhotos}
              </div>
              <div className="text-sm text-muted-foreground">Total Photos</div>
              {isComparison && renderChangeIndicator(comparisonData.current.totalPhotos, comparisonData.previous.totalPhotos)}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison ? comparisonData.current.totalVideos : currentData.overview.totalVideos}
              </div>
              <div className="text-sm text-muted-foreground">Total Videos</div>
              {isComparison && renderChangeIndicator(comparisonData.current.totalVideos, comparisonData.previous.totalVideos)}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison ? comparisonData.current.topPerforming : currentData.overview.topPerforming}
              </div>
              <div className="text-sm text-muted-foreground">Top Performing</div>
              {isComparison && renderChangeIndicator(comparisonData.current.topPerforming, comparisonData.previous.topPerforming)}
            </CardContent>
          </Card>
        </div>

        {/* Media Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Media Post Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {isComparison ? (
                    <>
                      <Line
                        type="monotone"
                        dataKey="currentUploads"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Current Period Uploads"
                      />
                      <Line
                        type="monotone"
                        dataKey="previousUploads"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Previous Period Uploads"
                      />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="uploads"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name="Media Uploads"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
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
              {currentData.topPerforming.map((media, index) => (
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

        {/* Report Type Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Individual</span>
            <Switch
              checked={isComparison}
              onCheckedChange={setIsComparison}
            />
            <span className="text-sm font-medium">Comparison</span>
          </div>
        </div>
      </div>
    </PublicReportDashboardLayout>
  );
};