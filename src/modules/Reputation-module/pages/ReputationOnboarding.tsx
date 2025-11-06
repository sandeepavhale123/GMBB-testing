import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { useAppSelector } from "@/hooks/useRedux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Listing {
  id: number;
  name: string;
  zipCode: string;
}

const mockListings: Listing[] = [
  { id: 1, name: "webmart", zipCode: "431100" },
  { id: 2, name: "Citationbuilderpro", zipCode: "431100" },
  { id: 3, name: "Aj tiffin service", zipCode: "431105" },
  { id: 4, name: "Aj tiffin service", zipCode: "431120" },
  { id: 5, name: "The Coffee House", zipCode: "431110" },
  { id: 6, name: "Green Valley Restaurant", zipCode: "431115" },
  { id: 7, name: "Tech Solutions Inc", zipCode: "431102" },
  { id: 8, name: "Sunshine Bakery", zipCode: "431108" },
  { id: 9, name: "Prime Fitness Center", zipCode: "431112" },
  { id: 10, name: "Beauty Salon & Spa", zipCode: "431118" },
  { id: 11, name: "Quick Auto Repair", zipCode: "431103" },
  { id: 12, name: "Fresh Market Grocery", zipCode: "431125" },
  { id: 13, name: "Digital Marketing Hub", zipCode: "431107" },
  { id: 14, name: "Pet Care Clinic", zipCode: "431130" },
  { id: 15, name: "Urban Fashion Boutique", zipCode: "431113" },
  { id: 16, name: "Home Decor Studio", zipCode: "431122" },
  { id: 17, name: "Elite Dental Care", zipCode: "431109" },
  { id: 18, name: "Mountain View Hotel", zipCode: "431135" },
];

export const ReputationOnboarding: React.FC = () => {
  const { t } = useI18nNamespace("Reputation/reputationOnboarding");
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme);
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = () => {
    if (selectedListings.length === mockListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(mockListings.map((listing) => listing.id));
    }
  };

  const handleListingToggle = (id: number) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((listingId) => listingId !== id) : [...prev, id]
    );
  };

  const handleImportListings = () => {
    navigate("/module/reputation");
  };

  const handleAddGoogleAccount = () => {
    navigate("/module/reputation");
  };

  const filteredListings = mockListings.filter((listing) =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.zipCode.includes(searchQuery)
  );

  return (
    <div>
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg mt-5">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 items-center">
            <div>
              <h1 className="text-2xl md:text-3xl  font-bold mb-2">
                {t("header.title")}
              </h1>
              <p className="text-blue-50 text-base md:text-md leading-relaxed">
                {t("header.description")}
              </p>
            </div>
            <div className="hidden lg:block mt-[-50px]">
              <img
                src="/lovable-uploads/6.png"
                alt="Reputation Management"
                className="w-[250px]"
              />
            </div>
          </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Import Existing Listings Card */}
            <Card className="border-border lg:col-span-7 ">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t("importListings.title")}
                </CardTitle>
                <CardDescription className="text-base">
                  {t("importListings.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search listings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-primary hover:underline font-medium whitespace-nowrap"
                  >
                    {t("importListings.selectAll")}
                  </button>
                </div>

                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {filteredListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        id={`listing-${listing.id}`}
                        checked={selectedListings.includes(listing.id)}
                        onCheckedChange={() => handleListingToggle(listing.id)}
                      />
                      <label
                        htmlFor={`listing-${listing.id}`}
                        className="flex-1 text-sm font-medium cursor-pointer"
                      >
                        {listing.name} - {listing.zipCode}
                      </label>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleImportListings}
                  disabled={selectedListings.length === 0}
                  className=" mt-6"
                  size="lg"
                >
                  {t("importListings.importButton")}
                </Button>
              </CardContent>
            </Card>

            {/* Add New Listing Card */}
            <Card className="border-border lg:col-span-5 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t("addListing.title")}
                </CardTitle>
                <CardDescription className="text-base">
                   <p className="text-muted-foreground text-base leading-relaxed mb-4">
                    Click the button below to add your Google My Business (GMB) listing and start managing your reviews, ratings, and reputation all in one place
                  </p>
                    <Button
                  onClick={handleAddGoogleAccount}
                  className=""
                  size="lg"
                  variant="default"
                >
                  {t("addListing.button")}
                </Button>
                </CardDescription>
              </CardHeader>
              
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
