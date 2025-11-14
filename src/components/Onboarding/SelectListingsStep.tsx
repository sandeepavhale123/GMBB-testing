import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Star, Clock, Loader2, Search } from "lucide-react";
import { useOnboarding } from "@/store/slices/onboarding/useOnboarding";
import { enableDisableListings } from "@/api/listingApi";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

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
  const { t } = useI18nNamespace("Onboarding/selectListingsStep");
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mock business listings data
  const listings = googleBusinessData?.locations || [];
  const allowedListings = googleBusinessData?.allowedListing || 0;

  // Filter listings based on search term
  const filteredListings = listings.filter(
    (listing) =>
      listing.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ⏩ Skip step if no listings found
  useEffect(() => {
    if (Array.isArray(listings) && listings.length === 0) {
      goToStep(3); // or call goToStep(4) if that's directly available
    }
  }, [listings]);

  // Calculate selected listings based on isActive field
  const selectedCount = listings.filter((listing) =>
    Number(listing.isActive)
  ).length;
  const allSelected = selectedCount === listings.length && listings.length > 0;
  const remainingAllowed = allowedListings - selectedCount;

  const handleListingToggle = (
    listingId: string,
    isCurrentlySelected: boolean
  ) => {
    if (!isCurrentlySelected && selectedCount >= allowedListings) {
      toast({
        title: t("selectListingsStep.limitReachedTitle"),
        description: t("selectListingsStep.limitReachedDescription", {
          count: allowedListings,
        }),
        //  `According to your plan you have allowed ${allowedListings} listings.`,
        variant: "destructive",
      });
      return;
    }
    toggleListingSelection(listingId);
  };

  const handleSelectAll = () => {
    const numUnselected = listings.filter((l) => !Number(l.isActive)).length;
    if (!allSelected && numUnselected > remainingAllowed) {
      toast({
        title: t("selectListingsStep.limitReachedTitle"),
        description: t("selectListingsStep.limitReachedRemaining", {
          count: remainingAllowed,
        }),
        // `You can only select ${remainingAllowed} more listing(s).`,
        variant: "destructive",
      });
      return;
    }
    setAllListingsSelection(!allSelected);
  };

  const handleNext = async () => {
    try {
      setIsConnecting(true);

      // Get selected listing IDs and convert to numbers
      const selectedListingIds = listings
        .filter((listing) => Number(listing.isActive))
        .map((listing) => parseInt(listing.id, 10));

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

      // Make API call
      const response = await enableDisableListings(payload);

      if (response) {
        toast({
          title: t("selectListingsStep.successTitle"),
          description: t("selectListingsStep.successDescription", {
            count: selectedListingIds.length,
            plural: selectedListingIds.length > 1 ? "s" : "",
          }),

          // `${selectedListingIds.length} listing${
          //   selectedListingIds.length > 1 ? "s" : ""
          // } connected successfully`,
        });

        // Update formData with selected listing IDs for persistence
        updateFormData({ selectedListings: selectedListingIds.map(String) });
        onNext();
      } else {
        throw new Error(response.message || "Failed to connect listings");
      }
    } catch (error) {
      // console.error("Error connecting listings:", error);
      toast({
        variant: "destructive",
        title: t("selectListingsStep.connectionFailedTitle"),
        description:
          error instanceof Error
            ? (error as any).response?.data?.message || error.message
            : t("selectListingsStep.connectionFailedDescription"),
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("selectListingsStep.title")}
        </h2>
        <p className="text-gray-600">{t("selectListingsStep.subtitle")}</p>

        {googleBusinessData && (
          <p className="text-sm text-blue-600 mt-2">
            {t("selectListingsStep.connectedTo", {
              email: googleBusinessData.profileEmail,
            })}
            {/* Connected to {googleBusinessData.profileEmail} */}
          </p>
        )}

        <p className="text-sm text-gray-500 mt-1">
          {t("selectListingsStep.allowedToSelect", {
            count: remainingAllowed,
            plural: allowedListings > 1 ? "s" : "",
          })}
          {/* Allowed to select: {remainingAllowed} listing
          {allowedListings > 1 ? "s" : ""} */}
        </p>
      </div>

      <div className="mb-6">
        {/* Single row with Found listings, Search, and Select All */}
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
            {t("selectListingsStep.foundListings", {
              count: listings.length,
              plural: listings.length !== 1 ? "s" : "",
            })}
            {/* Found {listings.length} business listing
            {listings.length !== 1 ? "s" : ""} */}
          </h3>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t("selectListingsStep.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleSelectAll}
            className="text-sm whitespace-nowrap"
          >
            {allSelected
              ? t("selectListingsStep.deselectAll")
              : t("selectListingsStep.selectAll")}
          </Button>
        </div>
      </div>

      {/* Scrollable Listings Container */}
      <ScrollArea className="h-96 mb-8 border rounded-lg">
        <div className="space-y-4 p-4">
          {filteredListings.map((listing) => {
            const isSelected = Number(listing.isActive) === 1;

            return (
              <Card
                key={listing.id}
                className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleListingToggle(listing.id, isSelected)}
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
                          String(listing.isVerified) === "1"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {String(listing.isVerified) === "1"
                          ? t("selectListingsStep.verified")
                          : t("selectListingsStep.notVerified")}
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
          })}

          {filteredListings.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              {t("selectListingsStep.noListingsFound", { term: searchTerm })}
              {/* No listings found matching "{searchTerm}" */}
            </div>
          )}
        </div>
      </ScrollArea>

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
              {t("selectListingsStep.connecting")}
            </>
          ) : selectedCount === 0 ? (
            t("selectListingsStep.selectToContinue")
          ) : (
            t("selectListingsStep.connectButton", {
              count: selectedCount,
              plural: selectedCount !== 1 ? "s" : "",
            })
            // `Connect with ${selectedCount} listing${
            //   selectedCount !== 1 ? "s" : ""
            // }`
          )}
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          {t("selectListingsStep.supportText")}
          <a
            href="https://support.gmbbriefcase.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {t("selectListingsStep.contactSupport")}
          </a>
        </p>
      </div>
    </div>
  );
};

export default SelectListingsStep;
