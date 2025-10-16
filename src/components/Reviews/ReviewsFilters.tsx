import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DateRangePicker } from "../ui/date-range-picker";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Search, X, RefreshCw, Filter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

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
  onRefresh,
}) => {
  const { t } = useI18nNamespace("Reviews/reviewsFilters");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 sm:min-w-[200px]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("reviewsFilters.search.placeholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden"
          aria-label="Toggle filters"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Select value={filter} onValueChange={onFilterChange}>
        <SelectTrigger className={`${showFilters ? 'flex' : 'hidden'} sm:flex w-full sm:w-[140px]`}>
          <SelectValue placeholder={t("reviewsFilters.filter.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("reviewsFilters.filter.all")}</SelectItem>
          <SelectItem value="pending">
            {t("reviewsFilters.filter.pending")}
          </SelectItem>
          <SelectItem value="replied">
            {t("reviewsFilters.filter.replied")}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={sentimentFilter} onValueChange={onSentimentFilterChange}>
        <SelectTrigger className={`${showFilters ? 'flex' : 'hidden'} sm:flex w-full sm:w-[130px]`}>
          <SelectValue
            placeholder={t("reviewsFilters.sentiment.placeholder")}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("reviewsFilters.sentiment.all")}
          </SelectItem>
          <SelectItem value="positive">
            {t("reviewsFilters.sentiment.positive")}
          </SelectItem>
          <SelectItem value="neutral">
            {t("reviewsFilters.sentiment.neutral")}
          </SelectItem>
          <SelectItem value="negative">
            {t("reviewsFilters.sentiment.negative")}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className={`${showFilters ? 'flex' : 'hidden'} sm:flex w-full sm:w-[130px]`}>
          <SelectValue placeholder={t("reviewsFilters.sort.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">
            {t("reviewsFilters.sort.newest")}
          </SelectItem>
          <SelectItem value="oldest">
            {t("reviewsFilters.sort.oldest")}
          </SelectItem>
          <SelectItem value="rating-low">
            {t("reviewsFilters.sort.ratingLow")}
          </SelectItem>
          <SelectItem value="rating-high">
            {t("reviewsFilters.sort.ratingHigh")}
          </SelectItem>
        </SelectContent>
      </Select>

      <DateRangePicker
        date={localDateRange}
        onDateChange={onDateRangeChange}
        placeholder={t("reviewsFilters.dateRange.placeholder")}
        className={`${showFilters ? 'flex' : 'hidden'} sm:flex w-full sm:w-[200px] max-w-[200]`}
      />

      <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex items-center gap-2 w-full sm:w-auto`}>
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
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="ml-2">
                    {t("reviewsFilters.refresh.button")}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("reviewsFilters.refresh.tooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
