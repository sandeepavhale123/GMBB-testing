import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { useGetAllListingsMutation, GroupsList, LocationsList } from '../../../api/listingsGroupsApi';
import { toast } from '@/hooks/use-toast';

interface MultiListingSelectorProps {
  selectedListings: string[];
  onListingsChange: (listings: string[]) => void;
  error?: string;
}

interface ListingOption {
  id: string;
  name: string;
  type: 'group' | 'location';
  zipCode?: string;
}

export const MultiListingSelector: React.FC<MultiListingSelectorProps> = ({
  selectedListings,
  onListingsChange,
  error
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ListingOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [getAllListings, { isLoading }] = useGetAllListingsMutation();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await getAllListings().unwrap();
      
      const groupOptions: ListingOption[] = response.data.groupsLists.map((group: GroupsList) => ({
        id: group.id,
        name: group.labelName,
        type: 'group'
      }));

      const locationOptions: ListingOption[] = response.data.locationLists.map((location: LocationsList) => ({
        id: location.id,
        name: location.locationName,
        type: 'location',
        zipCode: location.zipCode
      }));

      setOptions([...groupOptions, ...locationOptions]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch listings and groups",
        variant: "destructive",
      });
    }
  };

  const handleSelect = (optionId: string) => {
    const isSelected = selectedListings.includes(optionId);
    if (isSelected) {
      onListingsChange(selectedListings.filter(id => id !== optionId));
    } else {
      onListingsChange([...selectedListings, optionId]);
    }
  };

  const handleRemove = (optionId: string) => {
    onListingsChange(selectedListings.filter(id => id !== optionId));
  };

  const getSelectedOptions = () => {
    return options.filter(option => selectedListings.includes(option.id));
  };

  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.zipCode && option.zipCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupOptions = filteredOptions.filter(option => option.type === 'group');
  const locationOptions = filteredOptions.filter(option => option.type === 'location');

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Select Listings & Groups</Label>
      
      {/* Selected items display */}
      {selectedListings.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getSelectedOptions().map((option) => (
            <Badge key={option.id} variant="secondary" className="px-2 py-1">
              <span className="text-xs">
                {option.name} {option.zipCode && `(${option.zipCode})`}
                <span className="ml-1 text-muted-foreground">
                  {option.type === 'group' ? '[Group]' : '[Location]'}
                </span>
              </span>
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => handleRemove(option.id)}
              />
            </Badge>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {selectedListings.length === 0 
              ? (isLoading ? "Loading..." : "Select listings and groups...") 
              : `${selectedListings.length} item${selectedListings.length === 1 ? '' : 's'} selected`
            }
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-50 bg-popover border shadow-md" side="bottom" align="start">
          <div className="p-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings and groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {/* Options List */}
            <div className="mt-3 max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : "No listings found."}
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Groups Section */}
                  {groupOptions.length > 0 && (
                    <div>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        Groups
                      </div>
                      {groupOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleSelect(option.id)}
                        >
                          <Check
                            className={`h-4 w-4 ${
                              selectedListings.includes(option.id) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          <span>{option.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Locations Section */}
                  {locationOptions.length > 0 && (
                    <div>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        Locations
                      </div>
                      {locationOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleSelect(option.id)}
                        >
                          <Check
                            className={`h-4 w-4 ${
                              selectedListings.includes(option.id) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          <div className="flex flex-col">
                            <span>{option.name}</span>
                            {option.zipCode && (
                              <span className="text-xs text-muted-foreground">{option.zipCode}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {selectedListings.length === 0 && !error && (
        <p className="text-xs text-muted-foreground">
          Select at least one listing or group to continue
        </p>
      )}
      
      {error && (
        <p className="text-xs text-destructive font-medium">
          {error}
        </p>
      )}
    </div>
  );
};