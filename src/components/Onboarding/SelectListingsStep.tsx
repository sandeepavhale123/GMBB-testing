import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { MapPin, Star, Clock, Loader2 } from "lucide-react";
import { useOnboarding } from "@/store/slices/onboarding/useOnboarding";
import { enableDisableListings } from "@/api/listingApi";
import { useToast } from "@/hooks/use-toast";
interface SelectListingsStepProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: () => void;
}

const SelectListingsStep = ({
  formData,
  updateFormData,
  onNext,
}: SelectListingsStepProps) => {
  const {
    googleBusinessData,
    toggleListingSelection,
    setAllListingsSelection,
    goToStep,
  } = useOnboarding();

  console.log("googlebusinessdata", googleBusinessData);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  // const [selectedListings, setSelectedListings] = useState(
  //   formData.selectedListings || []
  // );

  // // Update local state when formData changes (from persistence)
  // useEffect(() => {
  //   setSelectedListings(formData.selectedListings || []);
  // }, [formData.selectedListings]);

  // Mock business listings data
  const listings = googleBusinessData?.locations || [];

  // ⏩ Skip step if no listings found
  useEffect(() => {
    if (Array.isArray(listings) && listings.length === 0) {
      console.log("No listings found, skipping to next step...");
      goToStep(3); // or call goToStep(4) if that's directly available
    }
  }, [listings]);
  // Calculate selected listings based on isActive field
  const selectedCount = listings.filter((listing) =>
    Number(listing.isActive)
  ).length;
  const allSelected = selectedCount === listings.length && listings.length > 0;

  console.log("selectedCount", selectedCount);
  const handleListingToggle = (listingId: string) => {
    toggleListingSelection(listingId);
  };

  const handleSelectAll = () => {
    setAllListingsSelection(!allSelected);
  };

  const handleNext = async () => {
    try {
      setIsConnecting(true);

      // Get selected listing IDs and convert to numbers
      const selectedListingIds = listings
        .filter((listing) => Number(listing.isActive))
        .map((listing) => parseInt(listing.id, 10));
      console.log("selected listing", selectedListingIds);
      // Get account ID from googleBusinessData
      const accountId = parseInt(googleBusinessData?.accountId || "0", 10);

      if (!accountId) {
        throw new Error("Account ID not found");
      }

      // Prepare API payload
      const payload = {
        listingIds: selectedListingIds,
        accountId,
        isActive: 1,
      };

      console.log("Connecting listings with payload:", payload);

      // Make API call
      const response = await enableDisableListings(payload);

      if (response) {
        toast({
          title: "Success",
          description: `${selectedCount} listing${
            selectedCount > 1 ? "s" : ""
          } connected successfully`,
        });

        // Update formData with selected listing IDs for persistence
        updateFormData({ selectedListings: selectedListingIds.map(String) });
        onNext();
      } else {
        throw new Error(response.message || "Failed to connect listings");
      }
    } catch (error) {
      console.error("Error connecting listings:", error);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description:
          error instanceof Error
            ? (error as any).response?.data?.message || error.message
            : "Failed to connect listings. Please try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select your business listings
        </h2>
        <p className="text-gray-600">
          Choose which Google Business Profile listings you'd like to manage
          with GMB Briefcase
        </p>

        {googleBusinessData && (
          <p className="text-sm text-blue-600 mt-2">
            Connected to {googleBusinessData.profileEmail} • Account ID:{" "}
            {googleBusinessData.accountId}
          </p>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Found {listings.length} business listings
          </h3>
          <Button
            variant="outline"
            onClick={handleSelectAll}
            className="text-sm"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {listings.map((listing) => {
          const isSelected = Number(listing.isActive) === 1;

          return (
            <Card
              key={listing.id}
              className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleListingToggle(listing.id)}
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
                    {/* <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{listing.rating}</span>
                      <span>({listing.reviewCount} reviews)</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{listing.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button
          onClick={handleNext}
          disabled={selectedCount === 0 || isConnecting}
          className="px-8 py-3 text-base"
          size="lg"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            `Connect with ${selectedCount} listing`
          )}
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Don't see your business? You can{" "}
          <a href="#" className="text-blue-600 hover:underline">
            add it manually
          </a>{" "}
          or{" "}
          <a href="#" className="text-blue-600 hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default SelectListingsStep;
