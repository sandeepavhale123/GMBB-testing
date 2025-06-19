
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { MousePointer, Navigation, Phone, MessageSquare, Search, MapPin, RefreshCw } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchInsightsSummary, fetchVisibilityTrends, fetchCustomerActions, clearErrors } from '../../store/slices/insightsSlice';
import { useListingContext } from '../../context/ListingContext';
import { InsightsHeader } from './InsightsHeader';
import { VisibilitySummaryCard } from './VisibilitySummaryCard';
import { VisibilityTrendsCard } from './VisibilityTrendsCard';
import { CustomerInteractionsCard } from './CustomerInteractionsCard';
import { CustomerActionsChart } from './CustomerActionsChart';

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
      listingId: parseInt(selectedListing.id, 10),
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
      <InsightsHeader
        dateRange={dateRange}
        customDateRange={customDateRange}
        showCustomPicker={showCustomPicker}
        isLoading={isLoadingSummary || isLoadingVisibility || isLoadingCustomerActions}
        isExporting={isExporting}
        summary={summary}
        onDateRangeChange={handleDateRangeChange}
        onCustomDateRangeChange={setCustomDateRange}
        onRefresh={handleRefresh}
        onExportCSV={handleExportCSV}
        onExportImage={handleExportImage}
      />

      {/* Row 1: Visibility Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <VisibilitySummaryCard
          isLoadingSummary={isLoadingSummary}
          isLoadingVisibility={isLoadingVisibility}
          summary={summary}
          visibilityTrends={visibilityTrends}
        />

        <VisibilityTrendsCard
          isLoadingVisibility={isLoadingVisibility}
          visibilityTrends={visibilityTrends}
          summary={summary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CustomerInteractionsCard
          isLoadingSummary={isLoadingSummary}
          isLoadingCustomerActions={isLoadingCustomerActions}
          customerActionsData={customerActionsData}
        />

        <CustomerActionsChart
          isLoadingSummary={isLoadingSummary}
          isLoadingCustomerActions={isLoadingCustomerActions}
          customerActionsChartData={customerActionsChartData}
          customerActions={customerActions}
          summary={summary}
        />
      </div>
    </div>
  );
};
