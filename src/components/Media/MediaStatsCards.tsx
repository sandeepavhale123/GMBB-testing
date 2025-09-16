import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface MediaStatsCardsProps {
  totalItems: number;
  currentPageItems: number;
  isLoading?: boolean;
}

export const MediaStatsCards: React.FC<MediaStatsCardsProps> = ({
  totalItems,
  currentPageItems,
  isLoading = false,
}) => {
  const { t } = useI18nNamespace("Media/mediaPreview");
  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-16 mb-1" />
            </div>
            <hr />
            <div>
              <Skeleton className="h-5 w-44 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-md text-black mb-2">
            {t("mediaStatsCards.totalMediaUploaded")}
          </h3>
        </div>
        <div className="space-y-6">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {totalItems}
            </div>
          </div>
          <hr />
          <div>
            <div className="text-md text-black mb-2">
              {t("mediaStatsCards.lastWeekUploadedImage")}
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {currentPageItems}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
