import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, MapPin, TrendingUp, RefreshCw, Download, ChevronDown, Search, Target, Users, Eye } from 'lucide-react';
import { Input } from '../ui/input';
import { CircularProgress } from '../ui/circular-progress';
import { Progress } from '../ui/progress';
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
  const [selectedKeyword, setSelectedKeyword] = useState('Web Design');
  const [selectedDate, setSelectedDate] = useState('01/02/2023');
  const [gridSize, setGridSize] = useState('4*4');
  return <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Section - Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h4 className="text-2xl font-bold text-gray-900">{selectedKeyword}</h4>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Monthly Volume: 8.2k
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Enhanced Metrics Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Overall Visibility</p>
                    <p className="text-3xl font-bold text-gray-900">36%</p>
                    <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
                  </div>
                  <div className="w-16 h-16">
                    <CircularProgress value={36} size={64} className="text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Position</p>
                    <p className="text-3xl font-bold text-gray-900">8.5</p>
                    <p className="text-xs text-green-600 mt-1">↑ 2.1 positions</p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
             </Card> */}

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Click Rate</p>
                    <p className="text-3xl font-bold text-gray-900">12.4%</p>
                    <p className="text-xs text-red-600 mt-1">-1.2% CTR</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex rounded border overflow-hidden shadow-sm">
                      <div className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold">ARP</div>
                      <div className="bg-white text-gray-800 px-3 py-1 text-sm font-semibold border-l">8.50</div>
                    </div>
                    
                    <div className="flex rounded border overflow-hidden shadow-sm">
                      <div className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold">ATRP</div>
                      <div className="bg-white text-gray-800 px-3 py-1 text-sm font-semibold border-l">6.20</div>
                    </div>
                    
                    <div className="flex rounded border overflow-hidden shadow-sm">
                      <div className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold">SoLV</div>
                      <div className="bg-white text-gray-800 px-3 py-1 text-sm font-semibold border-l">36.0%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">GEO Grid Ranking Map</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Grid Coverage:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm font-medium">16/16 areas</span>
                  </div>
                </div>
                
                {/* Map Legend */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Positions 1-3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Positions 4-10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Positions 11-15</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Positions 16+</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <img alt="GEO Grid Ranking Map" className="w-full h-auto rounded-lg shadow-sm" src="/lovable-uploads/1b136290-7743-4020-9468-ea83d1ff7054.png" />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Under-performing Areas Table */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Under-performing Areas</CardTitle>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Optimize All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Area</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Rank</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Clicks</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Competition</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {underPerformingAreas.map((area, index) => <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 text-sm font-medium">{area.area}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">#{area.rank}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm">{area.clicks}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${area.competition === 'High' ? 'bg-red-100 text-red-700' : area.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {area.competition}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            Optimize
                          </Button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Analysis Section */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorData.map((competitor, index) => <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                        <p className="text-sm text-gray-600">Average Rank: #{competitor.rank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Visibility</p>
                        <p className="font-semibold text-gray-900">{competitor.visibility}%</p>
                      </div>
                      <div className="w-20">
                        <Progress value={competitor.visibility} className="h-2" />
                      </div>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Enhanced Filters Card */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select keyword</label>
                <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                  <SelectTrigger>
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Date</label>
                <Input type="date" value="2023-02-01" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Grid Size</label>
                <Select value={gridSize} onValueChange={setGridSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4*4">4×4 Grid</SelectItem>
                    <SelectItem value="5*5">5×5 Grid</SelectItem>
                    <SelectItem value="6*6">6×6 Grid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              
              
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Rescan
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Ranking Distribution */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Ranking Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-3">
                    <CircularProgress value={75} size={96} className="text-blue-500">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">28</div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                    </CircularProgress>
                  </div>
                  <p className="text-sm text-gray-600 text-center">Keywords Tracked</p>
                </div>
                <div className="space-y-2">
                  {rankingData.map((item, index) => <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${item.color} rounded-sm`}></div>
                      <div className="text-xs text-gray-600 flex-1">{item.position}</div>
                      <div className="text-xs font-medium text-gray-900">{item.count}</div>
                    </div>)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Opportunities Card */}
          {/* <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">SEO Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Search className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Quick Win</span>
                  </div>
                  <p className="text-xs text-yellow-700">4 keywords can move to top 10 with minor optimization</p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Location Gap</span>
                  </div>
                  <p className="text-xs text-blue-700">Chinchwad area needs content optimization</p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Trending</span>
                  </div>
                  <p className="text-xs text-green-700">Local search volume increased 15% this month</p>
                </div>
              </div>
            </CardContent>
           </Card> */}

          {/* Enhanced GMB Genie Recommendation */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">GMB Genie AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <span className="text-sm font-medium text-blue-900">Smart Recommendations</span>
                </div>
                <p className="text-sm text-blue-800 leading-relaxed mb-3">
                  Based on your ranking data, I've identified 3 high-impact optimization opportunities that could improve your local visibility by 23%.
                </p>
                <div className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1">
                  ✓ Content gaps analysis <br /> ✓ Competitor insights <br /> ✓ Action plan
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Get AI Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};