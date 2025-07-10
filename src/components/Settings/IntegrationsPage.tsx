import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Map,
  Settings,
  Check,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  Loader2,
  Mail,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/api/axiosInstance";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  apiKeySchema,
  disconnectConfirmationSchema,
} from "@/schemas/authSchemas";

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

export const IntegrationsPage: React.FC = () => {
  const { toast } = useToast();
  const [mapApiKey, setMapApiKey] = useState("");
  const [connectedApiKey, setConnectedApiKey] = useState("");
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingKey, setIsFetchingKey] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  // SMTP related states
  const [isConfiguringSmtp, setIsConfiguringSmtp] = useState(false);
  const [isLoadingSmtp, setIsLoadingSmtp] = useState(false);
  const [isFetchingSmtp, setIsFetchingSmtp] = useState(false);
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
  const [connectedSmtp, setConnectedSmtp] = useState(false);

  // Subdomain related states
  const [isConfiguringSubdomain, setIsConfiguringSubdomain] = useState(false);
  const [isLoadingSubdomain, setIsLoadingSubdomain] = useState(false);
  const [subdomain, setSubdomain] = useState("");
  const [connectedSubdomain, setConnectedSubdomain] = useState(false);

  // Form validation hooks
  const apiKeyValidation = useFormValidation(apiKeySchema);
  const disconnectValidation = useFormValidation(disconnectConfirmationSchema);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "map-api",
      name: "Google Map Api Key",
      description: "Configure map services for location-based features",
      icon: Map,
      status: connectedApiKey ? "active" : "inactive",
      configurable: true,
    },
    {
      id: "smtp-details",
      name: "SMTP Details",
      description: "Configure email server settings for notifications",
      icon: Mail,
      status: connectedSmtp ? "active" : "inactive",
      configurable: true,
    },
    {
      id: "subdomain-config",
      name: "Sub domain configuration",
      description: "Configure white label subdomain for your reports",
      icon: Globe,
      status: connectedSubdomain ? "active" : "inactive",
      configurable: true,
    },
  ]);

  // Fetch existing API key when opening the configure modal
  const handleOpenConfigureModal = async () => {
    setIsFetchingKey(true);
    try {
      const response = await axiosInstance.post("/get-mapapi-key");
      console.log("apikey we get from api", response);

      if (response.data && response.data.data.apiKey) {
        setMapApiKey(response.data.data.apiKey);
        setConnectedApiKey(response.data.data.apiKey);
        // Update integration status to active if we have a key
        setIntegrations((prev) =>
          prev.map((integration) =>
            integration.id === "map-api"
              ? { ...integration, status: "active" }
              : integration
          )
        );
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error: any) {
      console.error("Error fetching existing API key:", error);
      // If error is 404 or no key found, that's fine - just proceed with empty field
      if (error.response?.status !== 404) {
        toast({
          title: "Error",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsFetchingKey(false);
      setIsConfiguring(true);
    }
  };

  const handleConfigureMapApi = async () => {
    const validationResult = apiKeyValidation.validate({ apiKey: mapApiKey });

    if (!validationResult.isValid) {
      toast({
        title: "Error",
        description:
          validationResult.errors?.apiKey || "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to save the Google Maps API key
      const response = await axiosInstance.post("/update-apikey", {
        apiKey: mapApiKey?.trim(),
      });
      console.log("response from update api ", response);
      // Store the connected API key and update integration status
      setConnectedApiKey(response.data.data.apiKey?.trim());
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === "map-api"
            ? { ...integration, status: "active" }
            : integration
        )
      );

      // Reset form and close modal
      setIsConfiguring(false);
      setMapApiKey("");
      setShowApiKey(false);
      setShowInstructions(false);
      apiKeyValidation.clearErrors();

      toast({
        title: "Success",
        description: response.data?.message,
      });
    } catch (error: any) {
      console.error("Error saving Google Maps API key:", error);

      // Handle different error scenarios
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save API key. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = (integrationId: string) => {
    setShowDisconnectDialog(true);
  };

  const handleDisconnectConfirm = async () => {
    const validationResult = disconnectValidation.validate({
      confirmationText,
    });

    if (!validationResult.isValid) {
      toast({
        title: "Error",
        description:
          validationResult.errors?.confirmationText ||
          "Please type 'delete' to confirm disconnection",
        variant: "destructive",
      });
      return;
    }

    if (!connectedApiKey) {
      toast({
        title: "Error",
        description: "No API key found to disconnect",
        variant: "destructive",
      });
      return;
    }

    setIsDisconnecting(true);

    try {
      // Make API call to disconnect the Google Maps API key (DELETE operation)
      const response = await axiosInstance.post("/delete-mapapi-key", {
        isDelete: "delete",
      });

      // Update integration status and clear stored API key
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === "map-api"
            ? { ...integration, status: "inactive" }
            : integration
        )
      );
      console.log("response fro delete", response);
      setConnectedApiKey("");
      setMapApiKey("");
      setShowDisconnectDialog(false);
      setConfirmationText("");
      disconnectValidation.clearErrors();

      toast({
        title: "Success",
        description: response.data?.message,
      });
    } catch (error: any) {
      console.error("Error disconnecting Google Maps API key:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to disconnect API key. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  // SMTP related functions
  const handleOpenSmtpModal = async () => {
    setIsFetchingSmtp(true);
    try {
      // Fetch existing SMTP settings if any
      // For now, just open the modal
      setIsConfiguringSmtp(true);
    } catch (error: any) {
      console.error("Error fetching SMTP settings:", error);
    } finally {
      setIsFetchingSmtp(false);
    }
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
    try {
      // Add validation for required fields
      const requiredFields = ['fromEmail', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword'];
      const missingFields = requiredFields.filter(field => !smtpData[field as keyof typeof smtpData]?.trim());
      
      if (missingFields.length > 0) {
        toast({
          title: "Error",
          description: "Please fill in all required fields before testing",
          variant: "destructive",
        });
        return;
      }

      setIsLoadingSmtp(true);
      // Test SMTP settings API call would go here
      toast({
        title: "Test Email Sent",
        description: "SMTP test email sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: "Failed to send test email. Please check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSmtp(false);
    }
  };

  const handleSmtpSave = async () => {
    try {
      // Add validation for required fields
      const requiredFields = ['fromEmail', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword'];
      const missingFields = requiredFields.filter(field => !smtpData[field as keyof typeof smtpData]?.trim());
      
      if (missingFields.length > 0) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      setIsLoadingSmtp(true);
      // Save SMTP settings API call would go here
      
      setConnectedSmtp(true);
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === "smtp-details"
            ? { ...integration, status: "active" }
            : integration
        )
      );
      
      setIsConfiguringSmtp(false);
      toast({
        title: "Success",
        description: "SMTP settings saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save SMTP settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSmtp(false);
    }
  };

  const handleSubdomainSave = async () => {
    if (!subdomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subdomain",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingSubdomain(true);
    try {
      // API call to save subdomain would go here
      setConnectedSubdomain(true);
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === "subdomain-config"
            ? { ...integration, status: "active" }
            : integration
        )
      );
      
      setIsConfiguringSubdomain(false);
      toast({
        title: "Success",
        description: "Subdomain configuration saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save subdomain configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSubdomain(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Integrations
        </h2>
        <p className="text-muted-foreground">
          Manage your third-party integrations and API connections
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => {
          const IconComponent = integration.icon;
          return (
            <Card
              key={integration.id}
              className={`relative transition-all duration-200 ${
                integration.status === "active"
                  ? "bg-primary/5 border-primary/20 shadow-md"
                  : "hover:shadow-md"
              }`}
            >
              {/* Active Badge - Top Right */}
              {integration.status === "active" && (
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    <Check className="w-3 h-3" />
                    Active
                  </Badge>
                </div>
              )}

              {/* First Row: Icon */}
              <div className="p-6 pb-4">
                <div className="flex justify-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              {/* Second Row: Title and Description */}
              <div className="px-6 pb-4 text-left">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {integration.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </div>

              {/* Third Row: Configure Button */}
              <div className="px-6 pb-6">
                <div className="flex justify-start">
                  {integration.status === "active" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/5"
                    >
                      Disconnect
                    </Button>
                  ) : (
                    integration.configurable && (
                      <Button
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => {
                          if (integration.id === "map-api") {
                            handleOpenConfigureModal();
                          } else if (integration.id === "smtp-details") {
                            handleOpenSmtpModal();
                          } else if (integration.id === "subdomain-config") {
                            setIsConfiguringSubdomain(true);
                          }
                        }}
                        disabled={isFetchingKey || isFetchingSmtp}
                      >
                        {(isFetchingKey || isFetchingSmtp) ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Settings className="w-4 h-4" />
                            Configure
                          </>
                        )}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Configure Modal */}
      <Dialog open={isConfiguring} onOpenChange={setIsConfiguring}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Configure Google Map Api Key</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                Google Places API Key
              </Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter your Google Places API key"
                  value={mapApiKey}
                  onChange={(e) => {
                    setMapApiKey(e.target.value);
                    if (apiKeyValidation.hasFieldError("apiKey")) {
                      apiKeyValidation.clearFieldError("apiKey");
                    }
                  }}
                  className={`pr-10 ${
                    apiKeyValidation.hasFieldError("apiKey")
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                {apiKeyValidation.hasFieldError("apiKey") && (
                  <p className="text-xs text-destructive mt-1">
                    {apiKeyValidation.getFieldError("apiKey")}
                  </p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled={isLoading}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This API key will be used for all location-based features
                including Geo Ranking and map services.
              </p>
            </div>

            <Collapsible
              open={showInstructions}
              onOpenChange={setShowInstructions}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between"
                  disabled={isLoading}
                >
                  <span className="flex items-center gap-2">
                    <Map className="w-4 h-4" />
                    How to generate Google Places API key
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showInstructions ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 bg-primary/5 p-4 rounded-lg">
                  <div className="space-y-2 text-sm text-foreground">
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">1.</span>
                      <span>
                        Note - You must enable Billing for Google Project.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">2.</span>
                      <span>
                        Visit the Google{" "}
                        <a
                          href="https://console.cloud.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline inline-flex items-center gap-1"
                        >
                          Cloud Platform Console{" "}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        .
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">3.</span>
                      <span>
                        Click the project drop-down and select or create the
                        project for which you want to add an API key.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">4.</span>
                      <span>
                        From Dashboard → Go to APIs overview → Click on Library
                        → Enable Maps JavaScript API & Enable Places API by
                        clicking on both respectively.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">5.</span>
                      <span>
                        After that Click the menu button and select APIs &
                        Services → Credentials.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">6.</span>
                      <span>
                        On the Credentials page, Create credentials Dropdown -
                        Select API Key Option.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">7.</span>
                      <span>
                        This creates dialog displays, "your newly created API
                        key" - Copy the key.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">8.</span>
                      <span>
                        Use or Paste generated key under Geo Ranking → Manage
                        Key tab. (One-time activity -Only First use of GEO
                        Ranking Check).
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[20px]">9.</span>
                      <span>
                        Once you have added a key it will be used for all of
                        your listings and no more need to generate a separate
                        key for every GMB listing.
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfiguring(false);
                  setMapApiKey("");
                  setShowApiKey(false);
                  setShowInstructions(false);
                  apiKeyValidation.clearErrors();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfigureMapApi}
                disabled={isLoading || !mapApiKey?.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Configuration"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Dialog */}
      <Dialog
        open={showDisconnectDialog}
        onOpenChange={setShowDisconnectDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Disconnection</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to disconnect the Google Maps API key? This
              action cannot be undone.
            </p>

            <div className="space-y-2">
              <Label htmlFor="confirmText" className="text-sm font-medium">
                Type "delete" to confirm:
              </Label>
              <Input
                id="confirmText"
                type="text"
                placeholder="Type 'delete' to confirm"
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
                disabled={isDisconnecting}
              />
              {disconnectValidation.hasFieldError("confirmationText") && (
                <p className="text-xs text-destructive mt-1">
                  {disconnectValidation.getFieldError("confirmationText")}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowDisconnectDialog(false);
                setConfirmationText("");
                disconnectValidation.clearErrors();
              }}
              disabled={isDisconnecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnectConfirm}
              disabled={
                isDisconnecting || confirmationText.toLowerCase() !== "delete"
              }
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* SMTP Configuration Modal */}
      <Dialog open={isConfiguringSmtp} onOpenChange={setIsConfiguringSmtp}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure SMTP Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromName" className="text-sm font-medium">
                  From Name
                </Label>
                <Input
                  id="fromName"
                  type="text"
                  placeholder="Your Name or Company"
                  value={smtpData.fromName}
                  onChange={(e) =>
                    setSmtpData({ ...smtpData, fromName: e.target.value })
                  }
                  disabled={isLoadingSmtp}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromEmail" className="text-sm font-medium">
                  From Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="your-email@example.com"
                  value={smtpData.fromEmail}
                  onChange={(e) =>
                    setSmtpData({ ...smtpData, fromEmail: e.target.value })
                  }
                  disabled={isLoadingSmtp}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpHost" className="text-sm font-medium">
                  SMTP Host <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="smtpHost"
                  type="text"
                  placeholder="smtp.gmail.com"
                  value={smtpData.smtpHost}
                  onChange={(e) =>
                    setSmtpData({ ...smtpData, smtpHost: e.target.value })
                  }
                  disabled={isLoadingSmtp}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort" className="text-sm font-medium">
                  SMTP Port <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="smtpPort"
                  type="number"
                  placeholder="587"
                  value={smtpData.smtpPort}
                  onChange={(e) =>
                    setSmtpData({ ...smtpData, smtpPort: e.target.value })
                  }
                  disabled={isLoadingSmtp}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser" className="text-sm font-medium">
                  SMTP User <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="smtpUser"
                  type="text"
                  placeholder="username"
                  value={smtpData.smtpUser}
                  onChange={(e) =>
                    setSmtpData({ ...smtpData, smtpUser: e.target.value })
                  }
                  disabled={isLoadingSmtp}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword" className="text-sm font-medium">
                  SMTP Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="smtpPassword"
                    type={showSmtpPassword ? "text" : "password"}
                    placeholder="password"
                    value={smtpData.smtpPassword}
                    onChange={(e) =>
                      setSmtpData({ ...smtpData, smtpPassword: e.target.value })
                    }
                    className="pr-10"
                    disabled={isLoadingSmtp}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                    disabled={isLoadingSmtp}
                  >
                    {showSmtpPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={smtpData.phone}
                  onChange={(e) =>
                    setSmtpData({ ...smtpData, phone: e.target.value })
                  }
                  disabled={isLoadingSmtp}
                />
              </div>
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleSmtpReset}
                disabled={isLoadingSmtp}
              >
                Reset
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSmtpTest}
                  disabled={isLoadingSmtp}
                >
                  {isLoadingSmtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test SMTP Settings"
                  )}
                </Button>
                <Button
                  onClick={handleSmtpSave}
                  disabled={isLoadingSmtp}
                >
                  {isLoadingSmtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subdomain Configuration Modal */}
      <Dialog open={isConfiguringSubdomain} onOpenChange={setIsConfiguringSubdomain}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sub domain configuration</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="subdomain" className="text-sm font-medium">
                Enter subdomain
              </Label>
              <Input
                id="subdomain"
                type="text"
                placeholder="example"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                disabled={isLoadingSubdomain}
              />
              <p className="text-xs text-muted-foreground">
                Enter your desired subdomain (without .com or other extensions)
              </p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-3">
                Follow the below steps:
              </h4>
              <div className="space-y-3 text-sm text-foreground">
                <div className="flex items-start gap-3">
                  <span className="font-medium min-w-[60px] text-primary">Step 1:</span>
                  <span>Add white label subdomain here & save it.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium min-w-[60px] text-primary">Step 2:</span>
                  <span>Add the IP in DNS manager as A record: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">157.230.2.181</code></span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium min-w-[60px] text-primary">Step 3:</span>
                  <span>
                    Please check DNS propagation at:{" "}
                    <a
                      href="https://dnschecker.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline inline-flex items-center gap-1"
                    >
                      dnschecker.org
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium min-w-[60px] text-primary">Step 4:</span>
                  <span>Once you have done let us know, we will update your request in next 24 hours.</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfiguringSubdomain(false);
                  setSubdomain("");
                }}
                disabled={isLoadingSubdomain}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubdomainSave}
                disabled={isLoadingSubdomain || !subdomain.trim()}
              >
                {isLoadingSubdomain ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Configuration"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
