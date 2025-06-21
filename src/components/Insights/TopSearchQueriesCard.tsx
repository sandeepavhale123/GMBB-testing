
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Search, TrendingUp, TrendingDown, Eye } from 'lucide-react';

interface TopSearchQueriesCardProps {
  isLoading: boolean;
  topKeywordQueries: any;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const TopSearchQueriesCard: React.FC<TopSearchQueriesCardProps> = ({
  isLoading,
  topKeywordQueries,
  selectedMonth,
  onMonthChange,
}) => {
  const queries = topKeywordQueries?.Monthdata || [];
  const availableMonths = topKeywordQueries?.avaialbleRecords || [];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">Top Search Queries</CardTitle>
          </div>
          
          {availableMonths.length > 0 && (
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Most popular search terms that led customers to your business
          {topKeywordQueries?.MonthName && ` in ${topKeywordQueries.MonthName}`}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No search query data available for the selected month</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queries.map((query, index) => (
              <div key={query.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{query.keyword}</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{query.impressions} impressions</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {query.yearmonth}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">#{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
