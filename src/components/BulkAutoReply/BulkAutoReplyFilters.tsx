import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface BulkAutoReplyFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddListing: () => void;
}

export const BulkAutoReplyFilters: React.FC<BulkAutoReplyFiltersProps> = ({
  searchQuery,
  onSearchChange,
  onAddListing
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[300px] max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add Listing Button */}
      <Button variant="outline" onClick={onAddListing} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Listing
      </Button>
    </div>
  );
};