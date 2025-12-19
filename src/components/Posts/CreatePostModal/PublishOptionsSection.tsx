import React from "react";
import { Calendar, Clock, RefreshCw } from "lucide-react";
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
  autoScheduleFrequency: string;
  autoScheduleTime: string;
  autoScheduleDay: string;
  autoScheduleDate: string;
  autoScheduleRecurrenceCount: number;
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
    {
      value: "auto",
      label: t("publishOptionsSection.autoSchedule"),
      icon: RefreshCw,
    },
  ];

  const frequencyOptions = [
    { value: "daily", label: t("publishOptionsSection.frequencies.daily") },
    { value: "weekly", label: t("publishOptionsSection.frequencies.weekly") },
    { value: "monthly", label: t("publishOptionsSection.frequencies.monthly") },
  ];

  const dayOptions = [
    { value: "0", label: t("publishOptionsSection.days.sunday") },
    { value: "1", label: t("publishOptionsSection.days.monday") },
    { value: "2", label: t("publishOptionsSection.days.tuesday") },
    { value: "3", label: t("publishOptionsSection.days.wednesday") },
    { value: "4", label: t("publishOptionsSection.days.thursday") },
    { value: "5", label: t("publishOptionsSection.days.friday") },
    { value: "6", label: t("publishOptionsSection.days.saturday") },
  ];

  const dateOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">
        {t("publishOptionsSection.label")}
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          {/* <Label className="text-sm text-gray-600">
            {t("publishOptionsSection.publishOptionLabel")}
          </Label> */}
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

      {/* Auto Scheduling Fields */}
      {formData.publishOption === "auto" && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          {/* Schedule Frequency */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">
              {t("publishOptionsSection.scheduleFrequencyLabel")}
            </Label>
            <Select
              value={formData.autoScheduleFrequency}
              onValueChange={(value) =>
                onFormDataChange((prev) => ({
                  ...prev,
                  autoScheduleFrequency: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "publishOptionsSection.placeholder.selectFrequency"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Day Selection - Only for Weekly */}
          {formData.autoScheduleFrequency === "weekly" && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                {t("publishOptionsSection.dayLabel")}
              </Label>
              <Select
                value={formData.autoScheduleDay}
                onValueChange={(value) =>
                  onFormDataChange((prev) => ({
                    ...prev,
                    autoScheduleDay: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "publishOptionsSection.placeholder.selectDay"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {dayOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Selection - Only for Monthly */}
          {formData.autoScheduleFrequency === "monthly" && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                {t("publishOptionsSection.dateLabel")}
              </Label>
              <select
                value={formData.autoScheduleDate}
                onChange={(e) =>
                  onFormDataChange((prev) => ({
                    ...prev,
                    autoScheduleDate: e.target.value,
                  }))
                }
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  {t("publishOptionsSection.placeholder.selectDate")}
                </option>
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Time and Recurrence Count - Show when frequency is selected */}
          {formData.autoScheduleFrequency && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  {t("publishOptionsSection.timeLabel")}
                </Label>
                <Input
                  type="time"
                  value={formData.autoScheduleTime}
                  onChange={(e) =>
                    onFormDataChange((prev) => ({
                      ...prev,
                      autoScheduleTime: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">
                  {t("publishOptionsSection.recurrenceCountLabel")}
                </Label>
                <Input
                  type="number"
                  min={1}
                  placeholder={t(
                    "publishOptionsSection.placeholder.recurrenceCount"
                  )}
                  value={formData.autoScheduleRecurrenceCount || ""}
                  onChange={(e) =>
                    onFormDataChange((prev) => ({
                      ...prev,
                      autoScheduleRecurrenceCount:
                        parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
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
