
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GoogleBusinessListing } from "@/store/slices/onboarding/onboardingSlice";
import ListingCard from "./ListingCard";

interface ListingsContainerProps {
  filteredListings: GoogleBusinessListing[];
  searchTerm: string;
  onListingToggle: (listingId: string) => void;
}

const ListingsContainer = ({
  filteredListings,
  searchTerm,
  onListingToggle,
}: ListingsContainerProps) => {
  return (
    <ScrollArea className="h-96 mb-8 border rounded-lg">
      <div className="space-y-4 p-4">
        {filteredListings.map((listing) => {
          const isSelected = Number(listing.isActive) === 1;

          return (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSelected={isSelected}
              onToggle={onListingToggle}
            />
          );
        })}

        {filteredListings.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No listings found matching "{searchTerm}"
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ListingsContainer;
