import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DateRange } from 'react-day-picker';
export interface BulkReviewFiltersProps {
  searchQuery: string;
  filter: string;
  sentimentFilter: string;
  sortBy: string;
  localDateRange: DateRange | undefined;
  hasDateRange: boolean;
  isRefreshing: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSentimentFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onClearDateRange: () => void;
  onRefresh: () => void;
}
export const BulkReviewFilters: React.FC<BulkReviewFiltersProps> = ({
  searchQuery,
  filter,
  sentimentFilter,
  sortBy,
  localDateRange,
  hasDateRange,
  isRefreshing,
  onSearchChange,
  onFilterChange,
  onSentimentFilterChange,
  onSortChange,
  onDateRangeChange,
  onClearDateRange,
  onRefresh
}) => {
  return <div className="flex flex-wrap items-center gap-3 mt-4 mb-10">
      {/* Search Bar */}
      <div className="relative min-w-[200px] flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search by listing name or ZIP code" value={searchQuery} onChange={e => onSearchChange(e.target.value)} className="pl-10" />
      </div>

      {/* Status Filter */}
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

      {/* Sentiment Filter */}
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

      {/* Sort Filter */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Newest First" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="highest">Highest Rating</SelectItem>
          <SelectItem value="lowest">Lowest Rating</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Picker */}
      <DateRangePicker date={localDateRange} onDateChange={onDateRangeChange} placeholder="Select date range" className="w-[200px]" />

      {/* Clear Date Range Button */}
      {hasDateRange && <Button variant="outline" size="icon" onClick={onClearDateRange} className="h-10 w-10">
          <X className="w-4 h-4" />
        </Button>}

      {/* Refresh Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={onRefresh} disabled={isRefreshing} className="h-10 flex items-center gap-2 ">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh reviews</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>;
};