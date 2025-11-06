import React, { useState, useMemo } from 'react';
import { MapPin, ChevronDown, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useI18nNamespace } from '@/hooks/useI18nNamespace';
import { mockListings, MockListing } from '../data/mockListings';

export const ReputationListingSwitcher: React.FC = () => {
  const { t } = useI18nNamespace("Reputation-module-component/listingSwitcher");
  const [selectedListing, setSelectedListing] = useState<MockListing>(mockListings[0]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = useMemo(() => {
    if (!searchQuery) return mockListings;
    const query = searchQuery.toLowerCase();
    return mockListings.filter(listing => 
      listing.name.toLowerCase().includes(query) ||
      listing.zipcode.includes(query)
    );
  }, [searchQuery]);

  const handleSelect = (listing: MockListing) => {
    setSelectedListing(listing);
    setOpen(false);
    setSearchQuery("");
  };

  const displayText = selectedListing 
    ? `${selectedListing.name} • ${selectedListing.zipcode}`
    : t("listingSwitcher.noListings");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="hidden lg:flex w-72 lg:w-80 justify-between items-center border-border hover:bg-accent/50 text-foreground"
        >
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium">
              {displayText}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] lg:w-[360px] p-0 bg-background border-border" align="start">
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("listingSwitcher.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-background border-border"
              />
            </div>
          </div>

          {/* Listings List */}
          <ScrollArea className="h-[320px]">
            {filteredListings.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {searchQuery ? t("listingSwitcher.noResults") : t("listingSwitcher.noListings")}
              </div>
            ) : (
              <div className="p-1">
                {filteredListings.map((listing) => {
                  const isSelected = selectedListing?.id === listing.id;
                  return (
                    <button
                      key={listing.id}
                      onClick={() => handleSelect(listing)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left"
                    >
                      <Check 
                        className={`h-4 w-4 flex-shrink-0 ${
                          isSelected ? 'opacity-100 text-primary' : 'opacity-0'
                        }`}
                      />
                      <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {listing.name} • {listing.zipcode}
                        </div>
                      </div>
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        listing.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
