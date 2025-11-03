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
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.bg_color || "hsl(var(--background))" }}
    >
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {t("header.title")}
              </h1>
              <p className="text-blue-50 text-base md:text-lg leading-relaxed">
                {t("header.description")}
              </p>
            </div>
            <div className="hidden lg:flex justify-center">
              <img
                src="/lovable-uploads/bg-img/review-illustration.png"
                alt="Reputation Management"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Import Existing Listings Card */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t("importListings.title")}
                </CardTitle>
                <CardDescription className="text-base">
                  {t("importListings.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-end gap-3 mb-4">
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

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
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
                  className="w-full mt-6"
                  size="lg"
                >
                  {t("importListings.importButton")}
                </Button>
              </CardContent>
            </Card>

            {/* Add New Listing Card */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {t("addListing.title")}
                </CardTitle>
                <CardDescription className="text-base">
                  {t("addListing.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 py-8">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {t("addListing.noWorries")}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {t("addListing.description")}
                  </p>
                </div>

                <Button
                  onClick={handleAddGoogleAccount}
                  className="w-full"
                  size="lg"
                  variant="default"
                >
                  {t("addListing.button")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
