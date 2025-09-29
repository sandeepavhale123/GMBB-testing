import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useGetAvailableGroupListingsMutation,
  AvailableListingLocation,
} from "@/api/listingsGroupsApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ListingOption {
  id: string;
  name: string;
  type: string;
  zipCode?: string;
  userEmail?: string;
}

interface AvailableGroupListingSelectorProps {
  groupId: number;
  selectedListings: number[];
  onListingsChange: (listings: number[]) => void;
  error?: string;
}

export const AvailableGroupListingSelector: React.FC<
  AvailableGroupListingSelectorProps
> = ({ groupId, selectedListings, onListingsChange, error }) => {
  const { t } = useI18nNamespace("Groups/availableGroupListingSelector");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ListingOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationsOpen, setLocationsOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [getAvailableListings, { isLoading }] =
    useGetAvailableGroupListingsMutation();

  useEffect(() => {
    fetchListings();
  }, [groupId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchListings = async () => {
    try {
      const response = await getAvailableListings({ groupId }).unwrap();

      if (response.code === 200 && response.data?.locationGroups) {
        const transformedOptions: ListingOption[] = [];

        Object.entries(response.data.locationGroups).forEach(
          ([email, locations]) => {
            // Filter out listings that are already added
            const availableLocations = locations.filter(
              (location: AvailableListingLocation) => !location.alreadyAdded
            );

            availableLocations.forEach((location: AvailableListingLocation) => {
              transformedOptions.push({
                id: location.id,
                name: location.locationName,
                type: "location",
                zipCode: location.zipCode,
                userEmail: email || t("unknownUser"),
              });
            });
          }
        );

        setOptions(transformedOptions);

        // Auto-open first few groups if they have listings
        const newLocationsOpen: { [key: string]: boolean } = {};
        const emails = Object.keys(response.data.locationGroups);
        emails.slice(0, 3).forEach((email) => {
          const availableCount = response.data.locationGroups[email].filter(
            (loc: AvailableListingLocation) => !loc.alreadyAdded
          ).length;
          if (availableCount > 0) {
            newLocationsOpen[email] = true;
          }
        });
        setLocationsOpen(newLocationsOpen);
      }
    } catch (error) {
      console.error("Error fetching available listings:", error);
    }
  };

  const handleSelect = (listingId: string) => {
    const numericId = parseInt(listingId);
    const isSelected = selectedListings.includes(numericId);

    if (isSelected) {
      onListingsChange(selectedListings.filter((id) => id !== numericId));
    } else {
      onListingsChange([...selectedListings, numericId]);
    }
  };

  const handleRemove = (listingId: number) => {
    onListingsChange(selectedListings.filter((id) => id !== listingId));
  };

  const getSelectedOptions = (): ListingOption[] => {
    return options.filter((option) =>
      selectedListings.includes(parseInt(option.id))
    );
  };

  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.zipCode &&
        option.zipCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedOptions = filteredOptions.reduce((acc, option) => {
    const email = option.userEmail || "Unknown";
    if (!acc[email]) {
      acc[email] = [];
    }
    acc[email].push(option);
    return acc;
  }, {} as { [key: string]: ListingOption[] });

  const handleSelectAllLocations = () => {
    const allFilteredIds = filteredOptions.map((option) => parseInt(option.id));
    const newSelected = [...new Set([...selectedListings, ...allFilteredIds])];
    onListingsChange(newSelected);
  };

  const handleDeselectAllLocations = () => {
    const filteredIds = filteredOptions.map((option) => parseInt(option.id));
    const newSelected = selectedListings.filter(
      (id) => !filteredIds.includes(id)
    );
    onListingsChange(newSelected);
  };

  const areAllLocationsSelected =
    filteredOptions.length > 0 &&
    filteredOptions.every((option) =>
      selectedListings.includes(parseInt(option.id))
    );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("label")}</label>
      <div className="relative" ref={dropdownRef}>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={() => setOpen(!open)}
        >
          <span className="text-left">
            {selectedListings.length > 0
              ? t("dropdown.selectedCount", {
                  count: selectedListings.length,
                  plural: selectedListings.length !== 1 ? "s" : "",
                })
              : t("dropdown.noneSelected")}
            {/* {selectedListings.length > 0
              ? `${selectedListings.length} listing${
                  selectedListings.length !== 1 ? "s" : ""
                } selected`
              : "Select listings"} */}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>

        {selectedListings.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 hidden">
            {getSelectedOptions().map((option) => (
              <Badge key={option.id} variant="secondary" className="text-xs">
                {option.name}
                <button
                  type="button"
                  onClick={() => handleRemove(parseInt(option.id))}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {open && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 text-center text-muted-foreground">
                  {t("loading")}
                </div>
              ) : Object.keys(groupedOptions).length === 0 ? (
                <div className="p-3 text-center text-muted-foreground">
                  {error
                    ? error
                    : searchTerm
                    ? t("noResults.search")
                    : t("noResults.default")}
                </div>
              ) : (
                <>
                  {filteredOptions.length > 0 && (
                    <div className="p-2 border-b border-border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={
                          areAllLocationsSelected
                            ? handleDeselectAllLocations
                            : handleSelectAllLocations
                        }
                        className="w-full justify-start text-xs"
                      >
                        {areAllLocationsSelected
                          ? t("deselectAll", { count: filteredOptions.length })
                          : t("selectAll", { count: filteredOptions.length })}
                      </Button>
                    </div>
                  )}

                  {Object.entries(groupedOptions).map(([email, listings]) => (
                    <div
                      key={email}
                      className="border-b border-border last:border-b-0"
                    >
                      <button
                        type="button"
                        className="w-full p-3 text-left hover:bg-muted transition-colors flex items-center justify-between"
                        onClick={() =>
                          setLocationsOpen((prev) => ({
                            ...prev,
                            [email]: !prev[email],
                          }))
                        }
                      >
                        <span className="font-medium text-sm">
                          {email || t("unknownUser")}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {t("listingsCount", {
                              count: listings.length,
                              plural: listings.length !== 1 ? "s" : "",
                            })}
                            {/* {listings.length} listing
                            {listings.length !== 1 ? "s" : ""} */}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              locationsOpen[email] ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {locationsOpen[email] && (
                        <div className="bg-muted/50">
                          {listings.map((listing) => {
                            const isSelected = selectedListings.includes(
                              parseInt(listing.id)
                            );
                            return (
                              <div
                                key={listing.id}
                                className="flex items-center p-3 hover:bg-muted transition-colors cursor-pointer border-t border-border/50"
                                onClick={() => handleSelect(listing.id)}
                              >
                                <div
                                  className={`w-4 h-4 border rounded mr-3 flex items-center justify-center ${
                                    isSelected
                                      ? "bg-primary border-primary text-primary-foreground"
                                      : "border-border"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {listing.name}
                                  </div>
                                  {listing.zipCode && (
                                    <div className="text-xs text-muted-foreground">
                                      {t("zip", { zipCode: listing.zipCode })}
                                      {/* Zip: {listing.zipCode} */}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>

            {selectedListings.length === 0 &&
              Object.keys(groupedOptions).length > 0 &&
              !error && (
                <div className="p-3 border-t border-border bg-muted/50 text-center text-xs text-muted-foreground">
                  {t("footerNote")}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
