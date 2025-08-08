import React from 'react';
import { Search, RefreshCw, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface BulkReviewFiltersProps {
  searchQuery: string;
  filter: string;
  sentimentFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateRange: DateRange | undefined;
  refreshLoading: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSentimentFilterChange: (value: string) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onClearDateRange: () => void;
  onRefresh: () => void;
}

export const BulkReviewFilters: React.FC<BulkReviewFiltersProps> = ({
  searchQuery,
  filter,
  sentimentFilter,
  sortBy,
  sortOrder,
  dateRange,
  refreshLoading,
  onSearchChange,
  onFilterChange,
  onSentimentFilterChange,
  onSortChange,
  onDateRangeChange,
  onClearDateRange,
  onRefresh,
}) => {
  const formatDateRange = () => {
    if (!dateRange?.from) {
      return 'Select date range';
    }
    if (dateRange.to) {
      return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`;
    }
    return format(dateRange.from, 'MMM dd');
  };

  const getSortLabel = () => {
    const sortLabels = {
      date: 'Date',
      rating: 'Rating',
      customer_name: 'Customer Name'
    };
    const orderLabel = sortOrder === 'desc' ? 'Newest First' : 'Oldest First';
    if (sortBy === 'date') return orderLabel;
    return `${sortLabels[sortBy as keyof typeof sortLabels]} ${sortOrder === 'desc' ? '↓' : '↑'}`;
  };

  return (
    <div className="flex items-center gap-4 mb-6 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Review Status Filter */}
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="h-10 min-w-[120px]">
            <SelectValue placeholder="All Reviews" />
            <ChevronDown className="w-4 h-4 ml-2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="pending">Pending Reply</SelectItem>
            <SelectItem value="ai_replied">AI Replied</SelectItem>
            <SelectItem value="manual_replied">Manual Replied</SelectItem>
          </SelectContent>
        </Select>

        {/* Sentiment Filter */}
        <Select value={sentimentFilter} onValueChange={onSentimentFilterChange}>
          <SelectTrigger className="h-10 min-w-[120px]">
            <SelectValue placeholder="All Sentiment" />
            <ChevronDown className="w-4 h-4 ml-2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sentiment</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select
          value={`${sortBy}_${sortOrder}`}
          onValueChange={(value) => {
            const [newSortBy, newSortOrder] = value.split('_');
            onSortChange(newSortBy, newSortOrder as 'asc' | 'desc');
          }}
        >
          <SelectTrigger className="h-10 min-w-[130px]">
            <SelectValue>{getSortLabel()}</SelectValue>
            <ChevronDown className="w-4 h-4 ml-2" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Newest First</SelectItem>
            <SelectItem value="date_asc">Oldest First</SelectItem>
            <SelectItem value="rating_desc">Rating High to Low</SelectItem>
            <SelectItem value="rating_asc">Rating Low to High</SelectItem>
            <SelectItem value="customer_name_asc">Customer A-Z</SelectItem>
            <SelectItem value="customer_name_desc">Customer Z-A</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 min-w-[160px] justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              className="rounded-md border"
            />
            {dateRange?.from && (
              <div className="p-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearDateRange}
                  className="w-full"
                >
                  Clear Date Range
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={onRefresh}
          disabled={refreshLoading}
        >
          <RefreshCw className={`w-4 h-4 ${refreshLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};