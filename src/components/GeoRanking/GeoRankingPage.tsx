
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, MapPin, TrendingUp, RefreshCw, Download, ChevronDown, Search, Target, Users, Eye, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { CircularProgress } from '../ui/circular-progress';
import { Progress } from '../ui/progress';
import { useNavigate } from 'react-router-dom';

const underPerformingAreas = [{
  area: 'Akurdi Road',
  rank: 15,
  competition: 'High',
  searchVolume: '2.1k',
  clicks: 45
}, {
  area: 'Pimpri Station',
  rank: 8,
  competition: 'Medium',
  searchVolume: '1.8k',
  clicks: 78
}, {
  area: 'Chinchwad',
  rank: 12,
  competition: 'High',
  searchVolume: '3.2k',
  clicks: 52
}, {
  area: 'Nigdi',
  rank: 6,
  competition: 'Low',
  searchVolume: '1.5k',
  clicks: 92
}];

const rankingData = [{
  position: 'Position 01-03',
  count: 2,
  color: 'bg-green-500'
}, {
  position: 'Position 04-10',
  count: 12,
  color: 'bg-yellow-500'
}, {
  position: 'Position 11-15',
  count: 8,
  color: 'bg-orange-500'
}, {
  position: 'Position 16-20+',
  count: 6,
  color: 'bg-red-500'
}];

const competitorData = [{
  name: 'Competitor A',
  rank: 3,
  visibility: 45
}, {
  name: 'Competitor B',
  rank: 7,
  visibility: 38
}, {
  name: 'Competitor C',
  rank: 12,
  visibility: 25
}];

export const GeoRankingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKeyword, setSelectedKeyword] = useState('Web Design');
  const [selectedDate, setSelectedDate] = useState('01/02/2023');
  const [gridSize, setGridSize] = useState('4*4');

  const handleCreateReport = () => {
    navigate('/geo-ranking-report');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">GEO Ranking Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Monitor and optimize your local search rankings across different locations</p>
        </div>
        <Button 
          onClick={handleCreateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Create Report
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Left Section - Main Content */}
        <div className="xl:col-span-3 space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedKeyword}</h4>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
                Monthly Volume: 8.2k
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Enhanced Metrics Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Card className="bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Overall Visibility</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">36%</p>
                    <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                    <CircularProgress value={36} size={48} className="text-blue-500 sm:w-16 sm:h-16" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Click Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">12.4%</p>
                    <p className="text-xs text-red-600 mt-1">-1.2% CTR</p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex rounded border overflow-hidden shadow-sm">
                      <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold">ARP</div>
                      <div className="bg-white text-gray-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold border-l">8.50</div>
                    </div>
                    
                    <div className="flex rounded border overflow-hidden shadow-sm">
                      <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold">ATRP</div>
                      <div className="bg-white text-gray-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold border-l">6.20</div>
                    </div>
                    
                    <div className="flex rounded border overflow-hidden shadow-sm">
                      <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold">SoLV</div>
                      <div className="bg-white text-gray-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold border-l">36.0%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="bg-white">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">GEO Grid Ranking Map</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-600">Grid Coverage:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-medium">16/16 areas</span>
                  </div>
                </div>
                
                {/* Map Legend */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="whitespace-nowrap">Positions 1-3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="whitespace-nowrap">Positions 4-10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="whitespace-nowrap">Positions 11-15</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="whitespace-nowrap">Positions 16+</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                <img 
                  alt="GEO Grid Ranking Map" 
                  className="w-full h-auto rounded-lg shadow-sm" 
                  src="/lovable-uploads/1b136290-7743-4020-9468-ea83d1ff7054.png" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Under-performing Areas Table */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Under-performing Areas</CardTitle>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Target className="w-4 h-4 mr-2" />
                  Optimize All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Area</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Rank</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Clicks</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Competition</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {underPerformingAreas.map((area, index) => 
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm font-medium">{area.area}</td>
                        <td className="py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">#{area.rank}</td>
                        <td className="py-3 px-2 sm:px-4 text-gray-900 text-xs sm:text-sm">{area.clicks}</td>
                        <td className="py-3 px-2 sm:px-4">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            area.competition === 'High' ? 'bg-red-100 text-red-700' : 
                            area.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {area.competition}
                          </span>
                        </td>
                        <td className="py-3 px-2 sm:px-4">
                          <Button variant="outline" size="sm" className="text-xs">
                            Optimize
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Analysis Section */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorData.map((competitor, index) => 
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-gray-200 rounded-lg gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{competitor.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Average Rank: #{competitor.rank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-600">Visibility</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{competitor.visibility}%</p>
                      </div>
                      <div className="w-16 sm:w-20">
                        <Progress value={competitor.visibility} className="h-2" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-6 xl:self-start">
          {/* Enhanced Filters Card */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Select keyword</label>
                <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Design">Web Design</SelectItem>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    <SelectItem value="SEO Services">SEO Services</SelectItem>
                    <SelectItem value="Local Business">Local Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Select Date</label>
                <Input type="date" defaultValue="2023-02-01" className="text-sm" />
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">Grid Size</label>
                <Select value={gridSize} onValueChange={setGridSize}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4*4">4×4 Grid</SelectItem>
                    <SelectItem value="5*5">5×5 Grid</SelectItem>
                    <SelectItem value="6*6">6×6 Grid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white text-sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Rescan
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Ranking Distribution */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">Ranking Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3">
                    <CircularProgress value={75} size={80} className="text-blue-500 sm:w-24 sm:h-24">
                      <div className="text-center">
                        <div className="text-base sm:text-lg font-bold text-gray-900">28</div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                    </CircularProgress>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 text-center">Keywords Tracked</p>
                </div>
                <div className="space-y-2">
                  {rankingData.map((item, index) => 
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${item.color} rounded-sm flex-shrink-0`}></div>
                      <div className="text-xs text-gray-600 flex-1 min-w-0">{item.position}</div>
                      <div className="text-xs font-medium text-gray-900 flex-shrink-0">{item.count}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced GMB Genie Recommendation */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">GMB Genie AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-blue-900">Smart Recommendations</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed mb-3">
                  Based on your ranking data, I've identified 3 high-impact optimization opportunities that could improve your local visibility by 23%.
                </p>
                <div className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1">
                  ✓ Content gaps analysis <br /> ✓ Competitor insights <br /> ✓ Action plan
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm">
                Get AI Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
