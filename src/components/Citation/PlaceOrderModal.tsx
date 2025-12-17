import React, { useState, useEffect } from "react";
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
import { Switch } from "../ui/switch";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { X, Loader2, Info } from "lucide-react";
import { usePlaceOrderSetting } from "@/hooks/usePlaceOrderSetting";

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useI18nNamespace("Citation/PlaceOrderModal");
  const {
    settings,
    isLoading,
    updateSetting,
    updateStatus,
    isUpdatingSetting,
    isUpdatingStatus,
  } = usePlaceOrderSetting();

  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  // Populate form when settings load
  useEffect(() => {
    if (settings) {
      setButtonText(settings.order_btn || "");
      setButtonUrl(settings.order_url || "");
      setIsEnabled(settings.place_status === 1);
    }
  }, [settings]);

  const handleSave = () => {
    updateSetting(
      { order_url: buttonUrl, order_btn: buttonText },
      { onSuccess: () => onClose() }
    );
  };

  const handleToggleStatus = (checked: boolean) => {
    setIsEnabled(checked);
    updateStatus({ place_status: checked ? 1 : 0 });
  };

  const handleCancel = () => {
    // Reset to original values
    if (settings) {
      setButtonText(settings.order_btn || "");
      setButtonUrl(settings.order_url || "");
      setIsEnabled(settings.place_status === 1);
    }
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

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              {t("PlaceOrderModal.loading")}
            </span>
          </div>
        ) : (
          <>
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
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enabledToggle">
                    {t("PlaceOrderModal.enabledLabel")}
                  </Label>
                  <Switch
                    id="enabledToggle"
                    checked={isEnabled}
                    onCheckedChange={handleToggleStatus}
                    disabled={isUpdatingStatus}
                  />
                </div>
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-md">
                  <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    {t("PlaceOrderModal.enabledNote")}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                {t("PlaceOrderModal.cancel")}
              </Button>
              <Button onClick={handleSave} disabled={isUpdatingSetting}>
                {isUpdatingSetting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("PlaceOrderModal.saving")}
                  </>
                ) : (
                  t("PlaceOrderModal.save")
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
