import React from "react";
import { Sparkles, Zap } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const GenieSubscriptionPage: React.FC = () => {
  const { t } = useI18nNamespace("Settings/genieSubscriptionPage");
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t("genieSubscriptionPage.title")}
            </h2>

            <p className="text-gray-600 mb-6">
              {t("genieSubscriptionPage.subtitle")}
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-purple-700">
                <Zap className="h-5 w-5" />
                <span className="font-medium">
                  {t("genieSubscriptionPage.comingSoon")}
                </span>
              </div>
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              <p>{t("genieSubscriptionPage.features.aiContent")}</p>
              <p>{t("genieSubscriptionPage.features.analytics")}</p>
              <p>{t("genieSubscriptionPage.features.seo")}</p>
              <p>{t("genieSubscriptionPage.features.smartResponses")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
