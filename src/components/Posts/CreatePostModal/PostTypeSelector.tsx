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

interface PostTypeFormData {
  postType: string;
}

interface PostTypeSelectorProps {
  formData: PostTypeFormData;
  onFormDataChange: (
    updater: (prev: PostTypeFormData) => PostTypeFormData
  ) => void;
}

export const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({
  formData,
  onFormDataChange,
}) => {
  const { t } = useI18nNamespace("Post/postTypeSelector");

  const postTypes = [
    {
      value: "regular",
      label: t("postTypeSelector.types.regular"),
    },
    {
      value: "event",
      label: t("postTypeSelector.types.event"),
    },
    {
      value: "offer",
      label: t("postTypeSelector.types.offer"),
    },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {t("postTypeSelector.label")}
      </Label>
      <Select
        value={formData.postType}
        onValueChange={(value) =>
          onFormDataChange((prev) => ({ ...prev, postType: value }))
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("postTypeSelector.placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {postTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
