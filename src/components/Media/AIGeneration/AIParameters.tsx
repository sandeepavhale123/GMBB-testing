import React from "react";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface AIParametersProps {
  variants: number;
  style: string;
  onVariantsChange: (variants: number) => void;
  onStyleChange: (style: string) => void;
}

export const AIParameters: React.FC<AIParametersProps> = ({
  variants,
  style,
  onVariantsChange,
  onStyleChange,
}) => {
  const { t } = useI18nNamespace("Media/aiParameters");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Variants Parameter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          {t("aiParameters.numberOfVariants")}
        </Label>
        <Select
          value={variants.toString()}
          onValueChange={(value) => onVariantsChange(parseInt(value))}
        >
          <SelectTrigger className="w-full bg-white h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="1">{t("aiParameters.variants.one")}</SelectItem>
            <SelectItem value="2">{t("aiParameters.variants.two")}</SelectItem>
            <SelectItem value="3">
              {t("aiParameters.variants.three")}
            </SelectItem>
            <SelectItem value="4">{t("aiParameters.variants.four")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Style Parameter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-900">
          {" "}
          {t("aiParameters.style")}
        </Label>
        <Select value={style} onValueChange={onStyleChange}>
          <SelectTrigger className="w-full bg-white h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="realistic">
              {t("aiParameters.styles.realistic")}
            </SelectItem>
            <SelectItem value="artistic">
              {t("aiParameters.styles.artistic")}
            </SelectItem>
            <SelectItem value="cartoon">
              {t("aiParameters.styles.cartoon")}
            </SelectItem>
            <SelectItem value="abstract">
              {t("aiParameters.styles.abstract")}
            </SelectItem>
            <SelectItem value="minimalist">
              {t("aiParameters.styles.minimalist")}
            </SelectItem>
            <SelectItem value="vintage">
              {t("aiParameters.styles.vintage")}
            </SelectItem>
            <SelectItem value="modern">
              {t("aiParameters.styles.modern")}
            </SelectItem>
            <SelectItem value="file-1">
              {t("aiParameters.styles.file1")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
