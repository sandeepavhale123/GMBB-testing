import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { Search, TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchTopKeywordQuery } from '../../store/slices/insightsSlice';
import { useListingContext } from '../../context/ListingContext';

export const TopSearchQueriesWithAPI: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  
  const { 
    topKeywordQuery, 
    isLoadingTopKeywordQuery, 
    topKeywordQueryError 
  } = useAppSelector(state => state.insights);

  // Fetch data when component mounts or when month/listing changes
  useEffect(() => {
    if (selectedListing?.id && selectedMonth) {
      dispatch(fetchTopKeywordQuery({
        listingId: parseInt(selectedListing.id, 10),
        month: selectedMonth
      }));
    }
  }, [selectedListing?.id, selectedMonth, dispatch]);

  // Set default month when available records are loaded
  useEffect(() => {
    if (topKeywordQuery?.avaialbleRecords && topKeywordQuery.avaialbleRecords.length > 0 && !selectedMonth) {
      setSelectedMonth(topKeywordQuery.avaialbleRecords[topKeywordQuery.avaialbleRecords.length - 1]);
    }
  }, [topKeywordQuery?.avaialbleRecords, selectedMonth]);

  // Initial load to get available records
  useEffect(() => {
    if (selectedListing?.id && !topKeywordQuery && !selectedMonth) {
      // Load with a default month to get available records
      const currentDate = new Date();
      const defaultMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      dispatch(fetchTopKeywordQuery({
        listingId: parseInt(selectedListing.id, 10),
        month: defaultMonth
      }));
    }
  }, [selectedListing?.id, topKeywordQuery, selectedMonth, dispatch]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">Top Search Queries</CardTitle>
          </div>
          {topKeywordQuery?.avaialbleRecords && (
            <Select value={selectedMonth} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {topKeywordQuery.avaialbleRecords.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <p className="text-sm text-gray-600">Most popular search terms that led customers to your business</p>
      </CardHeader>
      <CardContent>
        {isLoadingTopKeywordQuery ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : topKeywordQueryError ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Failed to load search queries</p>
            <p className="text-sm text-gray-500">{topKeywordQueryError}</p>
          </div>
        ) : topKeywordQuery?.Monthdata && topKeywordQuery.Monthdata.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 pr-4">
              {topKeywordQuery.Monthdata.map((query, index) => (
                <div key={query.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{query.keyword}</span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{query.impressions}</span>
                      <span className="text-xs">Updated: {new Date(query.fetched_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{query.impressions}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No search query data available for {selectedMonth}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
