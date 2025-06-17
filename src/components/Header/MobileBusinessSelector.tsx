
import React, { useState } from 'react';
import { Store, ChevronRight, MapPin, Check, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';
import { BusinessListing } from './types';
import { useBusinessListings } from '@/hooks/useBusinessListings';
import { useBusinessSearch } from '@/hooks/useBusinessSearch';

interface MobileBusinessSelectorProps {
  selectedBusiness: BusinessListing | null;
  onBusinessSelect: (business: BusinessListing) => void;
}

export const MobileBusinessSelector: React.FC<MobileBusinessSelectorProps> = ({
  selectedBusiness,
  onBusinessSelect
}) => {
  const [mobileListingOpen, setMobileListingOpen] = useState(false);
  const { listings, loading, error, refetch } = useBusinessListings();
  const { searchResults, searching, searchQuery, setSearchQuery } = useBusinessSearch(listings);

  const displayListings = searchQuery ? searchResults : listings;

  if (loading) {
    return (
      <div className="md:hidden">
        <Skeleton className="w-12 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:hidden">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 p-2 border-red-200 text-red-600"
          onClick={refetch}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="md:hidden">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 p-2 border-gray-200 opacity-50"
          disabled
        >
          <Store className="w-4 h-4 text-gray-400" />
          <ChevronRight className="w-3 h-3 text-gray-400" />
        </Button>
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <Popover open={mobileListingOpen} onOpenChange={setMobileListingOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1 p-2 border-gray-200 hover:bg-gray-50"
          >
            <Store className="w-4 h-4 text-gray-500" />
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 bg-white z-50" align="end">
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
                    value={business.name}
                    onSelect={() => {
                      onBusinessSelect(business);
                      setMobileListingOpen(false);
                    }}
                    className="flex items-center gap-3 p-3"
                  >
                    <Check className={`w-4 h-4 ${selectedBusiness?.id === business.id ? 'opacity-100' : 'opacity-0'}`} />
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {business.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {business.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
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
