import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PostEventFormData {
  postType: string;
  startDate: string;
  endDate: string;
}

interface EventFieldsProps {
  formData: PostEventFormData;
  onFormDataChange: (
    updater: (prev: PostEventFormData) => PostEventFormData
  ) => void;
}

export const EventFields: React.FC<EventFieldsProps> = ({
  formData,
  onFormDataChange,
}) => {
  const { t } = useI18nNamespace("Post/eventFields");
  if (formData.postType !== "event") {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("event.startDateTime")}
        </Label>
        <Input
          type="datetime-local"
          value={formData.startDate}
          onChange={(e) =>
            onFormDataChange((prev) => ({ ...prev, startDate: e.target.value }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("event.endDateTime")}</Label>
        <Input
          type="datetime-local"
          value={formData.endDate}
          onChange={(e) =>
            onFormDataChange((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />
      </div>
    </div>
  );
};
