
import React, { useState } from 'react';
import { ChevronDown, MapPin, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { BusinessListing, businessListings } from './types';

interface BusinessListingSelectorProps {
  selectedBusiness: BusinessListing;
  onBusinessSelect: (business: BusinessListing) => void;
}

export const BusinessListingSelector: React.FC<BusinessListingSelectorProps> = ({
  selectedBusiness,
  onBusinessSelect
}) => {
  const [open, setOpen] = useState(false);

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
                  {selectedBusiness.name}
                </span>
                <span className="text-xs text-gray-500 truncate block">
                  {selectedBusiness.address}
                </span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded shrink-0">
                {selectedBusiness.type}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 lg:w-80 p-0" align="end">
          <Command>
            <CommandInput placeholder="Search listings..." />
            <CommandEmpty>No listing found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {businessListings.map((business) => (
                  <CommandItem
                    key={business.id}
                    value={business.name}
                    onSelect={() => {
                      onBusinessSelect(business);
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 p-3"
                  >
                    <Check className={`w-4 h-4 ${selectedBusiness.id === business.id ? 'opacity-100' : 'opacity-0'}`} />
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
