
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, MapPin, TrendingUp, RefreshCw, Download, ChevronDown } from 'lucide-react';
import { Progress } from '../ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface RankingData {
  position: string;
  count: number;
  percentage: number;
  color: string;
}

const rankingData: RankingData[] = [
  { position: '1-3', count: 45, percentage: 25, color: 'bg-green-500' },
  { position: '4-10', count: 72, percentage: 40, color: 'bg-yellow-500' },
  { position: '11-15', count: 38, percentage: 21, color: 'bg-orange-500' },
  { position: '16-20+', count: 25, percentage: 14, color: 'bg-red-500' },
];

const underPerformingAreas = [
  { area: 'Yashwant Colony', rank: 8, competition: 'High' },
  { area: 'Shankar Nagar', rank: 6, competition: 'Medium' },
  { area: 'Sambhaji Nagar', rank: 7, competition: 'High' },
  { area: 'Niwara Nagri', rank: 5, competition: 'Low' },
];

export const GeoRankingPage: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('Digital Marketing Agency');
  const [selectedDate, setSelectedDate] = useState('Last 30 days');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GEO Ranking</h1>
          <p className="text-gray-600 text-sm">Track your local search rankings across different areas</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select keyword" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Digital Marketing Agency">Digital Marketing Agency</SelectItem>
              <SelectItem value="SEO Services">SEO Services</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                {selectedDate}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedDate('Last 7 days')}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDate('Last 30 days')}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDate('Last 90 days')}>
                Last 90 days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Visibility</p>
                <p className="text-3xl font-bold text-gray-900">36%</p>
                <p className="text-sm text-green-600">+2.4% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rank</p>
                <p className="text-3xl font-bold text-gray-900">4.2</p>
                <p className="text-sm text-green-600">Improved by 0.8</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Areas</p>
                <p className="text-3xl font-bold text-gray-900">180</p>
                <p className="text-sm text-gray-500">Areas monitored</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Layout - Map and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GEO Grid Map */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">GEO Grid Ranking</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rescan
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <img 
                src="/lovable-uploads/1a0d9abc-eeac-4519-8170-e7e62fd8a4c9.png" 
                alt="GEO Grid Ranking Map" 
                className="w-full h-auto rounded-lg border"
              />
            </div>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Rank 1-3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Rank 4-10</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Rank 11-15</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Rank 16+</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ranking Analytics */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Ranking Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rankingData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Position {data.position}</span>
                  <span className="text-sm text-gray-600">{data.count} areas</span>
                </div>
                <Progress value={data.percentage} className="h-2" />
                <div className="text-right text-xs text-gray-500">{data.percentage}%</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Under-performing Areas and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Under-performing Areas */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Under-performing Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {underPerformingAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{area.area}</p>
                    <p className="text-sm text-gray-500">Competition: {area.competition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">#{area.rank}</p>
                    <p className="text-xs text-gray-500">Avg. Rank</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GMB Genie Recommendations */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">GMB Genie Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Optimize Business Hours</h4>
              <p className="text-sm text-blue-700 mb-3">
                Update your business hours to match peak customer activity times in Yashwant Colony area.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Apply Suggestion
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Add More Photos</h4>
              <p className="text-sm text-green-700 mb-3">
                Upload 5-10 high-quality photos to improve visibility in Sambhaji Nagar area.
              </p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Upload Photos
              </Button>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">Improve Response Rate</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Respond to customer reviews within 24 hours to boost local rankings.
              </p>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                View Reviews
              </Button>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
