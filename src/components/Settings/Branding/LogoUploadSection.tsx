import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Upload, Image, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface LogoUploadSectionProps {
  lightLogoFile: File | null;
  darkLogoFile: File | null;
  onLightLogoChange: (file: File | null) => void;
  onDarkLogoChange: (file: File | null) => void;
}

export const LogoUploadSection: React.FC<LogoUploadSectionProps> = ({
  lightLogoFile,
  darkLogoFile,
  onLightLogoChange,
  onDarkLogoChange,
}) => {
  const { t } = useI18nNamespace("Branding/logoUploadSection");
  const { toast } = useToast();

  const handleLogoUpload =
    (type: "light" | "dark") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: t("logoUpload.toast.fileTooLargeTitle"),
            description: t("logoUpload.toast.fileTooLargeDescription"),
            variant: "destructive",
          });
          return;
        }

        if (type === "light") {
          onLightLogoChange(file);
        } else {
          onDarkLogoChange(file);
        }

        toast({
          title: t(
            type === "light"
              ? "logoUpload.toast.lightLogoSelectedTitle"
              : "logoUpload.toast.darkLogoSelectedTitle"
          ),
          description: t("logoUpload.toast.fileSelectedDescription", {
            fileName: file.name,
          }),
        });
      }
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          {t("logoUpload.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Light Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Label className="text-sm font-medium text-gray-700">
                {t("logoUpload.lightLogo.label")}
              </Label>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white">
                {lightLogoFile ? (
                  <img
                    src={URL.createObjectURL(lightLogoFile)}
                    alt="Light logo preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  {t("logoUpload.lightLogo.description")}
                </p>
                <input
                  id="light-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload("light")}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("light-logo-upload")?.click()
                  }
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {t("logoUpload.lightLogo.chooseButton")}
                </Button>
                {lightLogoFile && (
                  <div className="text-sm text-gray-600 mt-2">
                    {t("logoUpload.lightLogo.selectedFile", {
                      fileName: lightLogoFile.name,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dark Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-500" />
              <Label className="text-sm font-medium text-gray-700">
                {t("logoUpload.darkLogo.label")}
              </Label>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-900">
                {darkLogoFile ? (
                  <img
                    src={URL.createObjectURL(darkLogoFile)}
                    alt="Dark logo preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  {t("logoUpload.darkLogo.description")}
                </p>
                <input
                  id="dark-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload("dark")}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("dark-logo-upload")?.click()
                  }
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  {t("logoUpload.darkLogo.chooseButton")}
                </Button>
                {darkLogoFile && (
                  <div className="text-sm text-gray-600 mt-2">
                    {t("logoUpload.darkLogo.selectedFile", {
                      fileName: lightLogoFile.name,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
