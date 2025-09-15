import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PostOfferFormData {
  postType: string;
  startDate: string;
  endDate: string;
  couponCode: string;
  redeemOnlineUrl: string;
  termsConditions: string;
}

interface OfferFieldsProps {
  formData: PostOfferFormData;
  onFormDataChange: (
    updater: (prev: PostOfferFormData) => PostOfferFormData
  ) => void;
}

export const OfferFields: React.FC<OfferFieldsProps> = ({
  formData,
  onFormDataChange,
}) => {
  const { t } = useI18nNamespace("Post/offerFields");
  if (formData.postType !== "offer") {
    return null;
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("offer.startDateTime")}
          </Label>
          <Input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) =>
              onFormDataChange((prev) => ({
                ...prev,
                startDate: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("offer.endDateTime")}
          </Label>
          <Input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) =>
              onFormDataChange((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("offer.couponCode")}</Label>
          <Input
            value={formData.couponCode}
            onChange={(e) =>
              onFormDataChange((prev) => ({
                ...prev,
                couponCode: e.target.value,
              }))
            }
            placeholder={t("offer.couponCodePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("offer.redeemOnlineUrl")}
          </Label>
          <Input
            value={formData.redeemOnlineUrl}
            onChange={(e) =>
              onFormDataChange((prev) => ({
                ...prev,
                redeemOnlineUrl: e.target.value,
              }))
            }
            placeholder={t("offer.redeemOnlineUrlPlaceholder")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {" "}
          {t("offer.termsAndConditions")}
        </Label>
        <Textarea
          value={formData.termsConditions}
          onChange={(e) =>
            onFormDataChange((prev) => ({
              ...prev,
              termsConditions: e.target.value,
            }))
          }
          placeholder={t("offer.termsAndConditionsPlaceholder")}
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );
};
