import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Calendar, ChevronDown, RefreshCw, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { format } from 'date-fns';

interface BulkReviewFiltersProps {
  searchQuery: string;
  filter: string;
  sentimentFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateRange: {
    startDate?: string;
    endDate?: string;
  };
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onSentimentFilterChange: (sentiment: string) => void;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onDateRangeChange: (startDate?: string, endDate?: string) => void;
  onRefresh: () => void;
  refreshLoading?: boolean;
}

export const BulkReviewFilters: React.FC<BulkReviewFiltersProps> = ({
  searchQuery,
  filter,
  sentimentFilter,
  sortBy,
  sortOrder,
  dateRange,
  onSearchChange,
  onFilterChange,
  onSentimentFilterChange,
  onSortChange,
  onDateRangeChange,
  onRefresh,
  refreshLoading
}) => {
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const getFilterLabel = () => {
    switch (filter) {
      case 'replied': return 'Replied';
      case 'pending': return 'Pending Reply';
      default: return 'All Reviews';
    }
  };

  const getSentimentLabel = () => {
    switch (sentimentFilter) {
      case 'positive': return 'Positive';
      case 'negative': return 'Negative';
      case 'neutral': return 'Neutral';
      default: return 'All Sentiment';
    }
  };

  const getSortLabel = () => {
    const sortLabels = {
      'date': sortOrder === 'desc' ? 'Newest First' : 'Oldest First',
      'rating': sortOrder === 'desc' ? 'Rating High to Low' : 'Rating Low to High',
    };
    return sortLabels[sortBy as keyof typeof sortLabels] || 'Newest First';
  };

  const hasDateRange = dateRange.startDate || dateRange.endDate;

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input 
          placeholder="Search reviews..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        {/* Review Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              {getFilterLabel()}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onFilterChange('')}>
              All Reviews
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('replied')}>
              Replied
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('pending')}>
              Pending Reply
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Sentiment Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              {getSentimentLabel()}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onSentimentFilterChange('')}>
              All Sentiment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSentimentFilterChange('positive')}>
              Positive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSentimentFilterChange('neutral')}>
              Neutral
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSentimentFilterChange('negative')}>
              Negative
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              {getSortLabel()}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onSortChange('date', 'desc')}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('date', 'asc')}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('rating', 'desc')}>
              Rating High to Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('rating', 'asc')}>
              Rating Low to High
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Date Range Picker */}
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Calendar className="w-4 h-4 mr-2" />
              {hasDateRange ? 'Date selected' : 'Select date range'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                if (date) {
                  onDateRangeChange(format(date, 'yyyy-MM-dd'));
                } else {
                  onDateRangeChange();
                }
                setDatePickerOpen(false);
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
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