import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useGetBulkReplyDetailsMutation, BulkReplyGroupsList, BulkReplyLocationsList } from '../../api/bulkAutoReplyApi';
import { toast } from '@/hooks/use-toast';

interface BulkReplyListingSelectorProps {
  selectedListings: string[];
  onListingsChange: (listings: string[]) => void;
  onOptionsChange?: (options: BulkReplyListingOption[]) => void;
  error?: string;
  projectId?: string;
  hideStatusBadges?: boolean;
  hideGroups?: boolean;
}

interface BulkReplyListingOption {
  id: string;
  name: string;
  type: 'group' | 'location';
  zipCode?: string;
  locCount?: number;
  setting?: string;
  setting_type?: string;
  google_account_id?: string;
  google_locid?: string;
}

export const BulkReplyListingSelector: React.FC<BulkReplyListingSelectorProps> = ({
  selectedListings,
  onListingsChange,
  onOptionsChange,
  error,
  projectId,
  hideStatusBadges = false,
  hideGroups = false
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<BulkReplyListingOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupsOpen, setGroupsOpen] = useState(true);
  const [locationsOpen, setLocationsOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [getBulkReplyDetails, {
    isLoading
  }] = useGetBulkReplyDetailsMutation();
  
  useEffect(() => {
    fetchListings();
  }, []);

  // Close collapsible when clicking outside
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
      const response = await getBulkReplyDetails(projectId ? { projectId } : {}).unwrap();
      
      const groupOptions: BulkReplyListingOption[] = response.data.groupsLists
        .filter((group: BulkReplyGroupsList) => group.locCount > 0)
        .map((group: BulkReplyGroupsList) => ({
          id: group.id,
          name: group.labelName,
          type: 'group',
          locCount: group.locCount,
          google_locid: group.google_locid
        }));

      const locationOptions: BulkReplyListingOption[] = response.data.locationLists.map((location: BulkReplyLocationsList) => ({
        id: location.id,
        name: location.locationName,
        type: 'location',
        zipCode: location.zipCode,
        setting: location.setting,
        setting_type: location.setting_type,
        google_account_id: location.google_account_id
      }));

      const allOptions = [...groupOptions, ...locationOptions];
      setOptions(allOptions);
      onOptionsChange?.(allOptions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bulk reply details",
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

  const getSettingTypeBadgeVariant = (settingType: string) => {
    switch (settingType?.toLowerCase()) {
      case 'ai':
        return 'default';
      case 'template':
        return 'secondary';
      case 'dnr':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Select Locations</Label>
      
      {/* Selected items display */}
      {selectedListings.length > 0 && (
        <div className="flex flex-wrap gap-2 hidden">
          {getSelectedOptions().map(option => (
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

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between" 
            disabled={isLoading}
            onClick={() => setOpen(!open)}
          >
            {selectedListings.length === 0 
              ? (isLoading ? "Loading..." : "Select locations...") 
              : `${selectedListings.length} item${selectedListings.length === 1 ? '' : 's'} selected`
            }
            <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div ref={containerRef} className="border rounded-md bg-background shadow-lg z-50 relative">
            <div className="p-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search locations..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="pl-8 w-full" 
                />
              </div> 
              
              {/* Options List */}
              <div className="mt-3 max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {isLoading ? "Loading..." : "No location found."}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Groups Section */}
                    {!hideGroups && groupOptions.length > 0 && (
                      <div>
                        <Collapsible open={groupsOpen} onOpenChange={setGroupsOpen}>
                          <div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                              <ChevronDown className={`h-3 w-3 transition-transform ${groupsOpen ? 'rotate-180' : ''}`} />
                              <span>Groups</span>
                            </CollapsibleTrigger>
                            <button 
                              onClick={areAllGroupsSelected ? handleDeselectAllGroups : handleSelectAllGroups} 
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                            >
                              {areAllGroupsSelected ? 'Deselect All' : 'Select All'}
                            </button>
                          </div>
                          <CollapsibleContent>
                            {groupOptions.map(option => (
                              <div 
                                key={option.id} 
                                className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground" 
                                onClick={e => handleSelect(option.id, e)}
                              >
                                <Check className={`h-4 w-4 ${selectedListings.includes(option.id) ? "opacity-100" : "opacity-0"}`} />
                                 <div className="flex items-center justify-between w-full">
                                   <span>{option.name}</span>
                                   {!hideStatusBadges && option.locCount && (
                                     <div className="flex items-center">
                                       <span className="text-xs text-muted-foreground mr-1">Locations</span>
                                       <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                         {option.locCount}
                                       </span>
                                     </div>
                                   )}
                                 </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}
                    
                    {/* Locations Section */}
                    {locationOptions.length > 0 && (
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
                            {locationOptions.map(option => (
                              <div 
                                key={option.id} 
                                className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground" 
                                onClick={e => handleSelect(option.id, e)}
                              >
                                <Check className={`h-4 w-4 ${selectedListings.includes(option.id) ? "opacity-100" : "opacity-0"}`} />
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex flex-col">
                                    <span>{option.name}</span>
                                    {option.zipCode && <span className="text-xs text-muted-foreground">{option.zipCode}</span>}
                                  </div>
                                   {!hideStatusBadges && option.setting_type && (
                                     <Badge 
                                       variant={getSettingTypeBadgeVariant(option.setting_type)} 
                                       className="text-xs"
                                     >
                                       {option.setting_type}
                                     </Badge>
                                   )}
                                </div>
                              </div>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {selectedListings.length === 0 && !error && (
        <p className="text-xs text-muted-foreground">
          Select at least one location to continue
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