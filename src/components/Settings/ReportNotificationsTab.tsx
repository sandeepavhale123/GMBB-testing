import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Heart,
  MessageSquare,
  FileText,
  BarChart3,
  MapPin,
  Search,
  Send,
  Info,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getNotificationSettings,
  updateNotificationSettings,
  UpdateNotificationSettingsPayload,
} from "@/api/integrationApi";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  frequency: "daily" | "when-updated" | "off";
  recipients: string;
  lastSent?: string;
  nextScheduled?: string;
  status: "active" | "paused";
}

// Helper functions for API mapping
const mapApiTypeToFrequency = (
  apiType: string
): "daily" | "when-updated" | "off" => {
  switch (apiType) {
    case "0":
      return "off";
    case "1":
      return "when-updated";
    case "2":
      return "daily";
    default:
      return "off";
  }
};

const mapFrequencyToApiType = (frequency: string): number => {
  switch (frequency) {
    case "off":
      return 0;
    case "when-updated":
      return 1;
    case "daily":
      return 2;
    default:
      return 0;
  }
};

// const getInitialReportTypes = (): ReportType[] => [
//   {
//     id: "review-report",
//     name: "New / Updated Review Report",
//     description:
//       "Detailed analysis of new and updated customer reviews and ratings, with report notifications sent daily or whenever updates occur.",
//     icon: MessageSquare,
//     enabled: false,
//     frequency: "off",
//     recipients: "Default recipients",
//     status: "paused",
//   },
//   {
//     id: "post-report",
//     name: "GMB Post Report",
//     description:
//       "Performance analysis of your GMB posts, with report notifications sent daily or whenever new updates are available.",
//     icon: FileText,
//     enabled: false,
//     frequency: "off",
//     recipients: "Default recipients",
//     status: "paused",
//   },
//   {
//     id: "geo-ranking",
//     name: "GEO Ranking Report",
//     description:
//       "Local search ranking performance analysis, with report notifications sent daily or whenever updates occur.",
//     icon: MapPin,
//     enabled: false,
//     frequency: "off",
//     recipients: "Default recipients",
//     status: "paused",
//   },
// ];

export const ReportNotificationsTab: React.FC = () => {
  const { t } = useI18nNamespace("Settings/reportNotificationsTab");
  const getInitialReportTypes = (t: (key: string) => string): ReportType[] => [
    {
      id: "review-report",
      name: t("reportNotificationsTab.reports.reviewReport.name"),
      description: t("reportNotificationsTab.reports.reviewReport.description"),
      icon: MessageSquare,
      enabled: false,
      frequency: "off",
      recipients: "Default recipients",
      status: "paused",
    },
    {
      id: "post-report",
      name: t("reportNotificationsTab.reports.postReport.name"),
      description: t("reportNotificationsTab.reports.postReport.description"),
      icon: FileText,
      enabled: false,
      frequency: "off",
      recipients: "Default recipients",
      status: "paused",
    },
    {
      id: "geo-ranking",
      name: t("reportNotificationsTab.reports.geoRanking.name"),
      description: t("reportNotificationsTab.reports.geoRanking.description"),
      icon: MapPin,
      enabled: false,
      frequency: "off",
      recipients: "Default recipients",
      status: "paused",
    },
  ];

  const [reportTypes, setReportTypes] = useState<ReportType[]>(
    getInitialReportTypes(t)
  );
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch notification settings on component mount
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        setLoading(true);
        const response = await getNotificationSettings();

        if (response.code === 200 && response.data?.notification) {
          const { gmbPostType, gmbReviewType, geoRankingType } =
            response.data.notification;

          setReportTypes((prev) =>
            prev.map((report) => {
              let frequency: "daily" | "when-updated" | "off" = "off";

              switch (report.id) {
                case "post-report":
                  frequency = mapApiTypeToFrequency(gmbPostType);
                  break;
                case "review-report":
                  frequency = mapApiTypeToFrequency(gmbReviewType);
                  break;
                case "geo-ranking":
                  frequency = mapApiTypeToFrequency(geoRankingType);
                  break;
              }

              return {
                ...report,
                frequency,
                enabled: frequency !== "off",
                status: frequency !== "off" ? "active" : "paused",
              };
            })
          );
        }
      } catch (error) {
        console.error("Failed to fetch notification settings:", error);
        toast({
          title: t("reportNotificationsTab.toast.error.title"),
          description: t("reportNotificationsTab.toast.error.load"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, [toast]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setReportTypes((prev) =>
      prev.map((report) => ({
        ...report,
        enabled: checked,
        status: checked ? "active" : "paused",
        frequency: checked
          ? report.frequency === "off"
            ? "daily"
            : report.frequency
          : "off",
      }))
    );
  };

  const handleReportToggle = async (reportId: string, enabled: boolean) => {
    const newFrequency = enabled ? "daily" : "off";
    await updateNotificationSetting(reportId, newFrequency);
  };

  const handleFrequencyChange = async (
    reportId: string,
    frequency: "daily" | "when-updated" | "off"
  ) => {
    await updateNotificationSetting(reportId, frequency);
  };

  const updateNotificationSetting = async (
    reportId: string,
    frequency: string
  ) => {
    try {
      setUpdating(reportId);

      // Build the complete payload with current state
      const currentState = reportTypes.reduce((acc, report) => {
        const currentFrequency =
          report.id === reportId ? frequency : report.frequency;
        const apiValue = mapFrequencyToApiType(currentFrequency);

        switch (report.id) {
          case "post-report":
            acc.gmbPostType = apiValue;
            break;
          case "review-report":
            acc.gmbReviewType = apiValue;
            break;
          case "geo-ranking":
            acc.geoRankingType = apiValue;
            break;
        }
        return acc;
      }, {} as UpdateNotificationSettingsPayload);

      const response = await updateNotificationSettings(currentState);

      if (response.code === 200) {
        // Update local state after successful API call
        setReportTypes((prev) =>
          prev.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  frequency: frequency as any,
                  enabled: frequency !== "off",
                  status: frequency !== "off" ? "active" : "paused",
                }
              : report
          )
        );

        toast({
          title: t("reportNotificationsTab.toast.success.title"),
          description: t("reportNotificationsTab.toast.success.description"),
        });
      }
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      toast({
        title: t("reportNotificationsTab.toast.error.title"),
        description: t("reportNotificationsTab.toast.error.update"),
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getFrequencyBadge = (frequency: string) => {
    const variants = {
      daily: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      "when-updated": "bg-green-100 text-green-800 hover:bg-green-100",
      off: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    };
    return variants[frequency as keyof typeof variants] || variants.off;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">
          {t("reportNotificationsTab.loading.message")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                {t("reportNotificationsTab.table.headers.reportType")}
              </TableHead>
              <TableHead>
                {t("reportNotificationsTab.table.headers.frequency")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <TableRow key={report.id}>
                  <TableCell>
                    <Checkbox
                      checked={report.enabled}
                      onCheckedChange={(checked) =>
                        handleReportToggle(report.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{report.name}</div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                {report.description}
                                <Info className="h-3 w-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{report.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={report.frequency}
                      onValueChange={(value) =>
                        handleFrequencyChange(report.id, value as any)
                      }
                      disabled={updating === report.id}
                    >
                      <SelectTrigger className="w-40">
                        {updating === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">
                          {t("reportNotificationsTab.frequency.daily")}
                        </SelectItem>
                        <SelectItem value="when-updated">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  {" "}
                                  {t(
                                    "reportNotificationsTab.frequency.whenUpdated"
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {t(
                                    "reportNotificationsTab.frequency.tooltip"
                                  )}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </SelectItem>
                        <SelectItem value="off">
                          {" "}
                          {t("reportNotificationsTab.frequency.off")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
