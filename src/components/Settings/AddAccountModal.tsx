import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface AddAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useI18nNamespace("Settings/addAccountModal");
  const [isConnecting, setIsConnecting] = useState(false);
  const localdomain = window.location.host;
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const isMultiDashboard =
        window.location.pathname.startsWith("/main-dashboard");

      // Save state in localStorage
      localStorage.setItem(
        "oauth_origin",
        isMultiDashboard ? "multi" : "single"
      );
      const state = localStorage.getItem("oauth_origin");
      if (state == "multi") {
        const authUrl = `${
          import.meta.env.VITE_BASE_URL
        }/google-auth?domain=${localdomain}/main-dashboard/settings`;

        window.location.href = authUrl; // Redirect to backend OAuth start
      } else {
        const authUrl = `${
          import.meta.env.VITE_BASE_URL
        }/google-auth?domain=${localdomain}/settings`;

        window.location.href = authUrl; // Redirect to backend OAuth start
      }

      setIsConnecting(false);
    } catch (err) {
      toast({
        title: t("addAccountModal.errors.connectionError"),
        description:
          err instanceof Error
            ? err.message
            : t("addAccountModal.errors.failedToConnect"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("addAccountModal.title")}</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">
                {t("addAccountModal.alert.title")}
              </p>
              <p className="text-blue-700">
                {t("addAccountModal.alert.description")}
              </p>
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="email">Google Account Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Google account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div> */}

          <div className="text-sm text-gray-600">
            <p className="mb-2">{t("addAccountModal.instructions.intro")}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t("addAccountModal.instructions.steps.signIn")}</li>
              <li>{t("addAccountModal.instructions.steps.grantAccess")}</li>
              <li>{t("addAccountModal.instructions.steps.authorize")}</li>
            </ul>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <ExternalLink className="h-4 w-4 text-gray-500" />
            <a
              href="https://business.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {t("addAccountModal.noProfile.text")}
            </a>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("addAccountModal.buttons.cancel")}
          </Button>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center space-x-2"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t("addAccountModal.buttons.connecting")}</span>
              </>
            ) : (
              <span>{t("addAccountModal.buttons.connect")}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
