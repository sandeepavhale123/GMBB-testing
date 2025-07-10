import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Eye, Phone, MapPin, Clock } from 'lucide-react';

export const PublicInsightsReport: React.FC = () => {
  const { token } = useParams();

  // Sample data
  const insightsData = {
    companyName: 'Demo Business',
    companyLogo: null,
    overview: {
      totalViews: 15420,
      searchViews: 12850,
      customerActions: 2347,
      callsReceived: 156
    },
    customerActions: [
      { action: 'Website Visits', count: 1245, percentage: 53 },
      { action: 'Direction Requests', count: 687, percentage: 29 },
      { action: 'Phone Calls', count: 256, percentage: 11 },
      { action: 'Photo Views', count: 159, percentage: 7 }
    ],
    topSearchQueries: [
      { query: 'restaurant near me', impressions: 4250, clicks: 234 },
      { query: 'best pizza delivery', impressions: 3180, clicks: 189 },
      { query: 'italian food', impressions: 2940, clicks: 167 },
      { query: 'family restaurant', impressions: 2100, clicks: 134 },
      { query: 'takeout food', impressions: 1890, clicks: 98 }
    ],
    weeklyTrends: [
      { day: 'Mon', views: 1200, actions: 180 },
      { day: 'Tue', views: 1350, actions: 210 },
      { day: 'Wed', views: 1450, actions: 240 },
      { day: 'Thu', views: 1600, actions: 280 },
      { day: 'Fri', views: 2100, actions: 350 },
      { day: 'Sat', views: 2400, actions: 420 },
      { day: 'Sun', views: 1900, actions: 320 }
    ]
  };

  return (
    <PublicReportDashboardLayout
      title="Business Insights Report"
      companyName={insightsData.companyName}
      companyLogo={insightsData.companyLogo}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{insightsData.overview.totalViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{insightsData.overview.searchViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Search Views</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{insightsData.overview.customerActions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Customer Actions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <Phone className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{insightsData.overview.callsReceived}</div>
              <div className="text-sm text-muted-foreground">Calls Received</div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Actions Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Actions Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsData.customerActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">{action.percentage}%</span>
                    </div>
                    <span className="font-medium">{action.action}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{action.count.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">actions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Search Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Search Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insightsData.topSearchQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium">{query.query}</div>
                    <div className="text-sm text-muted-foreground">
                      {query.impressions.toLocaleString()} impressions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{query.clicks}</div>
                    <div className="text-sm text-muted-foreground">clicks</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {insightsData.weeklyTrends.map((trend, index) => (
                <div key={index} className="text-center p-3 rounded-lg border">
                  <div className="text-sm font-medium mb-2">{trend.day}</div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-blue-600">{trend.views}</div>
                    <div className="text-xs text-muted-foreground">views</div>
                    <div className="text-sm font-semibold text-green-600">{trend.actions}</div>
                    <div className="text-xs text-muted-foreground">actions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive activity chart would be displayed here</p>
                <p className="text-sm text-muted-foreground">Showing views and customer actions over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportDashboardLayout>
  );
};