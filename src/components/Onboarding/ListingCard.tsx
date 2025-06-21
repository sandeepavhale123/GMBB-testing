
import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock } from "lucide-react";
import { GoogleBusinessListing } from "@/store/slices/onboarding/onboardingSlice";

interface ListingCardProps {
  listing: GoogleBusinessListing;
  isSelected: boolean;
  onToggle: (listingId: string) => void;
}

const ListingCard = ({ listing, isSelected, onToggle }: ListingCardProps) => {
  return (
    <Card
      key={listing.id}
      className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onToggle(listing.id)}
    >
      <div className="flex items-start gap-4">
        <Checkbox checked={isSelected} className="mt-1" />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">
                {listing.locationName}
              </h4>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{listing.address}</span>
                <span className="text-sm">{listing.state}</span>
                <span className="text-sm">{listing.zipcode}</span>
                <span className="text-sm">{listing.country}</span>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                listing.isVerified === 1
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {listing.isVerified === 1 ? "Verified" : "Not-Verified"}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{listing.category}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ListingCard;
