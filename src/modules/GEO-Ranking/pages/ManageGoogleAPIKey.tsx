import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Key,
  CheckCircle,
  XCircle,
  ExternalLink,
  Info,
  Trash2,
} from "lucide-react";
import { useGoogleApiKey } from "../hooks/useGoogleApiKey";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ManageGoogleAPIKey: React.FC = () => {
  const { t } = useI18nNamespace("Geo-Ranking-module-pages/ManageGoogleAPIKey");
  const {
    apiKeyData,
    isLoading,
    saveApiKey,
    deleteApiKey,
    isSaving,
    isDeleting,
  } = useGoogleApiKey();
  const [apiKeyInput, setApiKeyInput] = useState("");
  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      saveApiKey(apiKeyInput.trim());
      setApiKeyInput("");
    }
  };
  const handleDeleteApiKey = () => {
    deleteApiKey();
  };
  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + "***************" + key.slice(-3);
  };
  return (
    <div className=" mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("manageApiKey.pageTitle")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("manageApiKey.pageDescription")}
        </p>
      </div>

      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t("manageApiKey.infoAlert.description")}
          <a
            href="https://developers.google.com/places/web-service/get-api-key"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center ml-2 text-primary hover:underline"
          >
            {t("manageApiKey.infoAlert.getKey")}{" "}
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      ) : apiKeyData ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("manageApiKey.status.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-col sm:flex-row justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">
                      {t("manageApiKey.status.configured")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("manageApiKey.status.keyLabel")}:{" "}
                      <code className="bg-background px-2 py-1 rounded text-xs">
                        {maskApiKey(apiKeyData.apiKey)}
                      </code>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-green-500">
                    {t("manageApiKey.status.active")}
                  </Badge>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {isDeleting
                          ? t("manageApiKey.status.deleting")
                          : t("manageApiKey.status.delete")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("manageApiKey.status.deleteTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("manageApiKey.status.deleteDescription")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t("manageApiKey.status.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteApiKey}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t("manageApiKey.status.confirmDelete")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}

      {/* API Key Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            {t("manageApiKey.config.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-key">{t("manageApiKey.config.label")}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="api-key"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={t("manageApiKey.config.placeholder")}
                className="flex-1"
              />
              <Button
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim() || isSaving}
              >
                {isSaving
                  ? t("manageApiKey.config.saving")
                  : apiKeyData
                  ? t("manageApiKey.config.update")
                  : t("manageApiKey.config.add")}
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-2">
              {t("manageApiKey.instructions.title")}
            </p>
            <ol className="space-y-1">
              <li>{t("manageApiKey.instructions.step1")}</li>
              <li>
                {t("manageApiKey.instructions.step2_p1")}
                <a
                  href="https://console.cloud.google.com/projectselector2/google/maps-apis/overview?pli=1&supportedpurview=project"
                  target="_blank"
                  className="text-primary"
                >
                  {t("manageApiKey.instructions.step2_p2")}
                </a>
              </li>
              <li>{t("manageApiKey.instructions.step3")}</li>
              <li>{t("manageApiKey.instructions.step4")}</li>
              <li>{t("manageApiKey.instructions.step5")}</li>
              <li>{t("manageApiKey.instructions.step6")}</li>
              <li>{t("manageApiKey.instructions.step7")}</li>
              <li>{t("manageApiKey.instructions.step8")}</li>
              <li>{t("manageApiKey.instructions.step9")}</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
