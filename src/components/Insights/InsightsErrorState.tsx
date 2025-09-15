import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface InsightsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const InsightsErrorState: React.FC<InsightsErrorStateProps> = ({
  error,
  onRetry,
}) => {
  const { t } = useI18nNamespace("Insights/insightsErrorState");
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("insightsError.tryAgain")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
