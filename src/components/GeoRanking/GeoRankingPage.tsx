
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, MapPin, TrendingUp, RefreshCw, Download, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';

const underPerformingAreas = [
  { area: 'MIDC', rank: 33, competition: 'High' },
  { area: 'Misarwadi', rank: 5, competition: 'Medium' },
  { area: 'Chilkalthana', rank: 1, competition: 'Low' },
];

export const GeoRankingPage: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState('Web Design');
  const [selectedDate, setSelectedDate] = useState('01/02/2023');
  const [gridSize, setGridSize] = useState('4*4');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Section - Map and Data */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Section */}
          <div className="">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                    <ChevronDown className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Design">Web Design</SelectItem>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    <SelectItem value="SEO Services">SEO Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Input 
                  type="date" 
                  value="2023-02-01" 
                  className="w-40"
                />
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded text-sm">
                  <span className="text-blue-600 font-medium">ARP:</span>
                  <span>Average Rank Position</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">1.5</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded text-sm">
                  <span className="text-blue-600 font-medium">ATRP:</span>
                  <span>Average Total Rank Position</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">1.5</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded text-sm">
                  <span className="text-blue-600 font-medium">SoLV:</span>
                  <span>Share of Local Voice</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">1.5</span>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Visibility</p>
                <p className="text-4xl font-bold text-gray-900">36%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Grid</p>
                <p className="text-4xl font-bold text-gray-900">4*4</p>
              </div>
              <div></div>
            </div>

            {/* Map Section */}
            <div className="bg-gray-100 rounded-lg p-4">
              <img 
                src="/lovable-uploads/7f4e9387-c7cb-43da-8b22-af41f3f77bac.png" 
                alt="GEO Grid Ranking Map" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Under-performing Areas Table */}
          <Card>
            <CardHeader>
              <CardTitle>Under-performing Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Area</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Competition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {underPerformingAreas.map((area, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 text-gray-900">{area.area}</td>
                        <td className="py-3 px-4 text-gray-900">{area.rank}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            area.competition === 'High' ? 'bg-red-100 text-red-700' :
                            area.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {area.competition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select keyword</label>
                <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web design">Web design</SelectItem>
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">Grid</label>
                <Select value={gridSize} onValueChange={setGridSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4*4">4*4</SelectItem>
                    <SelectItem value="5*5">5*5</SelectItem>
                    <SelectItem value="6*6">6*6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                Rescan
              </Button>
            </CardContent>
          </Card>

          {/* Ranking Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  {/* Donut Chart Placeholder */}
                  <div className="w-full h-full rounded-full border-8 border-gray-200 relative">
                    <div className="absolute inset-0 rounded-full border-8 border-t-green-500 border-r-yellow-500 border-b-orange-500 border-l-red-500"></div>
                  </div>
                </div>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">Position 01-03: 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-xs">Position 04-10: 12</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-xs">Position 10-15: 15</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">Position 15-20+: 140</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GMB Genie Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle>GMB Genie Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  GMB Genie will help you improve your local GEO rankings for this keyword by providing tailored suggestions based on real-time insights. click below button to generate
                </p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Generate
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
