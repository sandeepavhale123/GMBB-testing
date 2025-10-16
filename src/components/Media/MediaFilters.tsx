import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Search, Filter } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface MediaFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: string;
  onSortOrderChange: (sortOrder: string) => void;
}

export const MediaFilters: React.FC<MediaFiltersProps> = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const { t } = useI18nNamespace("Media/mediaFilters");
  const [showFilters, setShowFilters] = useState(false);
  const categories = [
    { value: "all", label: t("mediaFilters.category.all") },
    { value: "COVER", label: t("mediaFilters.category.cover") },
    { value: "PROFILE", label: t("mediaFilters.category.profile") },
    { value: "LOGO", label: t("mediaFilters.category.logo") },
    { value: "EXTERIOR", label: t("mediaFilters.category.exterior") },
    { value: "INTERIOR", label: t("mediaFilters.category.interior") },
    { value: "PRODUCT", label: t("mediaFilters.category.product") },
    { value: "AT_WORK", label: t("mediaFilters.category.atWork") },
    { value: "FOOD_AND_DRINK", label: t("mediaFilters.category.foodAndDrink") },
    { value: "MENU", label: t("mediaFilters.category.menu") },
    { value: "COMMON_AREA", label: t("mediaFilters.category.commonArea") },
    { value: "ROOMS", label: t("mediaFilters.category.rooms") },
    { value: "TEAMS", label: t("mediaFilters.category.teams") },
    { value: "ADDITIONAL", label: t("mediaFilters.category.additional") },
  ];

  const statuses = [
    { value: "all", label: t("mediaFilters.status.all") },
    { value: "Live", label: t("mediaFilters.status.live") },
    { value: "Schedule", label: t("mediaFilters.status.scheduled") },
    { value: "failed", label: t("mediaFilters.status.failed") },
  ];

  const sortOrderOptions = [
    { value: "desc", label: t("mediaFilters.sortOrder.desc") },
    { value: "asc", label: t("mediaFilters.sortOrder.asc") },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex gap-3 w-full sm:flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("mediaFilters.searchPlaceholder")}
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
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className={`flex gap-3 flex-wrap ${showFilters ? 'flex' : 'hidden'} sm:flex`}>
        <Select value={category || "all"} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t("mediaFilters.category.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status || "all"} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t("mediaFilters.status.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((stat) => (
              <SelectItem key={stat.value} value={stat.value}>
                {stat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue
              placeholder={t("mediaFilters.sortOrder.placeholder")}
            />
          </SelectTrigger>
          <SelectContent>
            {sortOrderOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
