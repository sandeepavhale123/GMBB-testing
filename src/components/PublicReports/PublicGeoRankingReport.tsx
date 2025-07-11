import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, TrendingUp, Target, Users, Clock } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';
export const PublicGeoRankingReport: React.FC = () => {
  const {
    token
  } = useParams();
  const [selectedKeyword, setSelectedKeyword] = useState('Webdesign');
  const [frequency, setFrequency] = useState('Weekly');

  // Sample data
  const geoData = {
    companyName: 'Demo Business',
    companyLogo: null,
    overview: {
      totalKeywords: 45,
      overallVisibility: 6.20,
      selectedKeyword: 'Webdesign',
      frequency: 'Weekly'
    },
    keywords: ['Webdesign', 'Digital Marketing', 'SEO Services', 'Local Business', 'Web Development'],
    gridData: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
  };
  const getRankingColor = (position: number) => {
    if (position <= 3) return 'bg-green-500';
    if (position <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  return <PublicReportDashboardLayout title="GEO Ranking Report" companyName={geoData.companyName} companyLogo={geoData.companyLogo}>
      <div className="space-y-6">
        {/* First Row - Control Panel */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Column 1: Keyword Selection */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Keyword</label>
                <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {geoData.keywords.map(keyword => <SelectItem key={keyword} value={keyword}>{keyword}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Column 2: Overall Visibility */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 font-medium mb-1">Overall Visibility</div>
                    <div className="text-2xl font-bold text-blue-900">{geoData.overview.overallVisibility}%</div>
                  </div>
                  <div className="w-12 h-12 flex-shrink-0">
                    <CircularProgress value={geoData.overview.overallVisibility} size={48} className="text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Column 3: Total Keywords */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">Total Keywords</div>
                <div className="text-2xl font-bold text-orange-900">{geoData.overview.totalKeywords}</div>
              </div>

              {/* Column 4: Keyword Frequency */}
              <div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium mb-1">Report Frequency</div>
                  <div className="text-lg font-bold text-purple-900">{frequency}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Second Row - GEO Ranking Report */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">GEO Ranking Report</h2>
              <p className="text-muted-foreground mb-1">February 01 2025 - February 28 2025</p>
              <p className="text-sm text-muted-foreground">Keyword: <span className="font-medium">{selectedKeyword}</span></p>
            </div>

            {/* 3x3 Grid Coordinate Display */}
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-3 gap-2 bg-muted/20 p-4 rounded-lg">
                {geoData.gridData.flat().map((position, index) => <div key={index} className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm ${getRankingColor(position)}`}>
                    #{position}
                  </div>)}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Geographic ranking positions for "{selectedKeyword}"
                </p>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Top 3</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>4-6</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>7+</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportDashboardLayout>;
};