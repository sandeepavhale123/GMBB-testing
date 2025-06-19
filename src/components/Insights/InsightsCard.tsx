import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DateRangePicker } from '../ui/date-range-picker';
import { MousePointer, Navigation, Phone, MessageSquare, Search, MapPin, Calendar, Eye, FileText, Image, TrendingUp, TrendingDown, RefreshCw, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';

export const InsightsCard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

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
  ];

  const customerActions = [
    { icon: Phone, label: 'Calls', value: 42, change: '+12%', trend: 'up' },
    { icon: MousePointer, label: 'Website', value: 156, change: '+8%', trend: 'up' },
    { icon: Navigation, label: 'Direction', value: 89, change: '-3%', trend: 'down' },
    { icon: Eye, label: 'Messages', value: 234, change: '+15%', trend: 'up' },
    { icon: Search, label: 'Desktop Search', value: 23, change: '+5%', trend: 'up' },
     { icon: MapPin, label: 'Desktop Map', value: 23, change: '+5%', trend: 'up' },
     { icon: Search, label: 'Mobile Search', value: 23, change: '+5%', trend: 'up' },
     { icon: MapPin, label: 'Mobile Map', value: 23, change: '+5%', trend: 'up' },
  ];

  const customerActionsChartData = [
    { name: 'Website', value: 156 },
    { name: 'Direction', value: 89 },
    { name: 'Calls', value: 42 },
    { name: 'Messages', value: 234 },
  ];

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (value === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      setCustomDateRange(undefined);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Data Refreshed",
        description: "Your insights have been updated with the latest data from Google Business Profile."
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Simulate CSV export
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "CSV Export Complete",
        description: "Your insights data has been downloaded as CSV."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      // Simulate image export
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Image Export Complete",
        description: "Your insights page has been downloaded as an image."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getDateRangeLabel = () => {
    if (showCustomPicker && customDateRange?.from) {
      const fromDate = format(customDateRange.from, 'dd MMM yyyy');
      const toDate = customDateRange.to ? format(customDateRange.to, 'dd MMM yyyy') : fromDate;
      return `From: ${fromDate} - To: ${toDate}`;
    }
    
    const today = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case '7':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '90':
        startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case '9months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 9, today.getDate());
        break;
      case '12months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate());
        break;
      default: // 30 days
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return `From: ${format(startDate, 'dd MMM yyyy')} - To: ${format(today, 'dd MMM yyyy')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">GMB Insights</h1>
          <p className="text-sm text-gray-600">Performance analytics for your Google Business Profile</p>
        </div>
        
        {/* Date Range Label */}
        <div className="flex-shrink-0">
          <p className="text-sm text-gray-600 font-medium">
            {getDateRangeLabel()}
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
          {/* Date Range Selector */}
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="9months">Last 9 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Period</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Refresh Button */}
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto" disabled={isExporting}>
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Export'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportCSV} disabled={isExporting}>
                <FileText className="w-4 h-4 mr-2" />
                Download CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportImage} disabled={isExporting}>
                <Image className="w-4 h-4 mr-2" />
                Download as Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {showCustomPicker && (
        <div className="flex justify-center">
          <DateRangePicker
            date={customDateRange}
            onDateChange={setCustomDateRange}
            placeholder="Select custom date range"
            className="w-full max-w-md"
          />
        </div>
      )}

      {/* Row 1: Visibility Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="h-full">
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
        <Card className="h-full">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Row 3: Customer Interactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

        {/* Customer Actions Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Actions</CardTitle>
            <p className="text-sm text-gray-600">Actions taken by customers on your profile</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerActionsChartData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    name="Actions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Website: 156</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Messages: 234</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600">Directions: 89</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Calls: 42</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
