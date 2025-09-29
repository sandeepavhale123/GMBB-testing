import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RefreshCw, Image } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CustomPeriodModal } from "./CustomPeriodModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface InsightsHeaderProps {
  dateRange: string;
  customDateRange: DateRange | undefined;
  showCustomPicker: boolean;
  isLoading: boolean;
  isExporting: boolean;
  isRefreshing?: boolean;
  summary: any;
  onDateRangeChange: (value: string) => void;
  onCustomDateRangeChange: (date: DateRange | undefined) => void;
  onRefresh: () => void;
  onExportImage: () => void;
}
export const InsightsHeader: React.FC<InsightsHeaderProps> = ({
  dateRange,
  customDateRange,
  showCustomPicker,
  isLoading,
  isExporting,
  isRefreshing = false,
  summary,
  onDateRangeChange,
  onCustomDateRangeChange,
  onRefresh,
  onExportImage,
}) => {
  const { t } = useI18nNamespace("Insights/insightsHeader");
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const handleDateRangeChange = (value: string) => {
    if (value === "custom") {
      setIsCustomModalOpen(true);
    } else {
      onDateRangeChange(value);
    }
  };
  const handleCustomPeriodSubmit = (
    selectedDateRange: DateRange | undefined
  ) => {
    if (selectedDateRange) {
      onCustomDateRangeChange(selectedDateRange);
      onDateRangeChange("custom");
    }
  };
  const getDateRangeLabel = () => {
    if (dateRange === "custom" && customDateRange?.from) {
      const fromDate = format(customDateRange.from, "dd MMM yyyy");
      const toDate = customDateRange.to
        ? format(customDateRange.to, "dd MMM yyyy")
        : fromDate;
      return t("insightsHeader.fromTo", { from: fromDate, to: toDate });

      // `From: ${fromDate} - To: ${toDate}`;
    }
    if (summary?.timeframe) {
      return `From: ${format(
        new Date(summary.timeframe.start_date),
        "dd MMM yyyy"
      )} - To: ${format(new Date(summary.timeframe.end_date), "dd MMM yyyy")}`;
    }
    const today = new Date();
    let startDate: Date;
    switch (dateRange) {
      case "7":
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "90":
        startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "180":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 6,
          today.getDate()
        );
        break;
      case "270":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 9,
          today.getDate()
        );
        break;
      case "365":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth() - 12,
          today.getDate()
        );
        break;
      default:
        // 30 days
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return `From: ${format(startDate, "dd MMM yyyy")} - To: ${format(
      today,
      "dd MMM yyyy"
    )}`;
  };
  return (
    <>
      <div className="flex flex-col xl:flex-row xl:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("insightsHeader.title")}
          </h1>
          <p className="text-sm text-gray-600">
            {t("insightsHeader.subtitle")}
          </p>
        </div>

        <div className="flex-shrink-0">
          <p className="text-sm text-gray-600 font-medium">
            {getDateRangeLabel()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t("insightsHeader.selectDateRange")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t("insightsHeader.last7Days")}</SelectItem>
              <SelectItem value="30">
                {t("insightsHeader.last30Days")}
              </SelectItem>
              <SelectItem value="90">
                {t("insightsHeader.last90Days")}
              </SelectItem>
              <SelectItem value="180">
                {t("insightsHeader.last6Months")}
              </SelectItem>
              <SelectItem value="270">
                {t("insightsHeader.last9Months")}
              </SelectItem>
              <SelectItem value="365">
                {t("insightsHeader.last12Months")}
              </SelectItem>
              <SelectItem value="custom">
                {t("insightsHeader.customPeriod")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-1 ${
                isLoading || isRefreshing ? "animate-spin" : ""
              }`}
            />
            {isRefreshing
              ? t("insightsHeader.refreshing")
              : isLoading
              ? t("insightsHeader.loading")
              : t("insightsHeader.refresh")}
          </Button>

          <Button
            variant="outline"
            disabled={isExporting}
            onClick={onExportImage}
            className="w-full sm:w-auto hidden"
          >
            <Image className="w-4 h-4 mr-1" />
            {isExporting
              ? t("insightsHeader.exporting")
              : t("insightsHeader.exportImage")}
          </Button>
        </div>
      </div>

      <CustomPeriodModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomPeriodSubmit}
        initialDateRange={customDateRange}
      />
    </>
  );
};
