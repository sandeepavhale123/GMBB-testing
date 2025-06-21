
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useToast } from './use-toast';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchInsightsSummary, fetchVisibilityTrends, fetchCustomerActions, fetchTopKeywordQuery } from '../store/slices/insightsSlice';
import { useListingContext } from '../context/ListingContext';

export const useInsightsData = () => {
  const [dateRange, setDateRange] = useState('30');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedListing } = useListingContext();
  
  const { 
    summary, 
    visibilityTrends,
    customerActions,
    topKeywordQueries,
    isLoadingSummary, 
    isLoadingVisibility,
    isLoadingCustomerActions,
    isLoadingTopQueries,
    summaryError, 
    visibilityError,
    customerActionsError,
    topQueriesError,
    lastUpdated 
  } = useAppSelector(state => state.insights);

  // Fetch data when component mounts or parameters change
  useEffect(() => {
    if (selectedListing?.id && dateRange !== 'custom') {
      fetchData();
    } else if (selectedListing?.id && dateRange === 'custom' && customDateRange?.from && customDateRange?.to) {
      fetchData();
    }
  }, [selectedListing?.id, dateRange, customDateRange]);

  // Fetch top keyword queries when month changes
  useEffect(() => {
    if (selectedListing?.id && selectedMonth) {
      fetchTopKeywordData();
    }
  }, [selectedListing?.id, selectedMonth]);

  // Set default month when top keyword queries are loaded
  useEffect(() => {
    if (topKeywordQueries?.avaialbleRecords && topKeywordQueries.avaialbleRecords.length > 0 && !selectedMonth) {
      setSelectedMonth(topKeywordQueries.avaialbleRecords[0]);
    }
  }, [topKeywordQueries?.avaialbleRecords, selectedMonth]);

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

      // Fetch initial top keyword queries with default month
      if (!selectedMonth) {
        const currentDate = new Date();
        const defaultMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        await dispatch(fetchTopKeywordQuery({
          listingId: parseInt(selectedListing.id, 10),
          month: defaultMonth
        }));
      }
    } catch (error) {
      console.error('Error fetching insights data:', error);
    }
  };

  const fetchTopKeywordData = async () => {
    if (!selectedListing?.id || !selectedMonth) return;

    try {
      await dispatch(fetchTopKeywordQuery({
        listingId: parseInt(selectedListing.id, 10),
        month: selectedMonth
      }));
    } catch (error) {
      console.error('Error fetching top keyword data:', error);
    }
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (value !== 'custom') {
      setCustomDateRange(undefined);
    }
  };

  const handleCustomDateRangeChange = (dateRange: DateRange | undefined) => {
    setCustomDateRange(dateRange);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleRefresh = async () => {
    if (!selectedListing?.id) return;
    
    try {
      await fetchData();
      if (selectedMonth) {
        await fetchTopKeywordData();
      }
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

  return {
    dateRange,
    customDateRange,
    selectedMonth,
    summary,
    visibilityTrends,
    customerActions,
    topKeywordQueries,
    isLoadingSummary,
    isLoadingVisibility,
    isLoadingCustomerActions,
    isLoadingTopQueries,
    summaryError,
    visibilityError,
    customerActionsError,
    topQueriesError,
    lastUpdated,
    selectedListing,
    handleDateRangeChange,
    handleCustomDateRangeChange,
    handleMonthChange,
    handleRefresh
  };
};
