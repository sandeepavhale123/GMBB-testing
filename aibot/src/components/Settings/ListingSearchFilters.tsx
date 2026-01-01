import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ListingSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
  filterActive?: string;
  onActiveFilterChange?: (value: string) => void;
}

export const ListingSearchFilters: React.FC<ListingSearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  filterActive = "all",
  onActiveFilterChange,
}) => {
  const { t } = useI18nNamespace("Settings/listingSearchFilters");
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t("listingSearchFilters.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={filterStatus} onValueChange={onFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue
            placeholder={t("listingSearchFilters.filterStatusPlaceholder")}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("listingSearchFilters.filterStatus.all")}
          </SelectItem>
          <SelectItem value="verified">
            {t("listingSearchFilters.filterStatus.verified")}
          </SelectItem>
          <SelectItem value="unverified">
            {t("listingSearchFilters.filterStatus.unverified")}
          </SelectItem>
          <SelectItem value="active">
            {t("listingSearchFilters.filterStatus.active")}
          </SelectItem>
          <SelectItem value="inactive">
            {t("listingSearchFilters.filterStatus.inactive")}
          </SelectItem>
        </SelectContent>
      </Select>

      {onActiveFilterChange && (
        <Select value={filterActive} onValueChange={onActiveFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue
              placeholder={t("listingSearchFilters.filterActivePlaceholder")}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("listingSearchFilters.filterActive.all")}
            </SelectItem>
            <SelectItem value="active">
              {" "}
              {t("listingSearchFilters.filterActive.active")}
            </SelectItem>
            <SelectItem value="inactive">
              {" "}
              {t("listingSearchFilters.filterActive.inactive")}
            </SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
