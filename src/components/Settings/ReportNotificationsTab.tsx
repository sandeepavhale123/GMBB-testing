import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  FileText,
  MapPin,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
  const [gmbPostSetting, setGmbPostSetting] = useState<string[]>(["ALL"]);
  const [gmbReviewSetting, setGmbReviewSetting] = useState<string[]>(["ALL"]);
  const { toast } = useToast();

  // Fetch notification settings on component mount
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        setLoading(true);
        const response = await getNotificationSettings();

        if (response.code === 200 && response.data?.notification) {
          const { gmbPostType, gmbReviewType, geoRankingType, gmbPostSetting: postSetting, gmbReviewSetting: reviewSetting } =
            response.data.notification;

          // Load action settings
          if (postSetting && postSetting.length > 0) {
            setGmbPostSetting(postSetting);
          }
          if (reviewSetting && reviewSetting.length > 0) {
            setGmbReviewSetting(reviewSetting);
          }

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

      // Include action settings
      currentState.gmbPostSetting = gmbPostSetting;
      currentState.gmbReviewSetting = gmbReviewSetting;

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
      toast({
        title: t("reportNotificationsTab.toast.error.title"),
        description: t("reportNotificationsTab.toast.error.update"),
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleActionSettingChange = async (
    type: "review" | "post",
    values: string[]
  ) => {
    try {
      setUpdating(type === "review" ? "review-report" : "post-report");

      const newPostSetting = type === "post" ? values : gmbPostSetting;
      const newReviewSetting = type === "review" ? values : gmbReviewSetting;

      // Build payload
      const currentState = reportTypes.reduce((acc, report) => {
        const apiValue = mapFrequencyToApiType(report.frequency);
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

      currentState.gmbPostSetting = newPostSetting;
      currentState.gmbReviewSetting = newReviewSetting;

      const response = await updateNotificationSettings(currentState);

      if (response.code === 200) {
        if (type === "post") {
          setGmbPostSetting(values);
        } else {
          setGmbReviewSetting(values);
        }

        toast({
          title: t("reportNotificationsTab.toast.success.title"),
          description: t("reportNotificationsTab.toast.success.description"),
        });
      }
    } catch (error) {
      toast({
        title: t("reportNotificationsTab.toast.error.title"),
        description: t("reportNotificationsTab.toast.error.update"),
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const toggleReviewOption = (value: string) => {
    let newValues: string[];
    if (value === "ALL") {
      newValues = ["ALL"];
    } else {
      // Remove "ALL" if selecting specific ratings
      const filtered = gmbReviewSetting.filter((v) => v !== "ALL");
      if (filtered.includes(value)) {
        newValues = filtered.filter((v) => v !== value);
      } else {
        newValues = [...filtered, value];
      }
      // If no selections, default to "ALL"
      if (newValues.length === 0) {
        newValues = ["ALL"];
      }
    }
    handleActionSettingChange("review", newValues);
  };

  const togglePostOption = (value: string) => {
    let newValues: string[];
    if (value === "ALL") {
      newValues = ["ALL"];
    } else {
      // Remove "ALL" if selecting specific options
      const filtered = gmbPostSetting.filter((v) => v !== "ALL");
      if (filtered.includes(value)) {
        newValues = filtered.filter((v) => v !== value);
      } else {
        newValues = [...filtered, value];
      }
      // If no selections, default to "ALL"
      if (newValues.length === 0) {
        newValues = ["ALL"];
      }
    }
    handleActionSettingChange("post", newValues);
  };

  const getReviewSettingLabel = () => {
    if (gmbReviewSetting.includes("ALL")) {
      return t("reportNotificationsTab.action.all");
    }
    return gmbReviewSetting.map((v) => `${v}★`).join(", ");
  };

  const getPostSettingLabel = () => {
    if (gmbPostSetting.includes("ALL")) {
      return t("reportNotificationsTab.action.postOptions.all");
    }
    return gmbPostSetting
      .map((v) => t(`reportNotificationsTab.action.postOptions.${v.toLowerCase()}`))
      .join(", ");
  };

  const renderActionCell = (reportId: string) => {
    const isUpdating = updating === reportId;

    if (reportId === "review-report") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-40 justify-between"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="truncate">{getReviewSettingLabel()}</span>
                  <span className="ml-2">▼</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-background border z-50">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
                <Checkbox
                  checked={gmbReviewSetting.includes("ALL")}
                  onCheckedChange={() => toggleReviewOption("ALL")}
                />
                <span>{t("reportNotificationsTab.action.all")}</span>
              </label>
              {["5", "4", "3", "2", "1"].map((star) => (
                <label
                  key={star}
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                >
                  <Checkbox
                    checked={gmbReviewSetting.includes(star)}
                    onCheckedChange={() => toggleReviewOption(star)}
                  />
                  <span>{t(`reportNotificationsTab.action.reviewOptions.${star}star`)}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    if (reportId === "post-report") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-40 justify-between"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span className="truncate">{getPostSettingLabel()}</span>
                  <span className="ml-2">▼</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-background border z-50">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
                <Checkbox
                  checked={gmbPostSetting.includes("ALL")}
                  onCheckedChange={() => togglePostOption("ALL")}
                />
                <span>{t("reportNotificationsTab.action.postOptions.all")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
                <Checkbox
                  checked={gmbPostSetting.includes("Failed")}
                  onCheckedChange={() => togglePostOption("Failed")}
                />
                <span>{t("reportNotificationsTab.action.postOptions.failed")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded">
                <Checkbox
                  checked={gmbPostSetting.includes("Live")}
                  onCheckedChange={() => togglePostOption("Live")}
                />
                <span>{t("reportNotificationsTab.action.postOptions.live")}</span>
              </label>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    // GEO Ranking - empty cell
    return <span className="text-muted-foreground">-</span>;
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
              <TableHead>
                {t("reportNotificationsTab.table.headers.action")}
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
                      <Icon className="h-10 w-16 md:h-5 md:w-5 text-muted-foreground" />
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
                  <TableCell>{renderActionCell(report.id)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
