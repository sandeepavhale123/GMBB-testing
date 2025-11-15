import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import {
  useGetAllListingsMutation,
  GroupsList,
  LocationsList,
} from "../../../api/listingsGroupsApi";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface MultiListingSelectorProps {
  selectedListings: string[];
  onListingsChange: (listings: string[]) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}
interface ListingOption {
  id: string;
  name: string;
  type: "group" | "location";
  zipCode?: string;
  locCount?: number;
}
export const MultiListingSelector: React.FC<MultiListingSelectorProps> = ({
  selectedListings,
  onListingsChange,
  error,
  label = "Select Listings & Groups",
  placeholder = "Select listings and groups...",
  className,
}) => {
  const { t } = useI18nNamespace("Post/multiListingSelector");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ListingOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupsOpen, setGroupsOpen] = useState(true);
  const [locationsOpen, setLocationsOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [getAllListings, { isLoading }] = useGetAllListingsMutation();

  useEffect(() => {
    fetchListings();
  }, []);

  // Close collapsible when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  const fetchListings = async () => {
    try {
      const response = await getAllListings().unwrap();
      const groupOptions: ListingOption[] = response.data.groupsLists
        .filter((group: GroupsList) => group.locCount > 0 && group.groupName)
        .map((group: GroupsList) => ({
          id: group.id,
          name: group.groupName || t("multiListingSelector.unnamedGroup"),
          type: "group",
          locCount: group.locCount,
        }));
      const locationOptions: ListingOption[] = response.data.locationLists
        .filter((location: LocationsList) => location.locationName)
        .map((location: LocationsList) => ({
          id: location.id,
          name:
            location.locationName || t("multiListingSelector.unnamedLocation"),
          type: "location",
          zipCode: location.zipCode,
        }));
      setOptions([...groupOptions, ...locationOptions]);
    } catch (error) {
      toast({
        title: t("multiListingSelector.errorTitle"),
        description: t("multiListingSelector.errorMessage"),
        variant: "destructive",
      });
    }
  };
  const handleSelect = (optionId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const isSelected = selectedListings.includes(optionId);
    if (isSelected) {
      onListingsChange(selectedListings.filter((id) => id !== optionId));
    } else {
      onListingsChange([...selectedListings, optionId]);
    }
  };
  const handleRemove = (optionId: string) => {
    onListingsChange(selectedListings.filter((id) => id !== optionId));
  };
  const getSelectedOptions = () => {
    return options.filter((option) => selectedListings.includes(option.id));
  };
  const filteredOptions = options.filter(
    (option) =>
      (option.name &&
        option.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (option.zipCode &&
        option.zipCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const groupOptions = filteredOptions.filter(
    (option) => option.type === "group"
  );
  const locationOptions = filteredOptions.filter(
    (option) => option.type === "location"
  );

  // Helper functions for select/deselect all functionality
  const handleSelectAllGroups = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const groupIds = groupOptions.map((option) => option.id);
    const newSelections = [...selectedListings];
    groupIds.forEach((id) => {
      if (!newSelections.includes(id)) {
        newSelections.push(id);
      }
    });
    onListingsChange(newSelections);
  };
  const handleDeselectAllGroups = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const groupIds = groupOptions.map((option) => option.id);
    const newSelections = selectedListings.filter(
      (id) => !groupIds.includes(id)
    );
    onListingsChange(newSelections);
  };
  const handleSelectAllLocations = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const locationIds = locationOptions.map((option) => option.id);
    const newSelections = [...selectedListings];
    locationIds.forEach((id) => {
      if (!newSelections.includes(id)) {
        newSelections.push(id);
      }
    });
    onListingsChange(newSelections);
  };
  const handleDeselectAllLocations = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const locationIds = locationOptions.map((option) => option.id);
    const newSelections = selectedListings.filter(
      (id) => !locationIds.includes(id)
    );
    onListingsChange(newSelections);
  };

  // Check if all items in a section are selected
  const areAllGroupsSelected =
    groupOptions.length > 0 &&
    groupOptions.every((option) => selectedListings.includes(option.id));
  const areAllLocationsSelected =
    locationOptions.length > 0 &&
    locationOptions.every((option) => selectedListings.includes(option.id));
  return (
    <div className={className || "space-y-3"}>
      <Label className="text-sm font-medium">
        {t("multiListingSelector.label")}
      </Label>

      {/* Selected items display */}
      {selectedListings.length > 0 && (
        <div className="flex flex-wrap gap-2 hidden">
          {getSelectedOptions().map((option) => (
            <Badge key={option.id} variant="secondary" className="px-2 py-1">
              <span className="text-xs">
                {option.name} {option.zipCode && `(${option.zipCode})`}
                <span className="ml-1 text-muted-foreground">
                  {option.type === "group"
                    ? t("multiListingSelector.groupTag")
                    : t("multiListingSelector.locationTag")}
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
          >
            {
              selectedListings.length === 0
                ? isLoading
                  ? t("multiListingSelector.loading")
                  : t("multiListingSelector.placeholder")
                : selectedListings.length === 1
                ? t("multiListingSelector.selectedCount", {
                    count: selectedListings.length,
                  })
                : t("multiListingSelector.selectedCount_plural", {
                    count: selectedListings.length,
                  })
              // `${
              //   selectedListings.length
              // } item${selectedListings.length === 1 ? "" : "s"} selected`
            }
            <ChevronDown
              className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div
            ref={containerRef}
            className="border rounded-md bg-background shadow-sm"
          >
            <div className="p-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("multiListingSelector.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>

              {/* Options List */}
              <div className="mt-3 max-h-60 overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {isLoading
                      ? t("multiListingSelector.loading")
                      : t("multiListingSelector.noResults")}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Groups Section */}
                    {groupOptions.length > 0 && (
                      <div>
                        <Collapsible
                          open={groupsOpen}
                          onOpenChange={setGroupsOpen}
                        >
                          <div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                              <ChevronDown
                                className={`h-3 w-3 transition-transform ${
                                  groupsOpen ? "rotate-180" : ""
                                }`}
                              />
                              <span>{t("multiListingSelector.groups")}</span>
                            </CollapsibleTrigger>
                            <button
                              onClick={
                                areAllGroupsSelected
                                  ? handleDeselectAllGroups
                                  : handleSelectAllGroups
                              }
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                            >
                              {areAllGroupsSelected
                                ? t("multiListingSelector.deselectAll")
                                : t("multiListingSelector.selectAll")}
                            </button>
                          </div>
                          <CollapsibleContent>
                            {groupOptions.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                onClick={(e) => handleSelect(option.id, e)}
                              >
                                <Check
                                  className={`h-4 w-4 ${
                                    selectedListings.includes(option.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                <div className="flex items-center justify-between w-full">
                                  <span>{option.name}</span>
                                  {option.locCount && (
                                    <div className="flex items-center">
                                      <span className="text-xs text-muted-foreground mr-1">
                                        {t("multiListingSelector.listings")}
                                      </span>
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
                        <Collapsible
                          open={locationsOpen}
                          onOpenChange={setLocationsOpen}
                        >
                          <div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                            <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground transition-colors">
                              <ChevronDown
                                className={`h-3 w-3 transition-transform ${
                                  locationsOpen ? "rotate-180" : ""
                                }`}
                              />
                              <span>{t("multiListingSelector.locations")}</span>
                            </CollapsibleTrigger>
                            <button
                              onClick={
                                areAllLocationsSelected
                                  ? handleDeselectAllLocations
                                  : handleSelectAllLocations
                              }
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                            >
                              {areAllLocationsSelected
                                ? t("multiListingSelector.deselectAll")
                                : t("multiListingSelector.selectAll")}
                            </button>
                          </div>
                          <CollapsibleContent>
                            {locationOptions.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                onClick={(e) => handleSelect(option.id, e)}
                              >
                                <Check
                                  className={`h-4 w-4 ${
                                    selectedListings.includes(option.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                <div className="flex flex-col">
                                  <span>{option.name}</span>
                                  {option.zipCode && (
                                    <span className="text-xs text-muted-foreground">
                                      {option.zipCode}
                                    </span>
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
          {t("multiListingSelector.selectHint")}
        </p>
      )}

      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
};
