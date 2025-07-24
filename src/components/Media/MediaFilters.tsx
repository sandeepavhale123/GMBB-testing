import React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, Filter } from "lucide-react";

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
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "COVER", label: "Cover" },
    { value: "PROFILE", label: "Profile" },
    { value: "LOGO", label: "Logo" },
    { value: "EXTERIOR", label: "Exterior" },
    { value: "INTERIOR", label: "Interior" },
    { value: "PRODUCT", label: "Product" },
    { value: "AT_WORK", label: "At Work" },
    { value: "FOOD_AND_DRINK", label: "Food and Drink" },
    { value: "MENU", label: "Menu" },
    { value: "COMMON_AREA", label: "Common Area" },
    { value: "ROOMS", label: "Rooms" },
    { value: "TEAMS", label: "Teams" },
    { value: "ADDITIONAL", label: "Additional" },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "Live", label: "Live" },
    { value: "Schedule", label: "Scheduled" },
    { value: "failed", label: "Failed" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search media files..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={category || "all"} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
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
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
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
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Order" />
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
