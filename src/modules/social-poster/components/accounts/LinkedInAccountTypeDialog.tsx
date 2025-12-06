import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Loader2 } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface LinkedInAccountTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AccountType = "individual" | "organization";

export const LinkedInAccountTypeDialog: React.FC<
  LinkedInAccountTypeDialogProps
> = ({ open, onOpenChange }) => {
  const { t } = useI18nNamespace([
    "social-poster-components/LinkedInAccountTypeDialog",
  ]);
  const [connecting, setConnecting] = useState<AccountType | null>(null);

  const handleConnect = async (accountType: AccountType) => {
    setConnecting(accountType);

    try {
      const frontendOrigin = window.location.origin;
      const endpoint =
        accountType === "organization"
          ? `/social-poster/accounts/connect/linkedin-organisation/init`
          : `/social-poster/accounts/connect/linkedin/init`;

      const response = await axiosInstance.get(
        `${endpoint}?frontend_origin=${encodeURIComponent(frontendOrigin)}`
      );

      if (response.data.code === 200 && response.data.data?.auth_url) {
        // Close dialog and redirect to LinkedIn OAuth
        onOpenChange(false);
        window.location.href = response.data.data.auth_url;
      } else {
        toast.error(t("errors.oauthInitFailed"));
        setConnecting(null);
      }
    } catch (error: any) {
      console.error("LinkedIn OAuth init error:", error);
      const errorMessage =
        error.response?.data?.message || t("errors.connectFailed");
      toast.error(errorMessage);
      setConnecting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Individual Profile Option */}
          <div className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("individual.title")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("individual.description")}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleConnect("individual")}
              disabled={connecting === "individual"}
              className="ml-2 flex-shrink-0"
            >
              {connecting === "individual" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("buttons.connecting")}
                </>
              ) : (
                t("buttons.connect")
              )}
            </Button>
          </div>

          {/* Organization Page Option */}
          <div className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("organization.title")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("organization.description")}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleConnect("organization")}
              disabled={connecting === "organization"}
              className="ml-2 flex-shrink-0"
            >
              {connecting === "organization" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("buttons.connecting")}
                </>
              ) : (
                t("buttons.connect")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
