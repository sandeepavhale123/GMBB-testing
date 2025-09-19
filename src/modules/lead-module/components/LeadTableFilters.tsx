import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface LeadTableFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  emailFilter: string;
  onEmailFilterChange: (email: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  onClearFilters: () => void;
}

export const LeadTableFilters: React.FC<LeadTableFiltersProps> = ({
  searchQuery,
  onSearchChange,
  emailFilter,
  onEmailFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onClearFilters,
}) => {
  const categories = [
    "Restaurant",
    "Retail",
    "Healthcare",
    "Technology",
    "Services",
    "Real Estate",
    "Finance",
    "Other"
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by business name or email"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      {/* <div className="w-full sm:w-48">
        <Input
          placeholder="Filter by email..."
          value={emailFilter}
          onChange={(e) => onEmailFilterChange(e.target.value)}
        />
      </div> */}
      
      <div className="w-full sm:w-40">
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onClearFilters}
        className="w-full sm:w-auto"
      >
        <X className="mr-2 h-4 w-4" />
        Clear
      </Button>
    </div>
  );
};