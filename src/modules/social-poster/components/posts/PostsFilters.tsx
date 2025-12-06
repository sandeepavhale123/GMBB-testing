import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, List, LayoutGrid } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GetPostsRequest, PostStatus, PlatformType } from "../../types";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PostsFiltersProps {
  filters: GetPostsRequest;
  onFilterChange: (key: keyof GetPostsRequest, value: any) => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
}

export const PostsFilters: React.FC<PostsFiltersProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-post/PostsFilters",
  ]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange("search", e.target.value || undefined);
  };

  const handleStatusChange = (value: string) => {
    onFilterChange(
      "status",
      value === "all" ? undefined : (value as PostStatus)
    );
  };

  const handlePlatformChange = (value: string) => {
    onFilterChange(
      "platform",
      value === "all" ? undefined : (value as PlatformType)
    );
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      onFilterChange("dateFrom", range.from.toISOString());
    } else {
      onFilterChange("dateFrom", undefined);
    }
    if (range?.to) {
      onFilterChange("dateTo", range.to.toISOString());
    } else {
      onFilterChange("dateTo", undefined);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-wrap gap-3 flex-1 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 min-w-full sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search.placeholder")}
            className="pl-9"
            value={filters.search || ""}
            onChange={handleSearch}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t("status.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("status.all")}</SelectItem>
            <SelectItem value="draft">{t("status.draft")}</SelectItem>
            <SelectItem value="scheduled">{t("status.scheduled")}</SelectItem>
            <SelectItem value="publishing">{t("status.publishing")}</SelectItem>
            <SelectItem value="published">{t("status.published")}</SelectItem>
            <SelectItem value="failed">{t("status.failed")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Platform Filter */}
        <Select
          value={filters.platform || "all"}
          onValueChange={handlePlatformChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t("platform.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("platform.all")}</SelectItem>
            <SelectItem value="facebook">{t("platform.facebook")}</SelectItem>
            <SelectItem value="instagram">{t("platform.instagram")}</SelectItem>
            <SelectItem value="twitter">{t("platform.twitter")}</SelectItem>
            <SelectItem value="linkedin_individual">
              {t("platform.linkedin_individual")}
            </SelectItem>
            <SelectItem value="linkedin_organisation">
              {t("platform.linkedin_organisation")}
            </SelectItem>
            <SelectItem value="threads">{t("platform.threads")}</SelectItem>
            <SelectItem value="pinterest">{t("platform.pinterest")}</SelectItem>
            <SelectItem value="youtube">{t("platform.youtube")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range */}
        <DateRangePicker
          date={dateRange}
          onDateChange={handleDateRangeChange}
          placeholder={t("dateRange.placeholder")}
          className="w-full sm:w-[280px]"
        />
      </div>

      {/* View Mode Tabs */}
      <Tabs
        value={viewMode}
        onValueChange={(v) => onViewModeChange(v as any)}
        className="w-full md:w-auto"
      >
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            {t("view.list")}
          </TabsTrigger>
          <TabsTrigger value="grid" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            {t("view.grid")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
