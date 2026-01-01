import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Settings, Check, X, Eye, EyeOff, ExternalLink, Loader2, Mail, Globe, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { Edit } from "lucide-react";
import {
  useGetSubdomainStatus,
  useUpdateSubdomain,
  useGetSmtpDetails,
  useUpdateSmtpDetails,
  useTestSmtpDetails,
  useDeleteSmtpDetails,
  useSubdomainDetails,
  useGetTwilioStatus,
  useConnectTwilio,
  useDisconnectTwilio,
} from "@/hooks/useIntegration";
import { SmtpPayload, TwilioConnectPayload } from "@/api/integrationApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { z } from "zod";
import { useProfile } from "@/hooks/useProfile";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  status: "active" | "inactive";
  configurable: boolean;
}

interface IntegrationsPageProps {
  showTwilio?: boolean;
  listingId?: number | null;
  containerClassName?: string;
  gridClassName?: string;
}

export const IntegrationsPage: React.FC<IntegrationsPageProps> = ({
  showTwilio = false,
  listingId: propListingId,
  containerClassName,
  gridClassName,
}) => {
  const { t } = useI18nNamespace(["Settings/integrationsPage", "Validation/validation"]);

  const disconnectConfirmationSchema = z.object({
    confirmationText: z.string().refine((val) => val.toLowerCase() === "delete", {
      message: t("disconnect.confirmText"),
    }),
  });

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

  type DisconnectConfirmationFormData = z.infer<typeof disconnectConfirmationSchema>;
  type SmtpFormData = z.infer<typeof smtpSchema>;

  const { toast } = useToast();
  const { profileData } = useProfile();
  
  const effectiveListingId = propListingId ?? null;

  // API hooks
  const { data: subdomainStatusData } = useGetSubdomainStatus();
  const updateSubdomainMutation = useUpdateSubdomain();

  const { data: smtpDetailsData, isLoading: isFetchingSmtp } = useGetSmtpDetails(effectiveListingId);
  const updateSmtpDetailsMutation = useUpdateSmtpDetails();
  const testSmtpDetailsMutation = useTestSmtpDetails();
  const deleteSmtpDetailsMutation = useDeleteSmtpDetails();
  const deleteSubdomainDetailsMutation = useSubdomainDetails();

  // Twilio hooks
  const { data: twilioStatusData, isLoading: isFetchingTwilio } = useGetTwilioStatus();
  const connectTwilioMutation = useConnectTwilio();
  const disconnectTwilioMutation = useDisconnectTwilio();

  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [disconnectingIntegration, setDisconnectingIntegration] = useState<string | null>(null);

  // SMTP related states
  const [isConfiguringSmtp, setIsConfiguringSmtp] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [smtpData, setSmtpData] = useState({
    fromName: "",
    fromEmail: "",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    phone: "",
  });

  // Subdomain related states
  const [isConfiguringSubdomain, setIsConfiguringSubdomain] = useState(false);
  const [subdomain, setSubdomain] = useState("");

  // Twilio related states
  const [isConfiguringTwilio, setIsConfiguringTwilio] = useState(false);
  const [showTwilioAuthToken, setShowTwilioAuthToken] = useState(false);
  const [twilioData, setTwilioData] = useState({
    accountSid: "",
    authToken: "",
    configName: "",
  });

  // Twilio validation schema
  const twilioSchema = z.object({
    accountSid: z.string().trim().min(1, t("apiKey.required")),
    authToken: z.string().trim().min(1, t("smtp.password")),
    configName: z.string().trim().min(1, t("smtp.fromName")),
  });

  // Form validation hooks
  const disconnectValidation = useFormValidation(disconnectConfirmationSchema);
  const smtpValidation = useFormValidation(smtpSchema);
  const twilioValidation = useFormValidation(twilioSchema);

  // Determine integration statuses based on API data
  const connectedSmtp =
    smtpDetailsData?.data &&
    typeof smtpDetailsData.data.smtpHost === "string" &&
    smtpDetailsData.data.smtpHost.length > 0;
  const connectedSubdomain = subdomainStatusData?.data?.status === "Active";
  const hasSubdomain =
    typeof subdomainStatusData?.data?.domain === "string" && subdomainStatusData?.data?.domain.length > 0;

  // Determine Twilio status
  const connectedTwilio = !!twilioStatusData?.data && !Array.isArray(twilioStatusData.data) && !!twilioStatusData.data?.config;
  const twilioConfigId = (!Array.isArray(twilioStatusData?.data) && twilioStatusData?.data?.config?.id) || "";

  const integrationsData = [
    { id: "smtp-details", key: "smtp", icon: Mail, connected: connectedSmtp },
    {
      id: "subdomain-config",
      key: "subdomain",
      icon: Globe,
      connected: connectedSubdomain,
    },
    ...(showTwilio ? [{ id: "twilio-config", key: "twilio", icon: Phone, connected: connectedTwilio }] : []),
  ];

  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    setIntegrations(
      integrationsData.map((item) => ({
        id: item.id,
        name: t(`integrations.${item.key}.name`),
        description: t(`integrations.${item.key}.description`),
        icon: item.icon,
        status: item.connected ? "active" : "inactive",
        configurable: true,
      })),
    );
  }, [t, connectedSmtp, connectedSubdomain, connectedTwilio, showTwilio]);

  useEffect(() => {
    setIntegrations((prev) =>
      prev.map((integration) => {
        if (integration.id === "smtp-details") {
          return {
            ...integration,
            status: connectedSmtp ? "active" : "inactive",
          };
        }
        if (integration.id === "subdomain-config") {
          return {
            ...integration,
            status: connectedSubdomain ? "active" : "inactive",
          };
        }
        if (integration.id === "twilio-config") {
          return {
            ...integration,
            status: connectedTwilio ? "active" : "inactive",
          };
        }
        return integration;
      }),
    );
  }, [connectedSmtp, connectedSubdomain, connectedTwilio]);

  const handleDisconnect = (integrationId: string) => {
    setDisconnectingIntegration(integrationId);
    setShowDisconnectDialog(true);
  };

  const handleDisconnectConfirm = async () => {
    const validationResult = disconnectValidation.validate({
      confirmationText,
    });
    if (!validationResult.isValid) {
      toast({
        title: t("integrations.errors.title"),
        description:
          (validationResult.errors as Record<string, string>)?.confirmationText ||
          t("integrations.errors.disconnectConfirmation"),
        variant: "destructive",
      });
      return;
    }
    try {
      if (disconnectingIntegration === "smtp-details") {
        if (!connectedSmtp) {
          toast({
            title: t("integrations.errors.title"),
            description: t("integrations.errors.noSmtp"),
            variant: "destructive",
          });
          return;
        }
        await deleteSmtpDetailsMutation.mutateAsync();
      } else if (disconnectingIntegration === "subdomain-config") {
        if (!connectedSubdomain) {
          toast({
            title: t("integrations.errors.title"),
            description: t("integrations.errors.noSubdomain"),
            variant: "destructive",
          });
          return;
        }
        await deleteSubdomainDetailsMutation.mutateAsync();
      } else if (disconnectingIntegration === "twilio-config") {
        if (!connectedTwilio) {
          toast({
            title: t("integrations.errors.title"),
            description: t("integrations.errors.noTwilio"),
            variant: "destructive",
          });
          return;
        }
        await disconnectTwilioMutation.mutateAsync(twilioConfigId);
      }

      setShowDisconnectDialog(false);
      setConfirmationText("");
      setDisconnectingIntegration(null);
      disconnectValidation.clearErrors();
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  // Subdomain related functions
  const handleOpenSubdomainModal = () => {
    if (subdomainStatusData?.data?.domain) {
      setSubdomain(subdomainStatusData.data.domain);
    }
    setIsConfiguringSubdomain(true);
  };

  const handleOpenSmtpModal = () => {
    if (smtpDetailsData?.data) {
      setSmtpData({
        fromName: smtpDetailsData.data.fromName || "",
        fromEmail: smtpDetailsData.data.rpyEmail || "",
        smtpHost: smtpDetailsData.data.smtpHost || "",
        smtpPort: smtpDetailsData.data.smtpPort || "",
        smtpUser: smtpDetailsData.data.smtpUser || "",
        smtpPassword: smtpDetailsData.data.smtpPass || "",
        phone: smtpDetailsData.data.phone || "",
      });
    }
    setIsConfiguringSmtp(true);
  };

  const handleSmtpReset = () => {
    setSmtpData({
      fromName: "",
      fromEmail: "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPassword: "",
      phone: "",
    });
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
      // Error handled by mutation
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
      const smtpPayload: SmtpPayload = {
        fromName: smtpData.fromName,
        rpyEmail: smtpData.fromEmail,
        smtpHost: smtpData.smtpHost,
        smtpPort: smtpData.smtpPort,
        smtpUser: smtpData.smtpUser,
        smtpPass: smtpData.smtpPassword,
      };
      await updateSmtpDetailsMutation.mutateAsync(smtpPayload);
      setIsConfiguringSmtp(false);
      smtpValidation.clearErrors();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleSubdomainSave = async () => {
    if (!subdomain.trim()) {
      toast({
        title: t("integrations.errors.title"),
        description: t("integrations.errors.subdomainRequired"),
        variant: "destructive",
      });
      return;
    }
    try {
      await updateSubdomainMutation.mutateAsync({ subDomain: subdomain.trim() });
      setIsConfiguringSubdomain(false);
      setSubdomain("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  // Twilio handlers
  const handleOpenTwilioModal = () => {
    if (twilioStatusData?.data && !Array.isArray(twilioStatusData.data) && twilioStatusData.data.config) {
      const config = twilioStatusData.data.config;
      setTwilioData({
        accountSid: config.account_sid || "",
        authToken: "",
        configName: config.config_name || "",
      });
    }
    setIsConfiguringTwilio(true);
  };

  const handleTwilioReset = () => {
    setTwilioData({
      accountSid: "",
      authToken: "",
      configName: "",
    });
    twilioValidation.clearErrors();
  };

  const handleTwilioSave = async () => {
    const twilioFormData = {
      accountSid: twilioData.accountSid,
      authToken: twilioData.authToken,
      configName: twilioData.configName,
    };
    
    const validationResult = twilioValidation.validate(twilioFormData);
    if (!validationResult.isValid) {
      toast({
        title: t("integrations.errors.title"),
        description: t("integrations.errors.twilioValidation"),
        variant: "destructive",
      });
      return;
    }
    try {
      const twilioPayload: TwilioConnectPayload = {
        account_sid: twilioData.accountSid.trim(),
        auth_token: twilioData.authToken.trim(),
        config_name: twilioData.configName.trim(),
      };
      
      await connectTwilioMutation.mutateAsync(twilioPayload);
      setIsConfiguringTwilio(false);
      twilioValidation.clearErrors();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className={containerClassName ?? "p-4 sm:p-6 pb-[100px] sm:pb-[100px]"}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("integrations.title")}</h2>
        <p className="text-muted-foreground">{t("integrations.subtitle")}</p>
      </div>

      <div className={gridClassName ?? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
        {integrations.map((integration) => {
          const IconComponent = integration.icon;
          return (
            <Card
              key={integration.id}
              className={`relative transition-all duration-200 ${
                integration.status === "active" ? "bg-primary/5 border-primary/20 shadow-md" : "hover:shadow-md"
              }`}
            >
              {integration.status === "active" && (
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    <Check className="w-3 h-3" />
                    {t("integrations.status.active")}
                  </Badge>
                </div>
              )}

              <div className="p-6 pb-4">
                <div className="flex justify-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="px-6 pb-4 text-left">
                <h3 className="text-lg font-semibold text-foreground mb-2">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">{integration.description}</p>
              </div>

              <div className="px-6 pb-6">
                <div className="flex justify-start gap-2">
                  {/* SMTP */}
                  {integration.id === "smtp-details" && (
                    <>
                      {integration.status === "active" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenSmtpModal}
                            className="flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            {t("integrations.buttons.edit")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect("smtp-details")}
                            className="text-destructive hover:text-destructive hover:bg-destructive/5"
                          >
                            {t("integrations.buttons.disconnect")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={handleOpenSmtpModal}
                          disabled={isFetchingSmtp}
                        >
                          {isFetchingSmtp ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("integrations.buttons.loading")}
                            </>
                          ) : (
                            <>
                              <Settings className="w-4 h-4" />
                              {t("integrations.buttons.configure")}
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}

                  {/* Subdomain */}
                  {integration.id === "subdomain-config" && (
                    <>
                      <Button
                        variant={hasSubdomain ? "outline" : undefined}
                        size="sm"
                        onClick={handleOpenSubdomainModal}
                        className="flex items-center gap-2"
                      >
                        {hasSubdomain ? (
                          <>
                            <Edit className="w-4 h-4" />
                            {t("integrations.buttons.edit")}
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4" />
                            {t("integrations.buttons.configure")}
                          </>
                        )}
                      </Button>

                      {connectedSubdomain && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect("subdomain-config")}
                          className="text-destructive hover:text-destructive hover:bg-destructive/5"
                        >
                          {t("integrations.buttons.disconnect")}
                        </Button>
                      )}
                    </>
                  )}

                  {/* Twilio */}
                  {integration.id === "twilio-config" && (
                    <>
                      {integration.status === "active" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenTwilioModal}
                            className="flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            {t("integrations.buttons.edit")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect("twilio-config")}
                            className="text-destructive hover:text-destructive hover:bg-destructive/5"
                          >
                            {t("integrations.buttons.disconnect")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={handleOpenTwilioModal}
                          disabled={isFetchingTwilio}
                        >
                          {isFetchingTwilio ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("integrations.buttons.loading")}
                            </>
                          ) : (
                            <>
                              <Settings className="w-4 h-4" />
                              {t("integrations.buttons.configure")}
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Disconnect Confirmation Dialog */}
      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("integrations.disconnectDialog.title")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 p-2 sm:p-0">
            <p className="text-sm text-muted-foreground">{t("integrations.disconnectDialog.message")}</p>

            <div className="space-y-2">
              <Label htmlFor="confirmText" className="text-sm font-medium">
                {t("integrations.disconnectDialog.label")}
              </Label>
              <Input
                id="confirmText"
                type="text"
                placeholder={t("integrations.disconnectDialog.placeholder")}
                value={confirmationText}
                onChange={(e) => {
                  setConfirmationText(e.target.value);
                  if (disconnectValidation.hasFieldError("confirmationText")) {
                    disconnectValidation.clearFieldError("confirmationText");
                  }
                }}
                className={
                  disconnectValidation.hasFieldError("confirmationText")
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={deleteSmtpDetailsMutation.isPending}
              />
              {disconnectValidation.hasFieldError("confirmationText") && (
                <p className="text-xs text-destructive mt-1">
                  {disconnectValidation.getFieldError("confirmationText")}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowDisconnectDialog(false);
                setConfirmationText("");
                setDisconnectingIntegration(null);
                disconnectValidation.clearErrors();
              }}
              disabled={deleteSmtpDetailsMutation.isPending}
              className="w-full sm:w-auto"
            >
              {t("integrations.buttons.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnectConfirm}
              disabled={
                deleteSmtpDetailsMutation.isPending ||
                confirmationText.toLowerCase() !== "delete"
              }
              className="w-full sm:w-auto"
            >
              {deleteSmtpDetailsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("integrations.buttons.disconnecting")}
                </>
              ) : (
                t("integrations.buttons.disconnect")
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SMTP Configuration Modal */}
      <Dialog open={isConfiguringSmtp} onOpenChange={setIsConfiguringSmtp}>
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
                    setSmtpData({
                      ...smtpData,
                      fromName: e.target.value,
                    });
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
                    setSmtpData({
                      ...smtpData,
                      fromEmail: e.target.value,
                    });
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
                    setSmtpData({
                      ...smtpData,
                      smtpHost: e.target.value,
                    });
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
                    setSmtpData({
                      ...smtpData,
                      smtpPort: e.target.value,
                    });
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
                    setSmtpData({
                      ...smtpData,
                      smtpUser: e.target.value,
                    });
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
                  {t("integrations.smtp.labels.smtpPassword")}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="smtpPassword"
                    type={showSmtpPassword ? "text" : "password"}
                    placeholder={t("integrations.smtp.placeholders.smtpPassword")}
                    value={smtpData.smtpPassword}
                    onChange={(e) => {
                      setSmtpData({
                        ...smtpData,
                        smtpPassword: e.target.value,
                      });
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

      {/* Subdomain Configuration Modal */}
      <Dialog open={isConfiguringSubdomain} onOpenChange={setIsConfiguringSubdomain}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("integrations.subdomain.name")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
            <div className="space-y-3">
              <Label htmlFor="subdomain" className="text-sm font-medium">
                {t("integrations.subdomain.label")}
              </Label>
              <Input
                id="subdomain"
                type="text"
                placeholder={t("integrations.subdomain.placeholder")}
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                disabled={updateSubdomainMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">{t("integrations.subdomain.text")}</p>
            </div>

            <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-3">{t("integrations.subdomain.follow")}</h4>
              <div className="space-y-3 text-sm text-foreground">
                <div className="flex items-start gap-3">
                  <span className="font-medium min-w-[60px] text-primary">
                    {t("integrations.subdomain.stepcount", { count: 1 })}
                  </span>
                  <span>{t("integrations.subdomain.step1")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium min-w-[60px] text-primary">
                    {t("integrations.subdomain.stepcount", { count: 2 })}
                  </span>
                  <span>
                    {t("integrations.subdomain.step2")}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">157.230.2.181</code>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium min-w-[60px] text-primary">
                    {t("integrations.subdomain.stepcount", { count: 3 })}
                  </span>
                  <span>
                    {t("integrations.subdomain.step3p1")}
                    <a
                      href="https://dnschecker.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline inline-flex items-center gap-1"
                    >
                      {t("integrations.subdomain.step3p2")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium min-w-[60px] text-primary">
                    {t("integrations.subdomain.stepcount", { count: 4 })}
                  </span>
                  <span>{t("integrations.subdomain.step4")}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfiguringSubdomain(false);
                  setSubdomain("");
                }}
                disabled={updateSubdomainMutation.isPending}
                className="w-full sm:w-auto"
              >
                {t("integrations.buttons.cancel")}
              </Button>
              <Button
                onClick={handleSubdomainSave}
                disabled={updateSubdomainMutation.isPending || !subdomain.trim()}
                className="w-full sm:w-auto"
              >
                {updateSubdomainMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("integrations.buttons.saving")}
                  </>
                ) : (
                  t("integrations.buttons.saveConfiguration")
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Twilio Configuration Modal */}
      <Dialog open={isConfiguringTwilio} onOpenChange={setIsConfiguringTwilio}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("integrations.twilio.configureTitle")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 p-2 sm:p-0">
            <div className="grid grid-cols-1 gap-4">
              {/* Account SID */}
              <div className="space-y-2">
                <Label htmlFor="twilioAccountSid" className="text-sm font-medium">
                  {t("integrations.twilio.labels.accountSid")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="twilioAccountSid"
                  type="text"
                  placeholder={t("integrations.twilio.placeholders.accountSid")}
                  value={twilioData.accountSid}
                  onChange={(e) => {
                    setTwilioData({ ...twilioData, accountSid: e.target.value });
                    if (twilioValidation.hasFieldError("accountSid")) {
                      twilioValidation.clearFieldError("accountSid");
                    }
                  }}
                  className={twilioValidation.hasFieldError("accountSid") ? "border-destructive" : ""}
                  disabled={connectTwilioMutation.isPending}
                />
                {twilioValidation.hasFieldError("accountSid") && (
                  <p className="text-xs text-destructive">{twilioValidation.getFieldError("accountSid")}</p>
                )}
              </div>

              {/* Auth Token */}
              <div className="space-y-2">
                <Label htmlFor="twilioAuthToken" className="text-sm font-medium">
                  {t("integrations.twilio.labels.authToken")} <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="twilioAuthToken"
                    type={showTwilioAuthToken ? "text" : "password"}
                    placeholder={t("integrations.twilio.placeholders.authToken")}
                    value={twilioData.authToken}
                    onChange={(e) => {
                      setTwilioData({ ...twilioData, authToken: e.target.value });
                      if (twilioValidation.hasFieldError("authToken")) {
                        twilioValidation.clearFieldError("authToken");
                      }
                    }}
                    className={`pr-10 ${twilioValidation.hasFieldError("authToken") ? "border-destructive" : ""}`}
                    disabled={connectTwilioMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowTwilioAuthToken(!showTwilioAuthToken)}
                    disabled={connectTwilioMutation.isPending}
                  >
                    {showTwilioAuthToken ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {twilioValidation.hasFieldError("authToken") && (
                  <p className="text-xs text-destructive">{twilioValidation.getFieldError("authToken")}</p>
                )}
              </div>

              {/* Config Name */}
              <div className="space-y-2">
                <Label htmlFor="twilioConfigName" className="text-sm font-medium">
                  {t("integrations.twilio.labels.configName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="twilioConfigName"
                  type="text"
                  placeholder={t("integrations.twilio.placeholders.configName")}
                  value={twilioData.configName}
                  onChange={(e) => {
                    setTwilioData({ ...twilioData, configName: e.target.value });
                    if (twilioValidation.hasFieldError("configName")) {
                      twilioValidation.clearFieldError("configName");
                    }
                  }}
                  className={twilioValidation.hasFieldError("configName") ? "border-destructive" : ""}
                  disabled={connectTwilioMutation.isPending}
                />
                {twilioValidation.hasFieldError("configName") && (
                  <p className="text-xs text-destructive">{twilioValidation.getFieldError("configName")}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleTwilioReset}
                disabled={connectTwilioMutation.isPending}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {t("integrations.buttons.reset")}
              </Button>

              <div className="flex flex-col sm:flex-row gap-2 w-full order-1 sm:order-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsConfiguringTwilio(false);
                    twilioValidation.clearErrors();
                  }}
                  disabled={connectTwilioMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {t("integrations.buttons.cancel")}
                </Button>
                <Button
                  onClick={handleTwilioSave}
                  disabled={connectTwilioMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {connectTwilioMutation.isPending ? (
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
    </div>
  );
};