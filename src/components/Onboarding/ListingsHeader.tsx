
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ListingsHeaderProps {
  listingsCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  allSelected: boolean;
  onSelectAll: () => void;
}

const ListingsHeader = ({
  listingsCount,
  searchTerm,
  onSearchChange,
  allSelected,
  onSelectAll,
}: ListingsHeaderProps) => {
  return (
    <div className="mb-6">
      {/* Single row with Found listings, Search, and Select All */}
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
          Found {listingsCount} business listing{listingsCount !== 1 ? 's' : ''}
        </h3>
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search listings by name, address, or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          onClick={onSelectAll}
          className="text-sm whitespace-nowrap"
        >
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
    </div>
  );
};

export default ListingsHeader;
