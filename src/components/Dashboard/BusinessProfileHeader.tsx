import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { MapPin, Eye, FileBarChart } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { useListingContext } from "@/context/ListingContext";
import { OverviewData } from "../../api/overviewApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface BusinessProfileHeaderProps {
  overviewData?: OverviewData | null;
}

export const BusinessProfileHeader: React.FC<BusinessProfileHeaderProps> = ({
  overviewData,
}) => {
  const { t } = useI18nNamespace("Dashboard/businessProfileHeader"); // ✅ use namespace
  const navigate = useNavigate();
  const { selectedListing } = useListingContext();
  const { profileData } = useProfile();
  const listingName = selectedListing?.name || "";
  const listingAddress = selectedListing?.address || "";

  // Get user's first name for greeting
  const userFirstName = profileData?.first_name || "User";

  // Dynamic greeting based on time
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("morning");
    if (hour < 17) return t("afternoon");
    return t("evening");
  };

  // Button click handlers
  const handleEditInfo = () => {
    if (overviewData?.placeId) {
      window.open(
        `https://business.google.com/dashboard/l/${overviewData.placeId}`,
        "_blank"
      );
    } else {
      // console.warn("Edit Info - No placeId available:", overviewData);
    }
  };

  const handleViewOnGoogle = () => {
    if (overviewData?.placeId) {
      window.open(
        `https://www.google.com/maps/place/?q=place_id:${overviewData.placeId}`,
        "_blank"
      );
    }
  };

  const handleViewReports = () => {
    if (selectedListing?.id) {
      navigate(`/reports/${selectedListing.id}`);
    }
  };
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Business Overview Card - Responsive */}
      <Card
        className="text-white border-0"
        style={{
          background:
            "linear-gradient(to bottom right, hsl(var(--primary-gradient-from)), hsl(262 83% 58%))",
        }}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
            <div className="flex-1">
              <div className="mb-3 sm:mb-4">
                <div className="text-xs sm:text-sm text-purple-200 mb-1">
                  {t("businessOverview")}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {getTimeBasedGreeting()}, {userFirstName} 👋
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-purple-100 mb-2">
                  {t("summaryFor", { listingName })}
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-200" />
                  <span className="text-purple-100">{listingAddress}</span>
                </div>
              </div>
            </div>

            {/* Action buttons - Responsive */}
            <div className="flex flex-col gap-2 sm:gap-3 lg:mt-1">
              {/* Verified status */}
              <div className="flex items-center justify-end gap-2 text-xs sm:text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedListing?.isVerified === "1"
                      ? "bg-green-400"
                      : "bg-yellow-400"
                  }`}
                ></div>
                <span className="text-purple-100">
                  {selectedListing?.isVerified === "1"
                    ? t("verified")
                    : t("pending")}
                </span>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-0 flex-1 sm:flex-none text-xs sm:text-sm"
                  onClick={handleViewOnGoogle}
                  disabled={!overviewData?.placeId}
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t("viewOnGoogle")}</span>
                  <span className="sm:hidden">{t("view")}</span>
                </Button>
                <Button
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 flex-1 sm:flex-none text-xs sm:text-sm"
                  onClick={handleViewReports}
                >
                  <FileBarChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t("viewReports")} </span>
                  <span className="sm:hidden">{t("reports")} </span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
