
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface QAFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'answered' | 'unanswered';
  onStatusChange: (value: 'all' | 'answered' | 'unanswered') => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  isRefreshing?: boolean;
  onRefresh: () => void;
}

export const QAFilters: React.FC<QAFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  isRefreshing = false,
  onRefresh
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search questions or listings"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters and Refresh Button */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unanswered">Unanswered</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={onDateChange}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};
