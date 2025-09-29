import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Upload, Building, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const ReportBrandingSection: React.FC = () => {
  const { t } = useI18nNamespace("Branding/reportBrandingSection");
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyWebsite: "",
    companyPhone: "",
    companyAddress: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const validateAndUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: t("reportBranding.toast.fileTooLargeTitle"),
        description: t("reportBranding.toast.fileTooLargeDescription"),
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: t("reportBranding.toast.invalidFileTitle"),
        description: t("reportBranding.toast.invalidFileDescription"),
        variant: "destructive",
      });
      return;
    }

    setLogoFile(file);
    toast({
      title: t("reportBranding.toast.uploadedTitle"),
      description: t("reportBranding.toast.uploadedDescription", {
        fileName: file.name,
      }),
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeLogo = () => {
    setLogoFile(null);
    toast({
      title: t("reportBranding.toast.removedTitle"),
      description: t("reportBranding.toast.removedDescription"),
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Building className="w-5 h-5" />
        {t("reportBranding.title")}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-sm font-medium">
              {t("reportBranding.form.companyName.label")}
            </Label>
            <Input
              id="company-name"
              placeholder={t("reportBranding.form.companyName.placeholder")}
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-email" className="text-sm font-medium">
              {t("reportBranding.form.companyEmail.label")}
            </Label>
            <Input
              id={t("reportBranding.form.companyEmail.placeholder")}
              type="email"
              placeholder="company@example.com"
              value={formData.companyEmail}
              onChange={(e) =>
                handleInputChange("companyEmail", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-website" className="text-sm font-medium">
              {t("reportBranding.form.companyWebsite.label")}
            </Label>
            <Input
              id="company-website"
              placeholder={t("reportBranding.form.companyWebsite.placeholder")}
              value={formData.companyWebsite}
              onChange={(e) =>
                handleInputChange("companyWebsite", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-phone" className="text-sm font-medium">
              {t("reportBranding.form.companyPhone.label")}
            </Label>
            <Input
              id="company-phone"
              placeholder={t("reportBranding.form.companyPhone.placeholder")}
              value={formData.companyPhone}
              onChange={(e) =>
                handleInputChange("companyPhone", e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-address" className="text-sm font-medium">
            {t("reportBranding.form.companyAddress.label")}
          </Label>
          <Input
            id="company-address"
            placeholder={t("reportBranding.form.companyAddress.placeholder")}
            value={formData.companyAddress}
            onChange={(e) =>
              handleInputChange("companyAddress", e.target.value)
            }
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {t("reportBranding.logo.label")}
            </Label>
            {logoFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeLogo}
                className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex items-start gap-4">
            <div
              className={`w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                dragOver
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {logoFile ? (
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Report logo preview"
                  className="w-full h-full object-contain rounded p-1"
                />
              ) : (
                <Building className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-3">
                {t("reportBranding.logo.description")}
              </p>

              <input
                id="report-logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("report-logo-upload")?.click()
                }
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-1" />
                {t("reportBranding.logo.chooseButton")}
              </Button>

              {logoFile && (
                <div className="text-sm text-gray-600 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="truncate mr-2">
                      {t("reportBranding.logo.selectedFile", {
                        fileName: logoFile.name,
                      })}
                    </span>
                    <span className="text-xs text-green-600">
                      {t("reportBranding.logo.ready")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {dragOver && (
            <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-600">
                {t("reportBranding.logo.dropHere")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
