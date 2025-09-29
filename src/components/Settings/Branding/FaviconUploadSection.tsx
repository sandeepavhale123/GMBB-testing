import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Upload, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface FaviconUploadSectionProps {
  faviconFile: File | null;
  onFaviconChange: (file: File | null) => void;
}

export const FaviconUploadSection: React.FC<FaviconUploadSectionProps> = ({
  faviconFile,
  onFaviconChange,
}) => {
  const { t } = useI18nNamespace("Branding/faviconUpload");
  const { toast } = useToast();

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast({
          title: t("faviconUpload.fileTooLargeTitle"),
          description: t("faviconUpload.fileTooLargeDescription"),
          variant: "destructive",
        });
        return;
      }
      onFaviconChange(file);
      toast({
        title: t("faviconUpload.fileSelectedTitle"),
        description: t("faviconUpload.fileSelectedDescription", {
          fileName: file.name,
        }),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          {t("faviconUpload.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
            {faviconFile ? (
              <img
                src={URL.createObjectURL(faviconFile)}
                alt="Favicon preview"
                className="w-full h-full object-contain rounded"
              />
            ) : (
              <Settings className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <Label
              htmlFor="favicon-upload"
              className="text-sm font-medium text-gray-700"
            >
              {t("faviconUpload.uploadLabel")}
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              {t("faviconUpload.uploadDescription")}
            </p>
            <input
              id="favicon-upload"
              type="file"
              accept="image/*"
              onChange={handleFaviconUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => document.getElementById("favicon-upload")?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              {t("faviconUpload.chooseFile")}
            </Button>
          </div>
        </div>
        {faviconFile && (
          <div className="text-sm text-gray-600">
            {t("faviconUpload.selectedFile", { fileName: faviconFile.name })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
