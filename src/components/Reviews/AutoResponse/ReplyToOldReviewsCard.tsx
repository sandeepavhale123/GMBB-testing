// components/reviews/ReplyToOldReviewsCard.tsx
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { reviewService } from "@/services/reviewService";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface Props {
  checked: boolean;
  onToggle: (value: boolean) => void;
  onSave: () => void;
  listingId?: number;
  isAutoResponseMode?: boolean; // Only call API for Auto Response Template
}

export const ReplyToOldReviewsCard: React.FC<Props> = ({
  checked,
  onToggle,
  listingId,
  isAutoResponseMode = true,
}) => {
  const { t } = useI18nNamespace("Reviews/replyToOldReviewsCard");
  const [isUpdating, setIsUpdating] = useState(false);
  const handleToggle = async (value: boolean) => {
    // Only call API for Auto Response Template, not AI Auto Response
    if (!isAutoResponseMode || !listingId) {
      onToggle(value);
      return;
    }

    setIsUpdating(true);

    try {
      await reviewService.updateOldAutoReplySetting({
        listingId,
        oldStatus: value ? 1 : 0,
      });

      onToggle(value);

      toast({
        title: t("replyToOldReviewsCard.toast.success.title"),
        description: value
          ? t("replyToOldReviewsCard.toast.success.enabled")
          : t("replyToOldReviewsCard.toast.success.disabled"),
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: t("replyToOldReviewsCard.toast.error.title"),
        description:
          error?.response?.data?.message ||
          t("replyToOldReviewsCard.toast.error.default"),
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <Card className="bg-gray-50 border border-gray-200 p-4 ">
      <div className="flex justify-between space-x-3 items-center">
        <Label
          htmlFor="reply-old-review-switch"
          className="text-sm font-medium text-gray-900"
        >
          {t("replyToOldReviewsCard.label")}
        </Label>
        <Switch
          id="reply-old-review-switch"
          checked={checked}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
        />
      </div>
    </Card>
  );
};
