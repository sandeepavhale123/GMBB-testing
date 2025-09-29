import React, { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
export interface BulkAutoReplyFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}
export const BulkAutoReplyFilters: React.FC<BulkAutoReplyFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
}) => {
  const { t } = useI18nNamespace("BulkAutoReply/bulkAutoReplyFilters");
  const filterOptions = [
    { value: "all", label: t("filters.all") },
    { value: "ai", label: t("filters.ai") },
    { value: "template", label: t("filters.template") },
    { value: "dnr", label: t("filters.dnr") },
  ];

  const getSelectedLabel = () => {
    const option = filterOptions.find((opt) => opt.value === selectedFilter);
    return option ? option.label : "Filter";
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[300px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 flex-1"
        />
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            {getSelectedLabel()}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white border shadow-lg z-50"
        >
          {filterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className="cursor-pointer hover:bg-gray-100 px-4 py-2"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
