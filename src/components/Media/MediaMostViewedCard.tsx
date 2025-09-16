import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface LastUpdatedImage {
  views: number;
  url: string;
  uploadDate: string;
  category: string;
  status: string;
}
interface MediaMostViewedCardProps {
  lastUpdatedImage: LastUpdatedImage | null;
  onViewImage: (imageData: LastUpdatedImage) => void;
  isLoading?: boolean;
}
export const MediaMostViewedCard: React.FC<MediaMostViewedCardProps> = ({
  lastUpdatedImage,
  onViewImage,
  isLoading = false,
}) => {
  const { t } = useI18nNamespace("Media/mediaMostViewedCard");
  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <div className="mb-4">
                <Skeleton className="h-8 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="col-span-5">
              <Skeleton className="aspect-square rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!lastUpdatedImage) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {t("mediaMostViewedCard.title")}
            </h3>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500"> {t("mediaMostViewedCard.empty")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {t("mediaMostViewedCard.title")}
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <div className="mb-4">
              <div className="text-md text-gray-500">
                {lastUpdatedImage.category}
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              className="bg-gray-800 text-white hover:bg-gray-700 px-6"
              onClick={() => onViewImage(lastUpdatedImage)}
            >
              {t("mediaMostViewedCard.viewButton")}
            </Button>
          </div>

          <div className="col-span-5">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={lastUpdatedImage.url}
                alt={lastUpdatedImage.category}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
