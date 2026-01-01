import React from "react";
import { Search } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ListingManagementEmptyProps {
  hasSearchTerm: boolean;
  searchTerm: string;
}

export const ListingManagementEmpty: React.FC<ListingManagementEmptyProps> = ({
  hasSearchTerm,
  searchTerm,
}) => {
  const { t } = useI18nNamespace("Settings/listingManagementEmpty");
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center mb-6">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("listingManagementEmpty.title")}
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          {hasSearchTerm
            ? t("listingManagementEmpty.searchMessage", { searchTerm })
            : // `No listings match "${searchTerm}". Try a different search term.`
              t("listingManagementEmpty.filterMessage")}
        </p>
      </div>
    </div>
  );
};
