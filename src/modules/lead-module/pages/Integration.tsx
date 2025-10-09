import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plug,
  Settings,
  Plus,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const Integration: React.FC = () => {
  const { t } = useI18nNamespace("Lead-module-pages/integration");
  const integrations = [
    {
      name: t("integration.sales"),
      description: t("integration.slaesDesc"),
      status: t("statuses.Connected"),
      icon: "🏢",
      lastSync: t("integration.salesSync"),
    },
    {
      name: t("integration.hub"),
      description: t("integration.hubDesc"),
      status: t("statuses.Available"),
      icon: "🎯",
      lastSync: null,
    },
    {
      name: t("integration.email"),
      description: t("integration.emailDesc"),
      status: t("statuses.Connected"),
      icon: "📧",
      lastSync: t("integration.emailSync"),
    },
    {
      name: t("integration.slack"),
      description: t("integration.slackDesc"),
      status: t("statuses.Connected"),
      icon: "💬",
      lastSync: t("integration.slackSync"),
    },
    {
      name: t("integration.zapier"),
      description: t("integration.zapierDesc"),
      status: t("statuses.Available"),
      icon: "⚡",
      lastSync: null,
    },
    {
      name: t("integration.google"),
      description: t("integration.googleDesc"),
      status: t("statuses.Available"),
      icon: "📊",
      lastSync: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Integrations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="w-5 h-5" />
              {t("availableIntegrations.title")}
            </CardTitle>
            <CardDescription>
              {t("availableIntegrations.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    {integration.status === "Connected" ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          integration.status === "Connected"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {integration.status}
                      </Badge>
                      {integration.lastSync && (
                        <span className="text-xs text-muted-foreground">
                          Last sync: {integration.lastSync}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={
                        integration.status === "Connected"
                          ? "outline"
                          : "default"
                      }
                    >
                      {integration.status === "Connected" ? (
                        <>
                          <Settings className="w-4 h-4 mr-1" />
                          {t("buttons.configure")}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          {t("buttons.connect")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("apiSettings.title")}</CardTitle>
            <CardDescription>{t("apiSettings.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="api-key">{t("apiSettings.apiKeyLabel")}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="api-key"
                  type="password"
                  value="sk_live_••••••••••••••••"
                  readOnly
                />
                <Button size="icon" variant="outline">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="webhook-url">
                {t("apiSettings.webhookUrlLabel")}
              </Label>
              <Input
                id="webhook-url"
                placeholder={t("apiSettings.webhooksPlaceholder")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t("apiSettings.webhookToggleLabel")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("apiSettings.webhookToggleDescription")}
                </p>
              </div>
              <Switch />
            </div>

            <Button className="w-full">{t("buttons.saveApiSettings")}</Button>

            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">
                {t("apiSettings.usageTitle")}:
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t("apiSettings.requests")}:</span>
                  <span>2,450</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("apiSettings.rateLimit")}:</span>
                  <span>1000/hour</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("activity.title")}</CardTitle>
            <CardDescription>{t("activity.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  service: t("integration.sales"),
                  action: t("integration.salesAct"),
                  time: t("integration.salesSync"),
                  status: t("statuses.Success"),
                },
                {
                  service: t("integration.email"),
                  action: t("integration.emailAct"),
                  time: t("integration.emailTime"),
                  status: t("statuses.Success"),
                },
                {
                  service: t("integration.slack"),
                  action: t("integration.slackAct"),
                  time: t("integration.slackTime"),
                  status: t("statuses.Success"),
                },
                {
                  service: t("integration.hub"),
                  action: t("integration.hubAct"),
                  time: t("integration.hubTime"),
                  status: t("statuses.Error"),
                },
                {
                  service: t("integration.google"),
                  action: t("integration.googleAct"),
                  time: t("integration.googleTime"),
                  status: t("statuses.Success"),
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "Success"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium">{activity.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        activity.status === "Success"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integration;
