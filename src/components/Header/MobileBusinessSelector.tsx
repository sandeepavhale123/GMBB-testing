import React, { useState, useContext } from "react";
import {
  Store,
  ChevronRight,
  MapPin,
  Check,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
import { useBusinessSearch } from "@/hooks/useBusinessSearch";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useListingContext } from "@/context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const MobileBusinessSelector: React.FC = () => {
  const { t } = useI18nNamespace("Header/mobileBusinessSelector");
  const [mobileListingOpen, setMobileListingOpen] = useState(false);

  // Check if ListingProvider context is available
  let hasListingContext = true;
  let contextData;

  try {
    contextData = useListingContext();
  } catch (error) {
    hasListingContext = false;
  }

  const { isRefreshing } = useAuthRedux();

  // If no listing context available, don't render the component
  if (!hasListingContext) {
    return null;
  }

  const { selectedListing, listings, isLoading, switchListing } = contextData;
  const { searchResults, searching, searchQuery, setSearchQuery } =
    useBusinessSearch(listings);

  const displayListings = searchQuery ? searchResults : listings;

  if (isRefreshing) {
    return (
      <div className="lg:hidden">
        <Skeleton className="w-12 h-8" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="lg:hidden">
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
    <div className="lg:hidden">
      <Popover open={mobileListingOpen} onOpenChange={setMobileListingOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 p-2 border-gray-200 hover:bg-gray-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
            ) : (
              <Store className="w-4 h-4 text-gray-500" />
            )}
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 sm:w-96 lg:w-[28rem] p-0 bg-white z-50"
          align="end"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={t("mobileBusinessSelector.searchPlaceholder")}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            {searching && (
              <div className="p-2 text-center text-sm text-gray-500">
                {t("mobileBusinessSelector.searching")}
              </div>
            )}
            <CommandEmpty>{t("mobileBusinessSelector.noResults")}</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {displayListings.map((business) => (
                  <CommandItem
                    key={business.id}
                    value={`${business.name}-${business.id}`}
                    onSelect={() => {
                      switchListing(business);
                      setMobileListingOpen(false);
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
                        {business.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500 truncate">
                          {business.address}
                        </p>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {business.type}
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
