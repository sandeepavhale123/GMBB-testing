import React, { useState } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RefreshCw, Image } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CustomPeriodModal } from "./CustomPeriodModal";
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
  onExportImage
}) => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const handleDateRangeChange = (value: string) => {
    if (value === "custom") {
      setIsCustomModalOpen(true);
    } else {
      onDateRangeChange(value);
    }
  };
  const handleCustomPeriodSubmit = (selectedDateRange: DateRange | undefined) => {
    if (selectedDateRange) {
      onCustomDateRangeChange(selectedDateRange);
      onDateRangeChange("custom");
    }
  };
  const getDateRangeLabel = () => {
    if (dateRange === "custom" && customDateRange?.from) {
      const fromDate = format(customDateRange.from, "dd MMM yyyy");
      const toDate = customDateRange.to ? format(customDateRange.to, "dd MMM yyyy") : fromDate;
      return `From: ${fromDate} - To: ${toDate}`;
    }
    if (summary?.timeframe) {
      return `From: ${format(new Date(summary.timeframe.start_date), "dd MMM yyyy")} - To: ${format(new Date(summary.timeframe.end_date), "dd MMM yyyy")}`;
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
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case "270":
        startDate = new Date(today.getFullYear(), today.getMonth() - 9, today.getDate());
        break;
      case "365":
        startDate = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate());
        break;
      default:
        // 30 days
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    return `From: ${format(startDate, "dd MMM yyyy")} - To: ${format(today, "dd MMM yyyy")}`;
  };
  return <>
      <div className="flex flex-col xl:flex-row xl:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">GMB Insights</h1>
          <p className="text-sm text-gray-600">Performance analytics for your Google Business Profile.</p>
        </div>

        <div className="flex-shrink-0">
          <p className="text-sm text-gray-600 font-medium">
            {getDateRangeLabel()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="180">Last 6 Months</SelectItem>
              <SelectItem value="270">Last 9 Months</SelectItem>
              <SelectItem value="365">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Period</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="w-full sm:w-auto" onClick={onRefresh} disabled={isLoading || isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading || isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : isLoading ? "Loading..." : "Refresh"}
          </Button>

          <Button variant="outline" className="w-full sm:w-auto" disabled={isExporting} onClick={onExportImage}>
            <Image className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Image"}
          </Button>
        </div>
      </div>

      <CustomPeriodModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} onSubmit={handleCustomPeriodSubmit} initialDateRange={customDateRange} />
    </>;
};