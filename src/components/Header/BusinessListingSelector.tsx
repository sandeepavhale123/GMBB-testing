import React, { useState } from 'react';
import { ChevronDown, MapPin, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';
import { BusinessListing } from './types';
import { useBusinessListings } from '@/hooks/useBusinessListings';
import { useBusinessSearch } from '@/hooks/useBusinessSearch';
import { useAuthRedux } from '@/store/slices/auth/useAuthRedux';

interface BusinessListingSelectorProps {
  selectedBusiness: BusinessListing | null;
  onBusinessSelect: (business: BusinessListing) => void;
}

export const BusinessListingSelector: React.FC<BusinessListingSelectorProps> = ({
  selectedBusiness,
  onBusinessSelect
}) => {
  const [open, setOpen] = useState(false);
  const { listings, loading, error, refetch } = useBusinessListings();
  const { searchResults, searching, searchQuery, setSearchQuery } = useBusinessSearch(listings);
  const { isRefreshing } = useAuthRedux();

  const displayListings = searchQuery ? searchResults : listings;

  if (loading || isRefreshing) {
    return (
      <div className="hidden md:block">
        <Skeleton className="w-60 lg:w-80 h-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hidden md:block">
        <Button 
          variant="outline" 
          className="w-60 lg:w-80 justify-between border-red-200 text-red-600 hover:bg-red-50"
          onClick={refetch}
        >
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {error}
          </span>
          <span className="text-xs">Click to retry</span>
        </Button>
      </div>
    );
  }

  if (!selectedBusiness && listings.length === 0) {
    return (
      <div className="hidden md:block">
        <Button variant="outline" className="w-60 lg:w-80 justify-between border-gray-200">
          No listings available
        </Button>
      </div>
    );
  }

  const currentBusiness = selectedBusiness || listings[0];

  return (
    <div className="hidden md:block">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open} 
            className="w-60 lg:w-80 justify-between border-gray-200 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2 flex-1 text-left min-w-0">
              <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 truncate block">
                  {currentBusiness?.name}
                </span>
                <span className="text-xs text-gray-500 truncate block">
                  {currentBusiness?.address}
                </span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded shrink-0">
                {currentBusiness?.type}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 lg:w-96 p-0 bg-white z-50" align="end">
          <Command>
            <CommandInput 
              placeholder="Search listings..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            {searching && (
              <div className="p-2 text-center text-sm text-gray-500">
                Searching...
              </div>
            )}
            <CommandEmpty>No listing found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {displayListings.map((business) => (
                  <CommandItem
                    key={business.id}
                    value={business.id}
                    onSelect={() => {
                      onBusinessSelect(business);
                      setOpen(false);
                    }}
                    className="flex items-start gap-3 p-3"
                  >
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${selectedBusiness?.id === business.id ? 'opacity-100' : 'opacity-0'}`} />
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-sm text-gray-900 leading-5 mb-1">
                        {business.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {business.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {business.type}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${business.status === 'Active' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
