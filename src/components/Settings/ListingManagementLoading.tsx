import React from "react";
import { Skeleton } from "../ui/skeleton";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ListingManagementLoading: React.FC = () => {
  const { t } = useI18nNamespace("Settings/listingManagementLoading");
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t("listingManagementLoading.pageTitle")}
        </h2>
      </div>

      {/* Statistics Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>

      {/* Search and Filters Loading */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-full sm:w-48" />
      </div>

      {/* Table Loading */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};
