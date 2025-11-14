import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { X } from "lucide-react";

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useI18nNamespace("Citation/PlaceOrderModal");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  const handleSave = () => {
    // Reset form and close modal
    setButtonText("");
    setButtonUrl("");
    onClose();
  };

  const handleCancel = () => {
    // Reset form and close modal
    setButtonText("");
    setButtonUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{t("PlaceOrderModal.title")}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="buttonText">
              {t("PlaceOrderModal.buttonTextLabel")}
            </Label>
            <Input
              id="buttonText"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder={t("PlaceOrderModal.buttonTextPlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="buttonUrl">
              {t("PlaceOrderModal.buttonUrlLabel")}
            </Label>
            <Input
              id="buttonUrl"
              type="url"
              value={buttonUrl}
              onChange={(e) => setButtonUrl(e.target.value)}
              placeholder={t("PlaceOrderModal.buttonUrlPlaceholder")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t("PlaceOrderModal.cancel")}
          </Button>
          <Button onClick={handleSave}>{t("PlaceOrderModal.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
