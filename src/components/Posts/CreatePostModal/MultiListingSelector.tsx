import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronRight, X, Search } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
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
  const [groupsExpanded, setGroupsExpanded] = useState(true);
  const [locationsExpanded, setLocationsExpanded] = useState(true);
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

  const handleSelect = (optionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
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

  // Helper functions for select/deselect all functionality
  const handleSelectAllGroups = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const groupIds = groupOptions.map(option => option.id);
    const newSelections = [...selectedListings];
    groupIds.forEach(id => {
      if (!newSelections.includes(id)) {
        newSelections.push(id);
      }
    });
    onListingsChange(newSelections);
  };

  const handleDeselectAllGroups = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const groupIds = groupOptions.map(option => option.id);
    const newSelections = selectedListings.filter(id => !groupIds.includes(id));
    onListingsChange(newSelections);
  };

  const handleSelectAllLocations = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const locationIds = locationOptions.map(option => option.id);
    const newSelections = [...selectedListings];
    locationIds.forEach(id => {
      if (!newSelections.includes(id)) {
        newSelections.push(id);
      }
    });
    onListingsChange(newSelections);
  };

  const handleDeselectAllLocations = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const locationIds = locationOptions.map(option => option.id);
    const newSelections = selectedListings.filter(id => !locationIds.includes(id));
    onListingsChange(newSelections);
  };

  // Check if all items in a section are selected
  const areAllGroupsSelected = groupOptions.length > 0 && groupOptions.every(option => selectedListings.includes(option.id));
  const areAllLocationsSelected = locationOptions.length > 0 && locationOptions.every(option => selectedListings.includes(option.id));

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
        <PopoverContent 
          className="w-full p-0 z-[100] bg-popover border shadow-md" 
          side="bottom" 
          align="start"
          onPointerDownOutside={(e) => {
            const target = e.target as Element;
            if (target.closest('[data-radix-popover-content]')) {
              e.preventDefault();
            }
          }}
        >
          <div className="p-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings and groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                onFocus={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Options List */}
            <ScrollArea className="mt-3 h-60">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : "No listings found."}
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {/* Groups Section */}
                  {groupOptions.length > 0 && (
                    <Collapsible open={groupsExpanded} onOpenChange={setGroupsExpanded}>
                      <CollapsibleTrigger className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent rounded-sm">
                        <div className="flex items-center gap-1">
                          {groupsExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          <span>Groups</span>
                        </div>
                        <button
                          onMouseDown={areAllGroupsSelected ? handleDeselectAllGroups : handleSelectAllGroups}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {areAllGroupsSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-0.5">
                        {groupOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ml-4"
                            onMouseDown={(e) => handleSelect(option.id, e)}
                          >
                            <Check
                              className={`h-4 w-4 ${
                                selectedListings.includes(option.id) ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <span>{option.name}</span>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                  
                  {/* Locations Section */}
                  {locationOptions.length > 0 && (
                    <Collapsible open={locationsExpanded} onOpenChange={setLocationsExpanded}>
                      <CollapsibleTrigger className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent rounded-sm">
                        <div className="flex items-center gap-1">
                          {locationsExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          <span>Locations</span>
                        </div>
                        <button
                          onMouseDown={areAllLocationsSelected ? handleDeselectAllLocations : handleSelectAllLocations}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {areAllLocationsSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-0.5">
                        {locationOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ml-4"
                            onMouseDown={(e) => handleSelect(option.id, e)}
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
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              )}
            </ScrollArea>
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