import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, MapPin, TrendingUp, RefreshCw, Download, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { CircularProgress } from '../ui/circular-progress';
const underPerformingAreas = [{
  area: 'Akurdi Road',
  rank: 15,
  competition: 'High'
}, {
  area: 'Pimpri Station',
  rank: 8,
  competition: 'Medium'
}, {
  area: 'Chinchwad',
  rank: 12,
  competition: 'High'
}, {
  area: 'Nigdi',
  rank: 6,
  competition: 'Low'
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
              <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Design">Web Design</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="SEO Services">SEO Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              
            </div>
          </div>

          {/* Metrics Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Overall Visibility</p>
                    <p className="text-3xl font-bold text-gray-900">36%</p>
                  </div>
                  <div className="w-16 h-16">
                    <CircularProgress value={36} size={64} className="text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Grid Coverage</p>
                    <p className="text-3xl font-bold text-gray-900">4×4</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Position</p>
                    <p className="text-3xl font-bold text-gray-900">8.5</p>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GEO Grid Ranking Map</h3>
                <p className="text-sm text-gray-600">Visual representation of local search rankings across different areas</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <img alt="GEO Grid Ranking Map" className="w-full h-auto rounded-lg shadow-sm" src="/lovable-uploads/1b136290-7743-4020-9468-ea83d1ff7054.png" />
              </div>
            </CardContent>
          </Card>

          {/* Under-performing Areas Table */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Under-performing Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Area</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Rank</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Competition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {underPerformingAreas.map((area, index) => <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 text-sm">{area.area}</td>
                        <td className="py-3 px-4 text-gray-900 text-sm font-medium">#{area.rank}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${area.competition === 'High' ? 'bg-red-100 text-red-700' : area.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {area.competition}
                          </span>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Filters Card */}
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

          {/* Ranking Distribution */}
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

          {/* GMB Genie Recommendation */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">GMB Genie Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 leading-relaxed">
                  GMB Genie will help you improve your local GEO rankings for this keyword by providing tailored suggestions based on real-time insights. Click below to generate recommendations.
                </p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Generate Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};