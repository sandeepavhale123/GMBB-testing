import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, List, LayoutGrid } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GetPostsRequest, PostStatus, PlatformType } from "../../types";

interface PostsFiltersProps {
  filters: GetPostsRequest;
  onFilterChange: (key: keyof GetPostsRequest, value: any) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export const PostsFilters: React.FC<PostsFiltersProps> = ({ filters, onFilterChange, viewMode, onViewModeChange }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange('search', e.target.value || undefined);
  };

  const handleStatusChange = (value: string) => {
    onFilterChange('status', value === 'all' ? undefined : value as PostStatus);
  };

  const handlePlatformChange = (value: string) => {
    onFilterChange('platform', value === 'all' ? undefined : value as PlatformType);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      onFilterChange('dateFrom', range.from.toISOString());
    } else {
      onFilterChange('dateFrom', undefined);
    }
    if (range?.to) {
      onFilterChange('dateTo', range.to.toISOString());
    } else {
      onFilterChange('dateTo', undefined);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-wrap gap-3 flex-1 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 min-w-full sm:min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          className="pl-9"
          value={filters.search || ''}
          onChange={handleSearch}
        />
      </div>

      {/* Status Filter */}
      <Select 
        value={filters.status || 'all'} 
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="publishing">Publishing</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      {/* Platform Filter */}
      <Select 
        value={filters.platform || 'all'} 
        onValueChange={handlePlatformChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="twitter">Twitter</SelectItem>
          <SelectItem value="linkedin_individual">LinkedIn (Individual)</SelectItem>
          <SelectItem value="linkedin_organisation">LinkedIn (Organisation)</SelectItem>
          <SelectItem value="threads">Threads</SelectItem>
          <SelectItem value="pinterest">Pinterest</SelectItem>
          <SelectItem value="youtube">YouTube</SelectItem>
        </SelectContent>
      </Select>

        {/* Date Range */}
        <DateRangePicker
          date={dateRange}
          onDateChange={handleDateRangeChange}
          placeholder="Select date range"
          className="w-full sm:w-[280px]"
        />
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => onViewModeChange(v as any)} className="w-full md:w-auto">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="grid" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Grid
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
