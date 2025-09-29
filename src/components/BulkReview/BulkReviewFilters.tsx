import React from "react";
import { Search, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRange } from "react-day-picker";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
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
  onRefresh,
}) => {
  const { t } = useI18nNamespace("BulkReview/bulkReviewFilters");
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4 mb-10">
      {/* Search Bar */}
      <div className="relative min-w-[200px] flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <Select value={filter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={t("statusFilter.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("statusFilter.all")}</SelectItem>
          <SelectItem value="pending">{t("statusFilter.pending")}</SelectItem>
          <SelectItem value="replied">{t("statusFilter.replied")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Sentiment Filter */}
      <Select value={sentimentFilter} onValueChange={onSentimentFilterChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={t("sentimentFilter.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("sentimentFilter.all")}</SelectItem>
          <SelectItem value="positive">
            {t("sentimentFilter.positive")}
          </SelectItem>
          <SelectItem value="neutral">
            {t("sentimentFilter.neutral")}
          </SelectItem>
          <SelectItem value="negative">
            {t("sentimentFilter.negative")}
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Sort Filter */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={t("sortFilter.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{t("sortFilter.newest")}</SelectItem>
          <SelectItem value="oldest">{t("sortFilter.oldest")}</SelectItem>
          <SelectItem value="highest">{t("sortFilter.highest")}</SelectItem>
          <SelectItem value="lowest">{t("sortFilter.lowest")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Picker */}
      <DateRangePicker
        date={localDateRange}
        onDateChange={onDateRangeChange}
        placeholder={t("dateRangePlaceholder")}
        className="w-[200px]"
      />

      {/* Clear Date Range Button */}
      {hasDateRange && (
        <Button
          variant="outline"
          size="icon"
          onClick={onClearDateRange}
          className="h-10 w-10"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      {/* Refresh Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="h-10 flex items-center gap-2 "
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {t("refresh.button")}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("refresh.tooltip")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
