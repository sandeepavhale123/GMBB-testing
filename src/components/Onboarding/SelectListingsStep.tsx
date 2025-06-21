
import React, { useEffect, useState } from "react";
import { useOnboarding } from "@/store/slices/onboarding/useOnboarding";
import { enableDisableListings } from "@/api/listingApi";
import { useToast } from "@/hooks/use-toast";
import ListingsHeader from "./ListingsHeader";
import ListingsContainer from "./ListingsContainer";
import ConnectButton from "./ConnectButton";

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
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock business listings data
  const listings = googleBusinessData?.locations || [];

  // Filter listings based on search term
  const filteredListings = listings.filter((listing) =>
    listing.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Connected to {googleBusinessData.profileEmail}
          </p>
        )}
      </div>

      <ListingsHeader
        listingsCount={listings.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        allSelected={allSelected}
        onSelectAll={handleSelectAll}
      />

      <ListingsContainer
        filteredListings={filteredListings}
        searchTerm={searchTerm}
        onListingToggle={handleListingToggle}
      />

      <ConnectButton
        selectedCount={selectedCount}
        isConnecting={isConnecting}
        onConnect={handleNext}
      />

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Don't see your business? You can{" "}
          <a 
            href="https://support.gmbbriefcase.com/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default SelectListingsStep;
