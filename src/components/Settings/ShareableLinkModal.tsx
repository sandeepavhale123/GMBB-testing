import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ShareableLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
}

export const ShareableLinkModal: React.FC<ShareableLinkModalProps> = ({
  open,
  onOpenChange,
  member,
}) => {
  const { t } = useI18nNamespace("Settings/shareableLinkModal");
  const [copied, setCopied] = useState(false);
  const [allowListings, setAllowListings] = useState(0);

  if (!member) return null;

  const shareableLink = `https://yourapp.com/login?token=${member.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast({
        title: t("shareableLinkModal.toast.copiedTitle"),
        description: t("shareableLinkModal.toast.copiedDescription"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: t("shareableLinkModal.toast.failedTitle"),
        description:
          err.message ||
          err?.response?.data?.message ||
          t("shareableLinkModal.toast.failedDescription"),
        variant: "destructive",
      });
    }
  };

  const handleOpenLink = () => {
    window.open(shareableLink, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("shareableLinkModal.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            {t("shareableLinkModal.description1")}
            <span className="font-medium text-gray-900">
              {t("shareableLinkModal.description2", {
                firstName: member.firstName,
                lastName: member.lastName,
              })}
            </span>{" "}
            {t("shareableLinkModal.description3")}
          </div>

          <div className="space-y-2">
            <Label htmlFor="allow-listings">
              {t("shareableLinkModal.allowListingsLabel")}
            </Label>
            <div className="text-sm text-gray-600 mb-2">
              {t("shareableLinkModal.availableSpots", { spots: 397 })}
            </div>
            <Input
              id="allow-listings"
              type="number"
              value={allowListings}
              onChange={(e) => setAllowListings(Number(e.target.value))}
              placeholder={t("shareableLinkModal.allowListingsPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shareable-link">
              {t("shareableLinkModal.directAccessLinkLabel")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="shareable-link"
                value={shareableLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 text-sm mb-2">
              {t("shareableLinkModal.linkDetails.title")}
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {t("shareableLinkModal.linkDetails.points.valid")}</li>
              <li>• {t("shareableLinkModal.linkDetails.points.bypass")}</li>
              <li>• {t("shareableLinkModal.linkDetails.points.role")}</li>
              <li>• {t("shareableLinkModal.linkDetails.points.revoke")}</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t("shareableLinkModal.buttons.close")}
            </Button>
            <Button onClick={handleOpenLink} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              {t("shareableLinkModal.buttons.testLink")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
