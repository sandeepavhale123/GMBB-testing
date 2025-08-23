import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetGroupsListingMutation } from '@/api/listingsGroupsApi';
import { toast } from '@/hooks/use-toast';

interface GroupListingSelectorProps {
  selectedListings: string[];
  onListingsChange: (listings: string[]) => void;
  error?: string;
}

interface ListingOption {
  id: string;
  name: string;
  type: 'location';
  zipCode?: string;
  google_account_id?: string;
  name_full?: string;
  userEmail?: string;
}

export const GroupListingSelector: React.FC<GroupListingSelectorProps> = ({
  selectedListings,
  onListingsChange,
  error
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ListingOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationsOpen, setLocationsOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [getGroupsListing, { isLoading }] = useGetGroupsListingMutation();
  
  useEffect(() => {
    fetchListings();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const fetchListings = async () => {
    try {
      const response = await getGroupsListing().unwrap();
      
      if (response.code === 200) {
        const locationOptions: ListingOption[] = [];
        
        // Transform the nested email-grouped structure to flat array
        Object.entries(response.data.locationGroups).forEach(([email, locations]) => {
          locations.forEach(location => {
            locationOptions.push({
              id: location.id,
              name: location.locationName,
              type: 'location' as const,
              zipCode: location.zipCode,
              google_account_id: location.google_account_id,
              name_full: location.name,
              userEmail: email,
            });
          });
        });
        
        setOptions(locationOptions);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch listings",
        variant: "destructive"
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

  // Group filtered options by user email
  const groupedOptions = filteredOptions.reduce((groups, option) => {
    const email = option.userEmail || 'Unknown';
    if (!groups[email]) {
      groups[email] = [];
    }
    groups[email].push(option);
    return groups;
  }, {} as Record<string, ListingOption[]>);

  // Helper functions for select/deselect all functionality
  const handleSelectAllLocations = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const locationIds = filteredOptions.map(option => option.id);
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
    const locationIds = filteredOptions.map(option => option.id);
    const newSelections = selectedListings.filter(id => !locationIds.includes(id));
    onListingsChange(newSelections);
  };

  // Check if all items are selected
  const areAllLocationsSelected = filteredOptions.length > 0 && filteredOptions.every(option => selectedListings.includes(option.id));

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Select Listings *</Label>
      
      {/* Selected items display */}
      {selectedListings.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getSelectedOptions().map(option => (
            <Badge key={option.id} variant="secondary" className="px-2 py-1">
              <span className="text-xs">
                {option.name} {option.zipCode && `(${option.zipCode})`}
              </span>
              <X 
                className="w-3 h-3 ml-1 cursor-pointer hover:text-destructive" 
                onClick={() => handleRemove(option.id)} 
              />
            </Badge>
          ))}
        </div>
      )}

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between" 
            disabled={isLoading}
            onClick={() => setOpen(!open)}
          >
            {selectedListings.length === 0 
              ? (isLoading ? "Loading..." : "Select listings...") 
              : `${selectedListings.length} listing${selectedListings.length === 1 ? '' : 's'} selected`
            }
            <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-2">
          <div ref={containerRef} className="border rounded-md bg-popover shadow-lg z-50">
            <div className="p-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search listings..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-8 w-full" 
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
                    {/* Locations Section */}
                    <div>
                      <Collapsible open={locationsOpen} onOpenChange={setLocationsOpen}>
                        <div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                          <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <ChevronDown className={`h-3 w-3 transition-transform ${locationsOpen ? 'rotate-180' : ''}`} />
                            <span>Locations</span>
                          </CollapsibleTrigger>
                          <button 
                            onClick={areAllLocationsSelected ? handleDeselectAllLocations : handleSelectAllLocations} 
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                          >
                            {areAllLocationsSelected ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                        <CollapsibleContent>
                          {Object.entries(groupedOptions).map(([email, userOptions]) => (
                            <div key={email} className="mb-3">
                              <div className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-sm border-l-2 border-blue-200">
                                {email}
                              </div>
                              {userOptions.map(option => (
                                <div 
                                  key={option.id} 
                                  className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground ml-2" 
                                  onClick={(e) => handleSelect(option.id, e)}
                                >
                                  <Checkbox 
                                    checked={selectedListings.includes(option.id)}
                                    onChange={() => {}}
                                    className="pointer-events-none"
                                  />
                                  <div className="flex flex-col flex-1">
                                    <span>{option.name}</span>
                                    {option.zipCode && (
                                      <span className="text-xs text-muted-foreground">{option.zipCode}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {selectedListings.length === 0 && !error && (
        <p className="text-xs text-muted-foreground">
          Select at least one listing to continue.
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