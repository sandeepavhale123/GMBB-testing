import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Separator } from "../../ui/separator";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PublishFormData {
  publishOption: string;
  scheduleDate: string;
  postTags: string;
  siloPost: boolean;
}

interface PublishOptionsSectionProps {
  formData: PublishFormData;
  onFormDataChange: (
    updater: (prev: PublishFormData) => PublishFormData
  ) => void;
}

export const PublishOptionsSection: React.FC<PublishOptionsSectionProps> = ({
  formData,
  onFormDataChange,
}) => {
  const { t } = useI18nNamespace("Post/publishOptionsSection");

  const publishOptions = [
    {
      value: "now",
      label: t("publishOptionsSection.publishNow"),
      icon: Clock,
    },
    {
      value: "schedule",
      label: t("publishOptionsSection.schedulePost"),
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {t("publishOptionsSection.label")}
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">
            {t("publishOptionsSection.publishOptionLabel")}
          </Label>
          <Select
            value={formData.publishOption}
            onValueChange={(value) =>
              onFormDataChange((prev) => ({ ...prev, publishOption: value }))
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t(
                  "publishOptionsSection.placeholder.publishOption"
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {publishOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {formData.publishOption === "schedule" && (
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">
              {t("publishOptionsSection.scheduleLabel")}
            </Label>
            <Input
              type="datetime-local"
              value={formData.scheduleDate}
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                onFormDataChange((prev) => ({
                  ...prev,
                  scheduleDate: e.target.value,
                }))
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">
            {t("publishOptionsSection.postTagsLabel")}
          </Label>
          <Input
            type="text"
            placeholder={t("publishOptionsSection.placeholder.postTags")}
            value={formData.postTags}
            onChange={(e) =>
              onFormDataChange((prev) => ({
                ...prev,
                postTags: e.target.value,
              }))
            }
            className="w-full"
          />
        </div>

        {formData.postTags.trim() && (
          <div className="flex items-center space-x-2 pb-2">
            <Checkbox
              id="silo-post"
              checked={formData.siloPost}
              onCheckedChange={(checked) =>
                onFormDataChange((prev) => ({
                  ...prev,
                  siloPost: checked as boolean,
                }))
              }
            />
            <Label htmlFor="silo-post" className="text-sm text-gray-600">
              {t("publishOptionsSection.siloCheckbox")}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};
