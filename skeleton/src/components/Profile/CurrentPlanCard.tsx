import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, AlertTriangle, Calendar, Crown } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const CurrentPlanCard: React.FC = () => {
  const { profileData, isLoading } = useProfile();
  const { t } = useI18nNamespace("Profile/currentPlan");

  if (isLoading || !profileData) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const planExpDate = new Date(profileData.planExpDate);
  const currentDate = new Date();
  const isExpired = planExpDate < currentDate;
  const planName = profileData.planName;
  const formattedExpDate = planExpDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            {t("card.title")}
          </CardTitle>
          <Badge
            variant={isExpired ? "destructive" : "default"}
            className={`${
              isExpired
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : "bg-green-100 text-green-800 hover:bg-green-100"
            }`}
          >
            {isExpired ? (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {t("card.expired")}
              </>
            ) : (
              <>
                <Check className="w-3 h-3 mr-1" />
                {t("card.active")}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t("card.planLabel", { planName })}
            {/* {planName} Plan */}
          </h3>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {t("card.expiresOn", { date: formattedExpDate })}
              {/* Expires on {formattedExpDate} */}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="px-8 border-blue-200 text-blue-600 hover:bg-blue-50"
            size="lg"
          >
            {t("card.manage")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
