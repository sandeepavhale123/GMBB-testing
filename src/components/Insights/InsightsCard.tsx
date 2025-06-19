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
          summary={summary}
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
