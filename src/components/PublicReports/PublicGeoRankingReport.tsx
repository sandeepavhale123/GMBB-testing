import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, Target, Users } from 'lucide-react';

export const PublicGeoRankingReport: React.FC = () => {
  const { token } = useParams();

  // Sample data
  const geoData = {
    companyName: 'Demo Business',
    companyLogo: null,
    overview: {
      totalKeywords: 45,
      averageRank: 3.2,
      topRankings: 12,
      improvingKeywords: 8
    },
    topKeywords: [
      { keyword: 'restaurant near me', position: 1, change: 0, volume: '12K' },
      { keyword: 'best pizza delivery', position: 2, change: 1, volume: '8.5K' },
      { keyword: 'italian restaurant', position: 3, change: -1, volume: '6.2K' },
      { keyword: 'family dining', position: 4, change: 2, volume: '4.8K' },
      { keyword: 'takeout food', position: 5, change: 0, volume: '3.9K' }
    ],
    locations: [
      { city: 'Downtown', avgRank: 2.1, keywords: 15 },
      { city: 'Midtown', avgRank: 3.8, keywords: 12 },
      { city: 'Suburbs', avgRank: 4.2, keywords: 18 }
    ]
  };

  const getRankBadge = (position: number) => {
    if (position <= 3) return 'default';
    if (position <= 10) return 'secondary';
    return 'outline';
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <span className="text-green-600">↗ +{change}</span>;
    if (change < 0) return <span className="text-red-600">↘ {change}</span>;
    return <span className="text-gray-500">-</span>;
  };

  return (
    <PublicReportDashboardLayout
      title="GEO Ranking Report"
      companyName={geoData.companyName}
      companyLogo={geoData.companyLogo}
    >
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{geoData.overview.totalKeywords}</div>
              <div className="text-sm text-muted-foreground">Total Keywords</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{geoData.overview.averageRank}</div>
              <div className="text-sm text-muted-foreground">Average Rank</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <MapPin className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{geoData.overview.topRankings}</div>
              <div className="text-sm text-muted-foreground">Top 3 Rankings</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{geoData.overview.improvingKeywords}</div>
              <div className="text-sm text-muted-foreground">Improving</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Keywords Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Keywords Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geoData.topKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium">{keyword.keyword}</div>
                    <div className="text-sm text-muted-foreground">
                      Search Volume: {keyword.volume}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <Badge variant={getRankBadge(keyword.position)} className="mb-1">
                        #{keyword.position}
                      </Badge>
                      <div className="text-xs text-muted-foreground">Position</div>
                    </div>
                    <div className="text-center min-w-[60px]">
                      {getChangeIndicator(keyword.change)}
                      <div className="text-xs text-muted-foreground">Change</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Location Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {geoData.locations.map((location, index) => (
                <div key={index} className="p-4 rounded-lg border text-center">
                  <h3 className="font-semibold text-lg mb-2">{location.city}</h3>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {location.avgRank}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Average Rank</div>
                  <Badge variant="outline">
                    {location.keywords} keywords
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive map would be displayed here</p>
                <p className="text-sm text-muted-foreground">Showing ranking performance by location</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportDashboardLayout>
  );
};