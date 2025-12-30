import React from "react";
import { AlertCircle } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ListingManagementSearchErrorProps {
  hasSearchTerm: boolean;
  searchTerm: string;
  hasFilters: boolean;
}

export const ListingManagementSearchError: React.FC<
  ListingManagementSearchErrorProps
> = ({ hasSearchTerm, searchTerm, hasFilters }) => {
  const { t } = useI18nNamespace("Settings/listingManagementSearchError");
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
      <div>
        <p className="text-yellow-800 text-sm">
          {hasSearchTerm
            ? t("listingManagementSearchError.noListingsWithSearchTerm", {
                searchTerm,
              })
            : hasFilters
            ? t("listingManagementSearchError.noListingsWithFilters")
            : t("listingManagementSearchError.noListingsFound")}
        </p>
      </div>
    </div>
  );
};
