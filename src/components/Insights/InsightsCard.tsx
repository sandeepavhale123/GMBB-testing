import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { DateRangePicker } from '../ui/date-range-picker';
import { Skeleton } from '../ui/skeleton';
import { MousePointer, Navigation, Phone, MessageSquare, Search, MapPin, Calendar, Eye, FileText, Image, TrendingUp, TrendingDown, RefreshCw, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchInsightsSummary, fetchVisibilityTrends, fetchCustomerActions, clearErrors } from '../../store/slices/insightsSlice';
import { useListingContext } from '../../context/ListingContext';

export const InsightsCard: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedListing } = useListingContext();
  
  const { 
    summary, 
    visibilityTrends,
    customerActions,
    isLoadingSummary, 
    isLoadingVisibility,
    isLoadingCustomerActions,
    summaryError, 
    visibilityError,
    customerActionsError,
    lastUpdated 
  } = useAppSelector(state => state.insights);

  // Fetch data when component mounts or parameters change
  useEffect(() => {
    if (selectedListing?.id) {
      fetchData();
    }
  }, [selectedListing?.id, dateRange, customDateRange]);

  const fetchData = async () => {
    if (!selectedListing?.id) return;

    const params = {
      listingId: parseInt(selectedListing.id, 10), // Convert string to number
      dateRange,
      startDate: customDateRange?.from ? format(customDateRange.from, 'yyyy-MM-dd') : '',
      endDate: customDateRange?.to ? format(customDateRange.to, 'yyyy-MM-dd') : '',
    };

    console.log('Fetching insights data with params:', params);
    
    try {
      await Promise.all([
        dispatch(fetchInsightsSummary(params)),
        dispatch(fetchVisibilityTrends(params)),
        dispatch(fetchCustomerActions(params))
      ]);
    } catch (error) {
      console.error('Error fetching insights data:', error);
    }
  };

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
    if (!selectedListing?.id) return;
    
    try {
      await fetchData();
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
    
    if (summary?.timeframe) {
      return `From: ${format(new Date(summary.timeframe.start_date), 'dd MMM yyyy')} - To: ${format(new Date(summary.timeframe.end_date), 'dd MMM yyyy')}`;
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
      case '180':
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case '270':
        startDate = new Date(today.getFullYear(), today.getMonth() - 9, today.getDate());
        break;
      case '365':
        startDate = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate());
        break;
      default: // 30 days
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return `From: ${format(startDate, 'dd MMM yyyy')} - To: ${format(today, 'dd MMM yyyy')}`;
  };

  // Update the customer actions data to use API data when available
  const customerActionsData = customerActions ? [
    { icon: Phone, label: 'Calls', value: customerActions.actions_breakdown.phone_calls.total, change: `Daily avg: ${customerActions.actions_breakdown.phone_calls.daily_average}`, trend: 'up', peakDay: customerActions.actions_breakdown.phone_calls.peak_day, peakValue: customerActions.actions_breakdown.phone_calls.peak_value },
    { icon: MousePointer, label: 'Website', value: customerActions.actions_breakdown.website_clicks.total, change: `Daily avg: ${customerActions.actions_breakdown.website_clicks.daily_average}`, trend: 'up', peakDay: customerActions.actions_breakdown.website_clicks.peak_day, peakValue: customerActions.actions_breakdown.website_clicks.peak_value },
    { icon: Navigation, label: 'Direction', value: customerActions.actions_breakdown.direction_requests.total, change: `Daily avg: ${customerActions.actions_breakdown.direction_requests.daily_average}`, trend: 'up', peakDay: customerActions.actions_breakdown.direction_requests.peak_day, peakValue: customerActions.actions_breakdown.direction_requests.peak_value },
    { icon: MessageSquare, label: 'Messages', value: customerActions.actions_breakdown.messages.total, change: `Daily avg: ${customerActions.actions_breakdown.messages.daily_average}`, trend: 'up', peakDay: customerActions.actions_breakdown.messages.peak_day, peakValue: customerActions.actions_breakdown.messages.peak_value },
  ] : summary ? [
    { icon: Phone, label: 'Calls', value: summary.customer_actions.phone_calls.value, change: `${summary.customer_actions.phone_calls.change_percentage > 0 ? '+' : ''}${summary.customer_actions.phone_calls.change_percentage}%`, trend: summary.customer_actions.phone_calls.trend },
    { icon: MousePointer, label: 'Website', value: summary.customer_actions.website_clicks.value, change: `${summary.customer_actions.website_clicks.change_percentage > 0 ? '+' : ''}${summary.customer_actions.website_clicks.change_percentage}%`, trend: summary.customer_actions.website_clicks.trend },
    { icon: Navigation, label: 'Direction', value: summary.customer_actions.direction_requests.value, change: `${summary.customer_actions.direction_requests.change_percentage > 0 ? '+' : ''}${summary.customer_actions.direction_requests.change_percentage}%`, trend: summary.customer_actions.direction_requests.trend },
    { icon: MessageSquare, label: 'Messages', value: summary.customer_actions.messages.value, change: `${summary.customer_actions.messages.change_percentage > 0 ? '+' : ''}${summary.customer_actions.messages.change_percentage}%`, trend: summary.customer_actions.messages.trend },
    { icon: Search, label: 'Desktop Search', value: summary.customer_actions.desktop_search.value, change: `${summary.customer_actions.desktop_search.change_percentage > 0 ? '+' : ''}${summary.customer_actions.desktop_search.change_percentage}%`, trend: summary.customer_actions.desktop_search.trend },
    { icon: MapPin, label: 'Desktop Map', value: summary.customer_actions.desktop_map.value, change: `${summary.customer_actions.desktop_map.change_percentage > 0 ? '+' : ''}${summary.customer_actions.desktop_map.change_percentage}%`, trend: summary.customer_actions.desktop_map.trend },
    { icon: Search, label: 'Mobile Search', value: summary.customer_actions.mobile_search.value, change: `${summary.customer_actions.mobile_search.change_percentage > 0 ? '+' : ''}${summary.customer_actions.mobile_search.change_percentage}%`, trend: summary.customer_actions.mobile_search.trend },
    { icon: MapPin, label: 'Mobile Map', value: summary.customer_actions.mobile_map.value, change: `${summary.customer_actions.mobile_map.change_percentage > 0 ? '+' : ''}${summary.customer_actions.mobile_map.change_percentage}%`, trend: summary.customer_actions.mobile_map.trend },
  ] : [];

  const customerActionsChartData = customerActions?.chart_data || (summary ? [
    { name: 'Website', value: summary.customer_actions.website_clicks.value },
    { name: 'Direction', value: summary.customer_actions.direction_requests.value },
    { name: 'Calls', value: summary.customer_actions.phone_calls.value },
    { name: 'Messages', value: summary.customer_actions.messages.value },
  ] : []);

  // Show error state
  if (summaryError || visibilityError || customerActionsError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                {summaryError || visibilityError || customerActionsError}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="180">Last 6 Months</SelectItem>
              <SelectItem value="270">Last 9 Months</SelectItem>
              <SelectItem value="365">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Period</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={handleRefresh}
            disabled={isLoadingSummary || isLoadingVisibility || isLoadingCustomerActions}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${(isLoadingSummary || isLoadingVisibility || isLoadingCustomerActions) ? 'animate-spin' : ''}`} />
            {(isLoadingSummary || isLoadingVisibility || isLoadingCustomerActions) ? 'Refreshing...' : 'Refresh'}
          </Button>
          
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
            {isLoadingSummary ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
                <Skeleton className="h-48" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Google Search Views</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {summary?.visibility_summary.google_search_views.current_period || 0}
                    </p>
                    <p className={`text-sm flex items-center gap-1 ${
                      summary?.visibility_summary.google_search_views.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {summary?.visibility_summary.google_search_views.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {summary?.visibility_summary.google_search_views.percentage_change > 0 ? '+' : ''}
                      {summary?.visibility_summary.google_search_views.percentage_change || 0}% from last period
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">Google Maps Views</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {summary?.visibility_summary.google_maps_views.current_period || 0}
                    </p>
                    <p className={`text-sm flex items-center gap-1 ${
                      summary?.visibility_summary.google_maps_views.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {summary?.visibility_summary.google_maps_views.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {summary?.visibility_summary.google_maps_views.percentage_change > 0 ? '+' : ''}
                      {summary?.visibility_summary.google_maps_views.percentage_change || 0}% from last period
                    </p>
                  </div>
                </div>
                
                <div className="h-48">
                  {isLoadingVisibility ? (
                    <Skeleton className="h-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={visibilityTrends?.chart_data || []}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="search" fill="#3b82f6" name="Search" />
                        <Bar dataKey="maps" fill="#ef4444" name="Maps" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="flex justify-center mt-4">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded"></div>
                      <span>Search Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded"></div>
                      <span>Maps Views</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Visibility Trends Summary */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Visibility Trends Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingVisibility ? (
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Total Search Views</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {visibilityTrends?.summary.total_search_views || 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Trend: {visibilityTrends?.summary.search_trend || 'stable'}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Total Maps Views</span>
                    <span className="text-2xl font-bold text-red-600">
                      {visibilityTrends?.summary.total_maps_views || 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Trend: {visibilityTrends?.summary.maps_trend || 'stable'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Total Views</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {summary?.visibility_summary.total_views || 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Combined search and maps visibility
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Customer Interactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSummary || isLoadingCustomerActions ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {customerActionsData.map((action, index) => (
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
            )}
          </CardContent>
        </Card>

        {/* Customer Actions Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Actions</CardTitle>
            <p className="text-sm text-gray-600">Actions taken by customers on your profile</p>
          </CardHeader>
          <CardContent>
            {isLoadingSummary || isLoadingCustomerActions ? (
              <Skeleton className="h-64" />
            ) : (
              <>
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
                    <span className="text-sm text-gray-600">Website: {customerActions?.actions_breakdown.website_clicks.total || summary?.customer_actions.website_clicks.value || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Messages: {customerActions?.actions_breakdown.messages.total || summary?.customer_actions.messages.value || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Directions: {customerActions?.actions_breakdown.direction_requests.total || summary?.customer_actions.direction_requests.value || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Calls: {customerActions?.actions_breakdown.phone_calls.total || summary?.customer_actions.phone_calls.value || 0}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
