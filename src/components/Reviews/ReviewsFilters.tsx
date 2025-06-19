
import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DateRangePicker } from '../ui/date-range-picker';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Search, X, RefreshCw } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface ReviewsFiltersProps {
  searchQuery: string;
  filter: string;
  sentimentFilter: string;
  sortBy: string;
  localDateRange: DateRange | undefined;
  hasDateRange: boolean;
  isRefreshing?: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSentimentFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onClearDateRange: () => void;
  onRefresh?: () => void;
}

export const ReviewsFilters: React.FC<ReviewsFiltersProps> = ({
  searchQuery,
  filter,
  sentimentFilter,
  sortBy,
  localDateRange,
  hasDateRange,
  isRefreshing = false,
  onSearchChange,
  onFilterChange,
  onSentimentFilterChange,
  onSortChange,
  onDateRangeChange,
  onClearDateRange,
  onRefresh
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input 
          placeholder="Search reviews..." 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10" 
        />
      </div>
      
      <Select value={filter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Reviews" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Reviews</SelectItem>
          <SelectItem value="pending">Pending Reply</SelectItem>
          <SelectItem value="replied">Replied</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sentimentFilter} onValueChange={onSentimentFilterChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="All Sentiment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sentiment</SelectItem>
          <SelectItem value="positive">Positive</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
          <SelectItem value="negative">Negative</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Newest First" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="rating-high">Highest Rating</SelectItem>
          <SelectItem value="rating-low">Lowest Rating</SelectItem>
        </SelectContent>
      </Select>

      <DateRangePicker
        date={localDateRange}
        onDateChange={onDateRangeChange}
        placeholder="Select date range"
        className="w-[200px]"
      />
      
      <div className="flex items-center gap-2">
        {hasDateRange && (
          <Button
            variant="outline"
            size="icon"
            onClick={onClearDateRange}
            aria-label="Clear date range"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        
        {onRefresh && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh reviews"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="ml-2">Refresh</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This button will refresh your review page to get the latest reviews from all platforms</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
