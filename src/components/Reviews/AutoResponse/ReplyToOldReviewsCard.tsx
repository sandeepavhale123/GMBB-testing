// components/reviews/ReplyToOldReviewsCard.tsx
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { reviewService } from "@/services/reviewService";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

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
        title: "Success",
        description: `Reply to existing reviews ${
          value ? "enabled" : "disabled"
        } successfully.`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong while updating setting.",
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
          Reply to existing reviews (old review)
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
