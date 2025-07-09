import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Loader } from "../ui/loader";
import { MoreHorizontal, Check, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";
import type {
  BusinessInfo,
  BusinessStatistics,
} from "../../types/businessInfoTypes";

interface BusinessProfileCardProps {
  businessInfo: BusinessInfo | null;
  statistics: BusinessStatistics | null;
  isLoading?: boolean;
  isRefreshing?: boolean;
  activeTab?: "business-info" | "opening-hours" | "edit-log";
  onTabChange?: (tab: "business-info" | "opening-hours" | "edit-log") => void;
  onRefresh?: () => void;
}

export const BusinessProfileCard: React.FC<BusinessProfileCardProps> = ({
  businessInfo,
  statistics,
  isLoading,
  isRefreshing = false,
  activeTab = "business-info",
  onTabChange,
  onRefresh,
}) => {
  const tabs = [
    { id: "business-info" as const, label: "Business Information" },
    { id: "opening-hours" as const, label: "Opening Hours" },
    { id: "edit-log" as const, label: "Edit Log" },
  ];

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-3 gap-8 mb-6">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex flex-col-reverse gap-3 justify-between mb-6 lg:flex-row lg:items-center lg:gap-0">
          <div className="flex items-start gap-4">
            {/* Business Logo/Avatar - Updated with shadow and better image handling */}
            <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md border border-gray-200">
              {businessInfo?.profile_photo ? (
                <img
                  src={businessInfo.profile_photo}
                  alt={`${businessInfo.name} profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to default avatar if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl ${
                  businessInfo?.profile_photo ? "hidden" : ""
                }`}
              >
                {businessInfo?.name?.charAt(0) || "B"}
              </div>
            </div>

            {/* Business Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {businessInfo?.name || "Business Name"}
                </h2>
                {businessInfo?.verification_status === "verified" && (
                  <Check className="w-5 h-5 text-primary bg-primary/20 rounded-full p-1" />
                )}
              </div>

              {/* Profile views and Position stats moved here */}
              <div className="flex items-center gap-6">
                <div
                  className="bg-secondary p-2 rounded"
                  style={{ width: "110px" }}
                >
                  <div className="text-lg font-bold text-gray-900">
                    {statistics?.profile_views || 0}
                  </div>
                  <div className="text-xs text-gray-500">Profile views</div>
                </div>

                <div
                  className="bg-secondary p-2 rounded"
                  style={{ width: "110px" }}
                >
                  <div className="text-lg font-bold text-gray-900">
                    {statistics?.position || 0}
                  </div>
                  <div className="text-xs text-gray-500">Position</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons with Visibility after */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-2">
              <Button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 text-sm"
              >
                {isRefreshing ? (
                  <>
                    <Loader size="sm" className="mr-2" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh"
                )}
              </Button>
              <Button variant="outline" className="px-4 py-2 text-sm">
                Edit access
              </Button>
            </div>

            {/* Visibility Section */}
            <div className="w-64 hidden lg:block">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">Visibility</div>
                <div className="text-sm font-medium text-gray-900">
                  {statistics?.visibility_score || 0}%
                </div>
              </div>
              <Progress
                value={statistics?.visibility_score || 0}
                className="h-2 bg-gray-200"
                animated={false}
              />
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer with Tabs */}
      <CardFooter className="p-0">
        <div className="w-full border-t border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </CardFooter>
    </Card>
  );
};
