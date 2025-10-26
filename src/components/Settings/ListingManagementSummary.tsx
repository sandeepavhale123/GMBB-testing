import React from "react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ListingManagementSummaryProps {
  listingsCount: number;
  totalListings: number;
}

export const ListingManagementSummary: React.FC<
  ListingManagementSummaryProps
> = ({ listingsCount, totalListings }) => {
  const { t } = useI18nNamespace("Settings/listingManagementSummary");
  return (
    <div className="mt-4 text-sm text-gray-600">
      {t("listingManagementSummary.showingListings", {
        listingsCount,
        totalListings,
      })}
      {/* Showing {listingsCount} of {totalListings} listings */}
    </div>
  );
};
