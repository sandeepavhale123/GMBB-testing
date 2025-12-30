import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Upload, Image, Sun, Moon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface EnhancedLogoUploadSectionProps {
  lightLogoFile: File | null;
  darkLogoFile: File | null;
  lightLogoUrl?: string;
  darkLogoUrl?: string;
  onLightLogoChange: (file: File | null) => void;
  onDarkLogoChange: (file: File | null) => void;
}

export const EnhancedLogoUploadSection: React.FC<
  EnhancedLogoUploadSectionProps
> = ({
  lightLogoFile,
  darkLogoFile,
  lightLogoUrl,
  darkLogoUrl,
  onLightLogoChange,
  onDarkLogoChange,
}) => {
  const { t } = useI18nNamespace("Branding/enhancedLogoUploadSection");
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState<"light" | "dark" | null>(null);

  const handleLogoUpload =
    (type: "light" | "dark") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndUpload(file, type);
      }
    };

  const validateAndUpload = (file: File, type: "light" | "dark") => {
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: t(`enhancedLogoUploadSection.${type}Logo.fileTooLarge.title`),
        description: t(
          `enhancedLogoUploadSection.${type}Logo.fileTooLarge.description`
        ),
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: t(`enhancedLogoUploadSection.${type}Logo.invalidFileType.title`),
        description: t(
          `enhancedLogoUploadSection.${type}Logo.invalidFileType.description`
        ),
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
      title: t(`enhancedLogoUploadSection.${type}Logo.uploaded.title`),
      // `${type === "light" ? "Light" : "Dark"} logo uploaded`,
      description: t(
        `enhancedLogoUploadSection.${type}Logo.uploaded.description`,
        { fileName: file.name }
      ),
    });
  };

  const handleDrop = (type: "light" | "dark") => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndUpload(file, type);
    }
  };

  const handleDragOver = (type: "light" | "dark") => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const removeLogo = (type: "light" | "dark") => {
    if (type === "light") {
      onLightLogoChange(null);
    } else {
      onDarkLogoChange(null);
    }

    toast({
      title: t(`enhancedLogoUploadSection.${type}Logo.removed.title`),
      description: t(
        `enhancedLogoUploadSection.${type}Logo.removed.description`
      ),
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Image className="w-5 h-5" />
        {t("enhancedLogoUploadSection.heading")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Light Logo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Label className="text-sm font-medium">
                {t("enhancedLogoUploadSection.lightLogo.label")}
              </Label>
            </div>
            {lightLogoFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLogo("light")}
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div
            className={`w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-white transition-colors ${
              dragOver === "light"
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300"
            }`}
            onDrop={handleDrop("light")}
            onDragOver={handleDragOver("light")}
            onDragLeave={handleDragLeave}
          >
            {lightLogoFile ? (
              <img
                src={URL.createObjectURL(lightLogoFile)}
                alt="Light logo preview"
                className="w-full h-full object-contain rounded-lg p-2"
              />
            ) : lightLogoUrl ? (
              <img
                src={lightLogoUrl}
                alt="Current light logo"
                className="w-full h-full object-contain rounded-lg p-2"
              />
            ) : (
              <div className="text-center">
                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {t("enhancedLogoUploadSection.lightLogo.dropText")}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              {t("enhancedLogoUploadSection.lightLogo.instructions")}
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
              {t("enhancedLogoUploadSection.lightLogo.uploadButton")}
            </Button>
            {lightLogoFile ? (
              <div className="text-sm text-gray-600 mt-2 truncate">
                {t("enhancedLogoUploadSection.lightLogo.fileInfo", {
                  fileName: lightLogoFile.name,
                })}
              </div>
            ) : lightLogoUrl ? (
              <div className="text-sm text-green-600 mt-2">
                {t("enhancedLogoUploadSection.lightLogo.currentLoaded")}
              </div>
            ) : null}
          </div>
        </div>

        {/* Dark Logo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-500" />
              <Label className="text-sm font-medium">
                {t("enhancedLogoUploadSection.darkLogo.label")}
              </Label>
            </div>
            {darkLogoFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLogo("dark")}
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div
            className={`w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
              dragOver === "dark"
                ? "border-blue-400 bg-gray-800"
                : "border-gray-300 bg-gray-900"
            }`}
            style={{
              backgroundImage:
                "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
              backgroundSize: "10px 10px",
              backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
            }}
            onDrop={handleDrop("dark")}
            onDragOver={handleDragOver("dark")}
            onDragLeave={handleDragLeave}
          >
            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
              {darkLogoFile ? (
                <img
                  src={URL.createObjectURL(darkLogoFile)}
                  alt="Dark logo preview"
                  className="w-full h-full object-contain rounded-lg p-2"
                />
              ) : darkLogoUrl ? (
                <img
                  src={darkLogoUrl}
                  alt="Current dark logo"
                  className="w-full h-full object-contain rounded-lg p-2"
                />
              ) : (
                <div className="text-center">
                  <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    {t("enhancedLogoUploadSection.darkLogo.dropText")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              {t("enhancedLogoUploadSection.darkLogo.instructions")}
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
              <Upload className="w-4 h-4 mr-2" />
              {t("enhancedLogoUploadSection.darkLogo.uploadButton")}
            </Button>
            {darkLogoFile ? (
              <div className="text-sm text-gray-600 mt-2 truncate">
                {t("enhancedLogoUploadSection.darkLogo.fileInfo", {
                  fileName: darkLogoFile.name,
                })}
                {/* Selected: {darkLogoFile.name} */}
              </div>
            ) : darkLogoUrl ? (
              <div className="text-sm text-green-600 mt-2">
                {t("enhancedLogoUploadSection.darkLogo.currentLoaded")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
