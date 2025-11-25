import React, { useState } from "react";
import { ChevronDown, MapPin, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Skeleton } from "../ui/skeleton";
import { BusinessListing } from "./types";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useListingContext } from "@/context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const BusinessListingSelector: React.FC = () => {
  const { t } = useI18nNamespace("Header/businessListingSelector");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    selectedListing,
    setSelectedListing,
    listings,
    isLoading,
    switchListing,
  } = useListingContext();
  const { isRefreshing } = useAuthRedux();
  const { searchResults, searching, searchQuery, setSearchQuery } =
    useBusinessSearch(listings);

  const displayListings = searchQuery ? searchResults : listings;

  const handleSelect = (listing: (typeof listings)[0]) => {
    setSelectedListing(listing);
    setOpen(false);
    setSearchQuery("");
    // Navigate to the geo ranking page for this listing
    navigate(`/geo-ranking-report/${listing.id}`);
  };

  if (isRefreshing) {
    return (
      <div className="hidden lg:block">
        <Skeleton className="w-72 lg:w-96 h-12" />
      </div>
    );
  }

  if (!selectedListing && listings.length === 0) {
    return (
      <div className="hidden lg:block">
        <Button
          variant="outline"
          className="w-72 lg:w-96 justify-between border-gray-200 h-[60px]"
        >
          {t("businessListingSelector.noListings")} 
        </Button> 
      </div>
    );
  }

  const currentBusiness =
    selectedListing || (listings.length > 0 ? listings[0] : null);

  if (!currentBusiness) {
    return (
      <div className="hidden lg:block">
        <Button
          variant="outline"
          className="w-72 lg:w-96 justify-between border-gray-200"
        >
          {t("businessListingSelector.loading")} 
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden lg:block">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-72 lg:w-96 justify-between border-gray-200 hover:bg-gray-50 h-auto min-h-[48px] py-2"
            disabled={isLoading}
          >
            <div className="flex items-start gap-2 flex-1 text-left min-w-0">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-gray-500 shrink-0 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700 block leading-tight">
                  {currentBusiness.name.length > 30
                    ? currentBusiness.name.slice(0, 30) + "..."
                    : currentBusiness.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 truncate">
                    {currentBusiness.address}
                  </span>
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-xs ml-auto"
                  >
                    {currentBusiness.zipcode}
                  </Badge>
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-2 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-96 lg:w-[32rem] p-0 bg-white z-50"
          align="end"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={t("businessListingSelector.searchPlaceholder")}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            {searching && (
              <div className="p-2 text-center text-sm text-gray-500">
                {t("businessListingSelector.searching")}
              </div>
            )}
            <CommandEmpty>
              {t("businessListingSelector.noResults")}
            </CommandEmpty>
            <CommandList>
              <CommandGroup>
                {displayListings.map((business) => (
                  <CommandItem
                    key={business.id}
                    value={`${business.name}-${business.id}`}
                    onSelect={() => {
                      switchListing(business);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-start gap-3 p-3"
                  >
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        selectedListing?.id === business.id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 leading-5 mb-1">
                        {business.name.length > 30
                          ? business.name.slice(0, 30) + "..."
                          : business.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500 truncate">
                          {business.address}
                        </p>
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-xs ml-auto"
                        >
                          {business.zipcode}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center shrink-0">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          business.status === "Active"
                            ? "bg-green-400"
                            : "bg-yellow-400"
                        }`}
                      />
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
