import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { X, Star } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface SimpleCompetitor {
  position: number;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  isUserBusiness?: boolean;
}

interface SimpleGeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  gpsCoordinates: string;
  competitors: SimpleCompetitor[];
  userBusinessName?: string;
}

export const SimpleGeoModal: React.FC<SimpleGeoModalProps> = ({
  isOpen,
  onClose,
  gpsCoordinates,
  competitors,
  userBusinessName,
}) => {
  const { t } = useI18nNamespace("GeoRanking/simpleGeoModal");
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] bg-white">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {t("modal.title")}
            </h3>
            <span className="text-xs text-gray-600 break-all">
              {gpsCoordinates}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {competitors.map((competitor) => (
              <div
                key={`${competitor.position}-${competitor.name}`}
                className={`p-4 border-b border-gray-100 last:border-b-0 ${
                  competitor.isUserBusiness ||
                  competitor.name === userBusinessName
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                      competitor.isUserBusiness ||
                      competitor.name === userBusinessName
                        ? "bg-blue-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {competitor.position}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {competitor.name}
                      </h4>
                      {(competitor.isUserBusiness ||
                        competitor.name === userBusinessName) && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                          {t("modal.you")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {competitor.address}
                    </p>

                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {renderStars(competitor.rating)}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">
                        {competitor.rating} ({competitor.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
