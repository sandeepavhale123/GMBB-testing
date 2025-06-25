
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface GoogleAccountsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalActiveListings: number;
  onAddAccount: () => void;
}

export const GoogleAccountsSearchBar: React.FC<GoogleAccountsSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  totalActiveListings,
  onAddAccount
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search accounts by name or email"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 w-fit">
            Active Listings: {totalActiveListings}/100
          </Badge>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <Button onClick={onAddAccount} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Account</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
