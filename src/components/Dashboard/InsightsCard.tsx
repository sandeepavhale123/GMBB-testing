
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MousePointer, Navigation, Phone, MessageSquare, Search, MapPin, Calendar, Eye, FileText, Image, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';

export const InsightsCard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');

  const visibilityData = [
    { name: 'Week 1', search: 120, maps: 80 },
    { name: 'Week 2', search: 150, maps: 95 },
    { name: 'Week 3', search: 180, maps: 110 },
    { name: 'Week 4', search: 200, maps: 125 },
  ];

  const searchQueries = [
    { query: 'downtown coffee shop', type: 'Branded', views: 245, trend: 'up' },
    { query: 'coffee near me', type: 'Non-Branded', views: 189, trend: 'up' },
    { query: 'best coffee shop', type: 'Non-Branded', views: 156, trend: 'down' },
    { query: 'local cafe', type: 'Non-Branded', views: 134, trend: 'up' },
    { query: 'espresso bar', type: 'Non-Branded', views: 98, trend: 'down' },
  ];

  const customerActions = [
    { icon: Phone, label: 'Phone Calls', value: 42, change: '+12%', trend: 'up' },
    { icon: MousePointer, label: 'Website Clicks', value: 156, change: '+8%', trend: 'up' },
    { icon: Navigation, label: 'Direction Requests', value: 89, change: '-3%', trend: 'down' },
    { icon: Eye, label: 'Photo Views', value: 234, change: '+15%', trend: 'up' },
    { icon: Calendar, label: 'Appointment Bookings', value: 23, change: '+5%', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GMB Insights</h1>
          <p className="text-sm text-gray-600">Performance analytics for your Google Business Profile</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button variant="outline" className="w-full sm:w-auto">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button> */}
          <Button variant="outline" className="w-full sm:w-auto">
            View page
          </Button>
        </div>
      </div>

      {/* Row 1: Visibility Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Visibility Summary</CardTitle>
          <p className="text-sm text-gray-600">Total views from Google Search and Maps</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Google Search Views</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15% from last period
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Google Maps Views</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">823</p>
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +8% from last period
              </p>
            </div>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visibilityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="search" fill="#3b82f6" name="Search" />
                <Bar dataKey="maps" fill="#ef4444" name="Maps" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center mt-4">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Last 7 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span>30 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span>90 Days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Top Search Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Search Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {searchQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-gray-900">{query.query}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      query.type === 'Branded' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      🏷️ {query.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{query.views} views</span>
                    {query.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:10},{v:15},{v:12},{v:18},{v:query.trend === 'up' ? 22 : 14}]}>
                      <Line dataKey="v" stroke={query.trend === 'up' ? '#16a34a' : '#dc2626'} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 3: Customer Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Customer Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerActions.map((action, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <action.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">{action.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{action.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {action.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      action.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {action.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
