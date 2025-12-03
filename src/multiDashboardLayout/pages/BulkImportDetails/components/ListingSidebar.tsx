import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useDebounce } from "@/hooks/useDebounce";
import type { BulkListing } from "@/api/csvApi";

interface ListingSidebarProps {
  listings: BulkListing[];
  loading: boolean;
  error: string | null;
  noListingsFound: boolean;
  selectedListingId: string | null;
  onSearch: (query: string) => void;
  onListingSelect: (id: string) => void;
}

export const ListingSidebar: React.FC<ListingSidebarProps> = React.memo(
  ({ listings, loading, error, noListingsFound, selectedListingId, onSearch, onListingSelect }) => {
    const { t } = useI18nNamespace("MultidashboardPages/bulkImportDetails");

    // Local state for immediate UI feedback.
    const [searchQuery, setSearchQuery] = useState("");

    // Debounce the search value by 300ms
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Only call onSearch when debounced value changes
    useEffect(() => {
      onSearch(debouncedSearchQuery);
    }, [debouncedSearchQuery, onSearch]);

    // Handle input change - only update local state (no API call)
    const handleSearchChange = useCallback((value: string) => {
      setSearchQuery(value);
    }, []);

    if (error) {
      return (
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium text-destructive">
              {t("bulkImportDetails.listingSidebar.errorLoading")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium">
            {t("bulkImportDetails.listingSidebar.selectedCount", {
              count: listings.length,
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("bulkImportDetails.listingSidebar.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {noListingsFound ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                {t("bulkImportDetails.listingSidebar.noListingsFound")}
              </div>
            ) : (
              <>
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    onClick={() => onListingSelect(listing.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedListingId === listing.id
                        ? "bg-success/10 border-success text-success"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="font-medium text-sm break-words">{listing.listing_name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t("bulkImportDetails.listingSidebar.zipCode", {
                        zip: listing.zipcode,
                      })}
                    </div>
                  </div>
                ))}
                {listings.length === 0 && !loading && (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    {t("bulkImportDetails.listingSidebar.noListings")}
                  </div>
                )}
                {loading && (
                  <div className="text-center py-4 text-muted-foreground text-sm flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("bulkImportDetails.listingSidebar.loading")}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

ListingSidebar.displayName = "ListingSidebar";
