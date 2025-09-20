import React from "react";
import { Card, CardContent } from "../ui/card";
import { Building, X, User, Check } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface StatisticsCardsProps {
  totalListings: number;
  activeListings: number;
  inactiveListings: number;
}

export const ListingStatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalListings,
  activeListings,
  inactiveListings,
}) => {
  const { t } = useI18nNamespace("Settings/listingStatisticsCards");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalListings}
              </p>
              <p className="text-sm text-gray-600">
                {t("listingStatisticsCards.totalListings")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activeListings}
              </p>
              <p className="text-sm text-gray-600">
                {t("listingStatisticsCards.activeListings")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {inactiveListings}
              </p>
              <p className="text-sm text-gray-600">
                {t("listingStatisticsCards.inactiveListings")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
