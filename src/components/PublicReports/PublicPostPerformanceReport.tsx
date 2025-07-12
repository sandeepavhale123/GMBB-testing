import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, CheckCircle, XCircle, TrendingUp, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const PublicPostPerformanceReport: React.FC = () => {
  const { token } = useParams();
  const [isComparison, setIsComparison] = useState(false);

  // Sample data for individual mode
  const individualData = {
    companyName: 'Demo Business',
    companyLogo: null,
    overview: {
      totalPosts: 156,
      totalScheduled: 23,
      publishedPosts: 142,
      failedPosts: 8
    },
    chartData: [
      { date: 'Jan 1', posts: 12},
      { date: 'Jan 8', posts: 18},
      { date: 'Jan 15', posts: 15 },
      { date: 'Jan 22', posts: 22 },
      { date: 'Jan 29', posts: 19},
      { date: 'Feb 5', posts: 25},
      { date: 'Feb 12', posts: 21 }
    ],
    recentPosts: [
      {
        id: 1,
        type: 'standard',
        title: 'New Menu Launch Announcement',
        status: 'published',
        publishedAt: '2 hours ago',
        engagement: 94
      },
      {
        id: 2,
        type: 'event',
        title: 'Weekend Special Event',
        status: 'scheduled',
        publishedAt: 'Tomorrow 9:00 AM',
        engagement: 0
      },
      {
        id: 3,
        type: 'offer',
        title: 'Happy Hour 50% Off',
        status: 'published',
        publishedAt: '1 day ago',
        engagement: 127
      }
    ]
  };

  // Sample data for comparison mode
  const comparisonData = {
    ...individualData,
    current: {
      totalPosts: 156,
      totalScheduled: 23,
      publishedPosts: 142,
      failedPosts: 8
    },
    previous: {
      totalPosts: 134,
      totalScheduled: 18,
      publishedPosts: 125,
      failedPosts: 5
    },
    chartData: [
      { date: 'Jan 1', currentPosts: 12, previousPosts: 8 },
      { date: 'Jan 8', currentPosts: 18, previousPosts: 14 },
      { date: 'Jan 15', currentPosts: 15, previousPosts: 12},
      { date: 'Jan 22', currentPosts: 22, previousPosts: 18 },
      { date: 'Jan 29', currentPosts: 19, previousPosts: 15 },
      { date: 'Feb 5', currentPosts: 25, previousPosts: 20 },
      { date: 'Feb 12', currentPosts: 21, previousPosts: 17 }
    ]
  };

  const currentData = isComparison ? comparisonData : individualData;

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'offer': return <TrendingUp className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published': return <Badge variant="default" className="bg-green-100 text-green-800">Published</Badge>;
      case 'scheduled': return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
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
      title="Post Performance Report"
      companyName={currentData.companyName}
      companyLogo={currentData.companyLogo}
    >
      <div className="space-y-6">

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison ? comparisonData.current.totalPosts : currentData.overview.totalPosts}
              </div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
              {isComparison && renderChangeIndicator(comparisonData.current.totalPosts, comparisonData.previous.totalPosts)}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison ? comparisonData.current.totalScheduled : currentData.overview.totalScheduled}
              </div>
              <div className="text-sm text-muted-foreground">Total Scheduled</div>
              {isComparison && renderChangeIndicator(comparisonData.current.totalScheduled, comparisonData.previous.totalScheduled)}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison ? comparisonData.current.publishedPosts : currentData.overview.publishedPosts}
              </div>
              <div className="text-sm text-muted-foreground">Published Posts</div>
              {isComparison && renderChangeIndicator(comparisonData.current.publishedPosts, comparisonData.previous.publishedPosts)}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-lg mx-auto mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold">
                {isComparison ? comparisonData.current.failedPosts : currentData.overview.failedPosts}
              </div>
              <div className="text-sm text-muted-foreground">Failed Posts</div>
              {isComparison && renderChangeIndicator(comparisonData.current.failedPosts, comparisonData.previous.failedPosts)}
            </CardContent>
          </Card>
        </div>

        {/* Post Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Post Performance Over Time</CardTitle>
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
                        dataKey="currentPosts"
                        stroke="#2563eb"
                        strokeWidth={2}
                        name="Current Period Posts"
                      />
                      <Line
                        type="monotone"
                        dataKey="previousPosts"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Previous Period Posts"
                      />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="posts"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name="Posts Published"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.recentPosts.slice(0, 10).map((post, index) => (
                <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg border">
                  <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                    {getPostIcon(post.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{post.title}</h4>
                    <div className="text-sm text-muted-foreground mt-1">
                      {post.publishedAt} • {post.type} post
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(post.status)}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
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