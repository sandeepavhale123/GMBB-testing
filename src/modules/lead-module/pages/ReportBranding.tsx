import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Palette, Upload, Save } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const ReportBranding: React.FC = () => {
  const { t } = useI18nNamespace("Lead-module-pages/reportBranding");
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              {t("logo.title")}
            </CardTitle>
            <CardDescription>{t("logo.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                {t("logo.dropText")}
              </p>
              <Button variant="outline" size="sm">
                {t("logo.buttonText")}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {t("logo.note")}
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {t("colors.title")}
            </CardTitle>
            <CardDescription>{t("colors.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary-color">{t("colors.primary")}</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="primary-color"
                    type="color"
                    defaultValue="#3b82f6"
                    className="w-20 h-10 p-1"
                  />
                  <Input defaultValue="#3b82f6" className="flex-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="secondary-color">{t("colors.secondary")}</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="secondary-color"
                    type="color"
                    defaultValue="#64748b"
                    className="w-20 h-10 p-1"
                  />
                  <Input defaultValue="#64748b" className="flex-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("companyInfo.title")}</CardTitle>
            <CardDescription>{t("companyInfo.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-name">{t("companyInfo.nameLabel")}</Label>
              <Input
                id="company-name"
                placeholder={t("companyInfo.namePlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="company-website">
                {t("companyInfo.websiteLabel")}
              </Label>
              <Input
                id="company-website"
                placeholder={t("companyInfo.websitePlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="company-phone">
                {t("companyInfo.phoneLabel")}
              </Label>
              <Input
                id="company-phone"
                placeholder={t("companyInfo.phonePlaceholder")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>{t("preview.title")}</CardTitle>
            <CardDescription>{t("preview.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-24 h-8 bg-primary rounded"></div>
                <div className="text-sm text-muted-foreground">
                  {t("preview.lead")}
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          {t("buttons.save")}
        </Button>
      </div>
    </div>
  );
};

export default ReportBranding;
