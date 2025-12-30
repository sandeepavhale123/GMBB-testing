import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useGetSmtpDetails, useUpdateSmtpDetails, useTestSmtpDetails } from "@/hooks/useIntegration";
import { SmtpPayload } from "@/api/integrationApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { z } from "zod";

interface SmtpConfigModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  listingId?: number | null;
  onConfigured?: () => void;
}

export const SmtpConfigModal: React.FC<SmtpConfigModalProps> = ({
  isOpen,
  onOpenChange,
  listingId,
  onConfigured,
}) => {
  const { t } = useI18nNamespace(["Settings/integrationsPage", "Validation/validation"]);
  const { toast } = useToast();

  // SMTP schema
  const smtpSchema = z.object({
    fromName: z
      .string()
      .min(1, t("smtp.fromName"))
      .refine((val) => (val.match(/[A-Za-z]/g) || []).length >= 3, t("smtp.minAlphabetic")),
    rpyEmail: z.string().trim().min(1, t("email.required")).email(t("email.invalid")),
    smtpHost: z.string().min(1, t("smtp.host")),
    smtpPort: z.string().min(1, t("smtp.port.required")).regex(/^\d+$/, t("smtp.port.number")),
    smtpUser: z.string().min(1, t("smtp.user")),
    smtpPass: z.string().min(1, t("smtp.password")),
  });

  const smtpValidation = useFormValidation(smtpSchema);

  // API hooks
  const { data: smtpDetailsData } = useGetSmtpDetails(listingId);
  const updateSmtpDetailsMutation = useUpdateSmtpDetails();
  const testSmtpDetailsMutation = useTestSmtpDetails();

  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [smtpData, setSmtpData] = useState({
    fromName: "",
    fromEmail: "",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
  });

  // Load existing SMTP data when modal opens
  useEffect(() => {
    if (isOpen && smtpDetailsData?.data) {
      setSmtpData({
        fromName: smtpDetailsData.data.fromName || "",
        fromEmail: smtpDetailsData.data.rpyEmail || "",
        smtpHost: smtpDetailsData.data.smtpHost || "",
        smtpPort: smtpDetailsData.data.smtpPort || "",
        smtpUser: smtpDetailsData.data.smtpUser || "",
        smtpPassword: smtpDetailsData.data.smtpPass || "",
      });
    }
  }, [isOpen, smtpDetailsData]);

  const handleSmtpReset = () => {
    setSmtpData({
      fromName: "",
      fromEmail: "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPassword: "",
    });
    smtpValidation.clearErrors();
  };

  const handleSmtpTest = async () => {
    const requiredFields = ["fromEmail", "smtpHost", "smtpPort", "smtpUser", "smtpPassword"];
    const missingFields = requiredFields.filter((field) => {
      const value = smtpData[field as keyof typeof smtpData];
      return !value?.toString().trim();
    });
    if (missingFields.length > 0) {
      toast({
        title: t("integrations.errors.title"),
        description: t("integrations.errors.smtpRequired"),
        variant: "destructive",
      });
      return;
    }
    try {
      const smtpPayload: SmtpPayload = {
        fromName: smtpData.fromName,
        rpyEmail: smtpData.fromEmail,
        smtpHost: smtpData.smtpHost,
        smtpPort: smtpData.smtpPort,
        smtpUser: smtpData.smtpUser,
        smtpPass: smtpData.smtpPassword,
      };
      await testSmtpDetailsMutation.mutateAsync(smtpPayload);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleSmtpSave = async () => {
    const smtpFormData = {
      fromName: smtpData.fromName,
      rpyEmail: smtpData.fromEmail,
      smtpHost: smtpData.smtpHost,
      smtpPort: smtpData.smtpPort,
      smtpUser: smtpData.smtpUser,
      smtpPass: smtpData.smtpPassword,
    };
    const validationResult = smtpValidation.validate(smtpFormData);
    if (!validationResult.isValid) {
      toast({
        title: t("integrations.errors.title"),
        description: t("integrations.errors.smtpValidation"),
        variant: "destructive",
      });
      return;
    }
    try {
      const smtpPayload: SmtpPayload = validationResult.data as SmtpPayload;
      await updateSmtpDetailsMutation.mutateAsync(smtpPayload);
      onOpenChange(false);
      smtpValidation.clearErrors();
      onConfigured?.();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("integrations.smtp.configureTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 p-2 sm:p-0">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromName" className="text-sm font-medium">
                {t("integrations.smtp.labels.fromName")}
              </Label>
              <Input
                id="fromName"
                type="text"
                placeholder={t("integrations.smtp.placeholders.fromName")}
                value={smtpData.fromName}
                onChange={(e) => {
                  setSmtpData({ ...smtpData, fromName: e.target.value });
                  if (smtpValidation.hasFieldError("fromName")) {
                    smtpValidation.clearFieldError("fromName");
                  }
                }}
                className={smtpValidation.hasFieldError("fromName") ? "border-destructive" : ""}
                disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
              />
              {smtpValidation.hasFieldError("fromName") && (
                <p className="text-xs text-destructive">{smtpValidation.getFieldError("fromName")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromEmail" className="text-sm font-medium">
                {t("integrations.smtp.labels.fromEmail")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder={t("integrations.smtp.placeholders.fromEmail")}
                value={smtpData.fromEmail}
                onChange={(e) => {
                  setSmtpData({ ...smtpData, fromEmail: e.target.value });
                  if (smtpValidation.hasFieldError("rpyEmail")) {
                    smtpValidation.clearFieldError("rpyEmail");
                  }
                }}
                className={smtpValidation.hasFieldError("rpyEmail") ? "border-destructive" : ""}
                disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
              />
              {smtpValidation.hasFieldError("rpyEmail") && (
                <p className="text-xs text-destructive">{smtpValidation.getFieldError("rpyEmail")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpHost" className="text-sm font-medium">
                {t("integrations.smtp.labels.smtpHost")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smtpHost"
                type="text"
                placeholder={t("integrations.smtp.placeholders.smtpHost")}
                value={smtpData.smtpHost}
                onChange={(e) => {
                  setSmtpData({ ...smtpData, smtpHost: e.target.value });
                  if (smtpValidation.hasFieldError("smtpHost")) {
                    smtpValidation.clearFieldError("smtpHost");
                  }
                }}
                className={smtpValidation.hasFieldError("smtpHost") ? "border-destructive" : ""}
                disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
              />
              {smtpValidation.hasFieldError("smtpHost") && (
                <p className="text-xs text-destructive">{smtpValidation.getFieldError("smtpHost")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPort" className="text-sm font-medium">
                {t("integrations.smtp.labels.smtpPort")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smtpPort"
                type="number"
                placeholder={t("integrations.smtp.placeholders.smtpPort")}
                value={smtpData.smtpPort}
                onChange={(e) => {
                  setSmtpData({ ...smtpData, smtpPort: e.target.value });
                  if (smtpValidation.hasFieldError("smtpPort")) {
                    smtpValidation.clearFieldError("smtpPort");
                  }
                }}
                className={smtpValidation.hasFieldError("smtpPort") ? "border-destructive" : ""}
                disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
              />
              {smtpValidation.hasFieldError("smtpPort") && (
                <p className="text-xs text-destructive">{smtpValidation.getFieldError("smtpPort")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpUser" className="text-sm font-medium">
                {t("integrations.smtp.labels.smtpUser")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smtpUser"
                type="text"
                placeholder={t("integrations.smtp.placeholders.smtpUser")}
                value={smtpData.smtpUser}
                onChange={(e) => {
                  setSmtpData({ ...smtpData, smtpUser: e.target.value });
                  if (smtpValidation.hasFieldError("smtpUser")) {
                    smtpValidation.clearFieldError("smtpUser");
                  }
                }}
                className={smtpValidation.hasFieldError("smtpUser") ? "border-destructive" : ""}
                disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
              />
              {smtpValidation.hasFieldError("smtpUser") && (
                <p className="text-xs text-destructive">{smtpValidation.getFieldError("smtpUser")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPassword" className="text-sm font-medium">
                {t("integrations.smtp.labels.smtpPassword")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="smtpPassword"
                  type={showSmtpPassword ? "text" : "password"}
                  placeholder={t("integrations.smtp.placeholders.smtpPassword")}
                  value={smtpData.smtpPassword}
                  onChange={(e) => {
                    setSmtpData({ ...smtpData, smtpPassword: e.target.value });
                    if (smtpValidation.hasFieldError("smtpPass")) {
                      smtpValidation.clearFieldError("smtpPass");
                    }
                  }}
                  className={`pr-10 ${smtpValidation.hasFieldError("smtpPass") ? "border-destructive" : ""}`}
                  disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                  disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
                >
                  {showSmtpPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {smtpValidation.hasFieldError("smtpPass") && (
                <p className="text-xs text-destructive">{smtpValidation.getFieldError("smtpPass")}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleSmtpReset}
              disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              {t("integrations.buttons.reset")}
            </Button>

            <div className="flex flex-col sm:flex-row gap-2 w-full order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={handleSmtpTest}
                disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
                className="w-full sm:w-auto"
              >
                {testSmtpDetailsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("integrations.buttons.testing")}
                  </>
                ) : (
                  t("integrations.buttons.testSetting")
                )}
              </Button>
              <Button
                onClick={handleSmtpSave}
                disabled={updateSmtpDetailsMutation.isPending || testSmtpDetailsMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateSmtpDetailsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("integrations.buttons.saving")}
                  </>
                ) : (
                  t("integrations.buttons.save")
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
