import React, { useMemo } from "react";
import { Grid2x2, List, Search, Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DateRangePicker } from "../ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PostsControlsProps {
  loading: boolean;
  totalPosts: number;
  hasActiveFilters: boolean;
  localSearchQuery: string;
  onSearchChange: (query: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onResetFilters: () => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const PostsControls: React.FC<PostsControlsProps> = ({
  loading,
  totalPosts,
  hasActiveFilters,
  localSearchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  dateRange,
  onDateRangeChange,
  onResetFilters,
  viewMode,
  onViewModeChange,
}) => {
  const { t } = useI18nNamespace("Post/postsControls");

  /* ------------------------------------
     Memoize translated filter labels
  ------------------------------------- */
  const filterOptions = useMemo(
    () => [
      { value: "all", label: t("postsControls.filter.all") },
      { value: "scheduled", label: t("postsControls.filter.scheduled") },
      { value: "live", label: t("postsControls.filter.live") },
      { value: "failed", label: t("postsControls.filter.failed") },
    ],
    [t]
  );

  return (
    <div className="bg-white rounded-lg border p-4 flex flex-wrap">
      <div className="flex flex-col flex-wrap sm:flex-row items-stretch sm:items-center justify-between gap-4 w-[-webkit-fill-available]">
        <div className="flex flex-col flex-wrap sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t("postsControls.searchPlaceholder")}
              value={localSearchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filter */}
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* <SelectItem value="all">
                {t("postsControls.filter.all")}
              </SelectItem>
              <SelectItem value="scheduled">
                {t("postsControls.filter.scheduled")}
              </SelectItem>
              <SelectItem value="live">
                {t("postsControls.filter.live")}
              </SelectItem>
              <SelectItem value="failed">
                {t("postsControls.filter.failed")}
              </SelectItem> */}
              {filterOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <div className="w-full sm:w-60">
            <DateRangePicker
              date={dateRange}
              onDateChange={onDateRangeChange}
              placeholder={t("postsControls.dateRange.placeholder")}
              className="w-full"
            />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="whitespace-nowrap"
            >
              <X className="w-4 h-4 mr-1" />
              {t("postsControls.resetFilters")}
            </Button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 self-center">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-8"
          >
            <Grid2x2 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-8"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
