import React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Calendar, Clock, Globe } from "lucide-react";
import { convertToBackendDateFormat } from "../../utils/dateUtils";
import { useProfile } from "../../hooks/useProfile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface MediaFormProps {
  formData: {
    title: string;
    category: string;
    publishOption: string;
    scheduleDate?: string;
  };
  onChange: (data: Partial<MediaFormProps["formData"]>) => void;
  hasFiles: boolean;
  fileType?: "image" | "video";
}

export const MediaForm: React.FC<MediaFormProps> = ({
  formData,
  onChange,
  hasFiles,
  fileType,
}) => {
  const { t } = useI18nNamespace("Media/mediaForm");
  const { profileData } = useProfile();

  const allCategories = [
    { value: "COVER", label: t("mediaForm.categories.cover") },
    { value: "PROFILE", label: t("mediaForm.categories.profile") },
    { value: "LOGO", label: t("mediaForm.categories.logo") },
    { value: "EXTERIOR", label: t("mediaForm.categories.exterior") },
    { value: "INTERIOR", label: t("mediaForm.categories.interior") },
    { value: "PRODUCT", label: t("mediaForm.categories.product") },
    { value: "AT_WORK", label: t("mediaForm.categories.atWork") },
    { value: "FOOD_AND_DRINK", label: t("mediaForm.categories.foodAndDrink") },
    { value: "MENU", label: t("mediaForm.categories.menu") },
    { value: "COMMON_AREA", label: t("mediaForm.categories.commonArea") },
    { value: "ROOMS", label: t("mediaForm.categories.rooms") },
    { value: "TEAMS", label: t("mediaForm.categories.teams") },
    { value: "ADDITIONAL", label: t("mediaForm.categories.additional") },
  ];

  const videoCategories = [
    { value: "EXTERIOR", label: t("mediaForm.categories.exterior") },
    { value: "INTERIOR", label: t("mediaForm.categories.interior") },
    { value: "PRODUCT", label: t("mediaForm.categories.product") },
    { value: "AT_WORK", label: t("mediaForm.categories.atWork") },
    { value: "FOOD_AND_DRINK", label: t("mediaForm.categories.foodAndDrink") },
    { value: "MENU", label: t("mediaForm.categories.menu") },
    { value: "COMMON_AREA", label: t("mediaForm.categories.commonArea") },
    { value: "ROOMS", label: t("mediaForm.categories.rooms") },
    { value: "TEAMS", label: t("mediaForm.categories.teams") },
    { value: "ADDITIONAL", label: t("mediaForm.categories.additional") },
  ];

  const categories = fileType === "video" ? videoCategories : allCategories;

  const publishOptions = [
    { value: "now", label: t("mediaForm.publishOptions.now") },
    { value: "schedule", label: t("mediaForm.publishOptions.schedule") },
  ];

  const handleScheduleDateChange = (localDateTime: string) => {
    // Convert to backend expected format (YYYY-MM-DDTHH:MM)
    const backendDateTime = convertToBackendDateFormat(localDateTime);
    onChange({ scheduleDate: backendDateTime });
  };

  // Convert stored date back to local for display in the input
  const getLocalDateTimeValue = (): string => {
    if (!formData.scheduleDate) return "";

    try {
      // Format is already "YYYY-MM-DDTHH:MM", return as-is
      return formData.scheduleDate;
    } catch (error) {
      return "";
    }
  };

  // Get user's timezone from profile or fallback to system timezone
  const getUserTimezone = (): string => {
    if (profileData?.timezone) {
      return profileData.timezone;
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  if (!hasFiles) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {t("mediaForm.title")}
      </h3>

      {/* Title and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            {t("mediaForm.fields.titleLabel")}
          </Label>
          <Input
            id="title"
            type="text"
            placeholder={t("mediaForm.fields.titlePlaceholder")}
            value={formData.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-gray-700"
          >
            {t("mediaForm.fields.categoryLabel")}
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onChange({ category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue
                placeholder={t("mediaForm.fields.categoryPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Publish Options Row */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            {t("mediaForm.fields.publishOptionsLabel")}
          </Label>
          <Select
            value={formData.publishOption || "now"}
            onValueChange={(value) => onChange({ publishOption: value })}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t("mediaForm.fields.publishOptionsPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {publishOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.publishOption === "schedule" && (
          <div className="space-y-2">
            <Label
              htmlFor="schedule-date"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              {t("mediaForm.fields.scheduleLabel")}
            </Label>
            <div className="space-y-2">
              <Input
                id="schedule-date"
                type="datetime-local"
                value={getLocalDateTimeValue()}
                onChange={(e) => handleScheduleDateChange(e.target.value)}
                className="w-full"
              />
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Globe className="w-3 h-3" />
                <span>
                  {t("mediaForm.fields.timezoneLabel", {
                    timezone: getUserTimezone(),
                  })}
                  {/* Your timezone: {getUserTimezone()} */}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
