import React from "react";
import { Link } from "lucide-react";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CTAButtonSectionProps {
  showCTAButton: boolean;
  onShowCTAButtonChange: (show: boolean) => void;
  ctaButton: string;
  onCTAButtonChange: (value: string) => void;
  ctaUrl: string;
  onCTAUrlChange: (value: string) => void;
  urlError?: string;
}

export const CTAButtonSection: React.FC<CTAButtonSectionProps> = ({
  showCTAButton,
  onShowCTAButtonChange,
  ctaButton,
  onCTAButtonChange,
  ctaUrl,
  onCTAUrlChange,
  urlError,
}) => {
  const { t } = useI18nNamespace("Post/ctaButtonSection");
  const ctaOptions = [
    {
      value: "LEARN_MORE",
      label: t("cta.options.LEARN_MORE"),
    },
    {
      value: "BOOK",
      label: t("cta.options.BOOK"),
    },
    {
      value: "CALL",
      label: t("cta.options.CALL"),
    },
    {
      value: "ORDER",
      label: t("cta.options.ORDER"),
    },
    {
      value: "SHOP",
      label: t("cta.options.SHOP"),
    },
    {
      value: "SIGN_UP",
      label: t("cta.options.SIGN_UP"),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Switch
          id="include-cta"
          checked={showCTAButton}
          onCheckedChange={onShowCTAButtonChange}
        />
        <Label htmlFor="include-cta" className="text-sm font-medium">
          {t("cta.includeButton")}
        </Label>
      </div>

      {showCTAButton && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("cta.buttonType")}</Label>
            <Select value={ctaButton} onValueChange={onCTAButtonChange}>
              <SelectTrigger>
                <SelectValue placeholder={t("cta.chooseTypePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {ctaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Hide URL field only when Call Now is selected */}
          {ctaButton !== "CALL" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("cta.buttonUrl")}
              </Label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="field-ctaUrl"
                  value={ctaUrl}
                  onChange={(e) => onCTAUrlChange(e.target.value)}
                  placeholder={t("cta.urlPlaceholder")}
                  className={`pl-10 ${
                    urlError ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {urlError && (
                <p className="text-sm text-red-500 mt-1">{urlError}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
