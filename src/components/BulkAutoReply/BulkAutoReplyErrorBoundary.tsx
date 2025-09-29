import React from "react";
import { ErrorBoundary } from "../ErrorBoundary";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface BulkAutoReplyErrorBoundaryProps {
  children: React.ReactNode;
}

const BulkAutoReplyFallback = () => {
  const navigate = useNavigate();
  const { t } = useI18nNamespace("BulkAutoReply/bulkAutoReplyErrorBoundary");
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md">
        <CardContent className="p-6 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("title")}</h3>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/main-dashboard")}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t("backToDashboard")}
            </Button>
            <Button onClick={() => window.location.reload()} className="flex-1">
              {t("refreshPage")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const BulkAutoReplyErrorBoundary: React.FC<
  BulkAutoReplyErrorBoundaryProps
> = ({ children }) => {
  return (
    <ErrorBoundary fallback={<BulkAutoReplyFallback />}>
      {children}
    </ErrorBoundary>
  );
};
