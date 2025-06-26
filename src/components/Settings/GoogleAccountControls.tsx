
import React from "react";
import { Search, Plus, Grid3X3, List, RefreshCw } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface GoogleAccountControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalActiveListings: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onRefresh: () => void;
  onAddAccount: () => void;
  loading: boolean;
}

export const GoogleAccountControls: React.FC<GoogleAccountControlsProps> = ({
  searchTerm,
  onSearchChange,
  totalActiveListings,
  viewMode,
  onViewModeChange,
  onRefresh,
  onAddAccount,
  loading,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search accounts by name or email"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Active Listings Badge */}
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 w-fit"
          >
            Active Listings: {totalActiveListings}/100
          </Badge>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-between">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* View Switcher */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Add New Account Button */}
          <Button
            onClick={onAddAccount}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add New Account</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
