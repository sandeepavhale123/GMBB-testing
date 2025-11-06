import React, { useState, useMemo } from 'react';
import { MapPin, ChevronRight, Search, Check, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useI18nNamespace } from '@/hooks/useI18nNamespace';
import { mockListings, MockListing } from '../data/mockListings';

export const ReputationListingSwitcherMobile: React.FC = () => {
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden flex items-center gap-2 text-foreground"
        >
          <Store className="h-5 w-5" />
          <ChevronRight className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-background">
        <SheetHeader>
          <SheetTitle className="text-foreground">Select Listing</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col mt-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("listingSwitcher.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>

          {/* Current Selection */}
          {selectedListing && (
            <div className="p-3 rounded-lg bg-accent border border-border">
              <div className="text-xs text-muted-foreground mb-1">Current Selection</div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {selectedListing.name} • {selectedListing.zipcode}
                </span>
              </div>
            </div>
          )}

          {/* Listings List */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            {filteredListings.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {searchQuery ? t("listingSwitcher.noResults") : t("listingSwitcher.noListings")}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredListings.map((listing) => {
                  const isSelected = selectedListing?.id === listing.id;
                  return (
                    <button
                      key={listing.id}
                      onClick={() => handleSelect(listing)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-accent transition-colors text-left border border-transparent hover:border-border"
                    >
                      <Check 
                        className={`h-4 w-4 flex-shrink-0 ${
                          isSelected ? 'opacity-100 text-primary' : 'opacity-0'
                        }`}
                      />
                      <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {listing.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {listing.zipcode}
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
      </SheetContent>
    </Sheet>
  );
};
