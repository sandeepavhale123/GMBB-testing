import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { PublicMultiDashboardLayout } from "./PublicMultiDashboardLayout";
import { usePublicReportTheme } from "@/hooks/usePublicReportTheme";
import { usePublicMultiDashboard } from "@/hooks/usePublicMultiDashboard";
import {
  Search,
  BarChart3,
  Star,
  MessageSquare,
  Building2,
  FileText,
  Loader2,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

export const PublicMultiDashboardReport: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [viewMode, setViewMode] = useState("grid");
  
  // Load theme for public report
  usePublicReportTheme();
  
  // Fetch public dashboard data
  const { data, isLoading, error, trendsData } = usePublicMultiDashboard(token || "");

  // Handle loading state
  if (isLoading) {
    return (
      <PublicMultiDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Loading dashboard report...
            </p>
          </div>
        </div>
      </PublicMultiDashboardLayout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <PublicMultiDashboardLayout>
        <div className="text-center py-12">
          <div className="text-destructive mb-4">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Error Loading Report</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Unable to load the dashboard report with token: {token}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </PublicMultiDashboardLayout>
    );
  }

  // Generate metrics cards from trends data
  const metricsCards = trendsData?.data?.stats
    ? [
        {
          title: "Total Listings",
          value: trendsData.data.stats.totalListings.toLocaleString(),
          subtitle: "Active locations",
          trend: "+2 this month",
          icon: Building2,
          bgColor: "bg-blue-100",
          iconBgColor: "bg-blue-500",
        },
        {
          title: "Avg. Rating",
          value: trendsData.data.stats.avgRating,
          subtitle: "Across all listings",
          trend: "↑ 0.3 points",
          icon: Star,
          bgColor: "bg-yellow-100",
          iconBgColor: "bg-yellow-500",
        },
        {
          title: "Total Review",
          value: trendsData.data.stats.totalReviews.toLocaleString(),
          subtitle: "Customer feedback",
          trend: "Improving",
          icon: MessageSquare,
          bgColor: "bg-green-100",
          iconBgColor: "bg-green-500",
        },
        {
          title: "Total Posts",
          value: trendsData.data.stats.totalPosts.toLocaleString(),
          subtitle: "Published this month",
          trend: "+12 this week",
          icon: FileText,
          bgColor: "bg-purple-100",
          iconBgColor: "bg-purple-500",
        },
      ]
    : [];

  return (
    <PublicMultiDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Multi-Dashboard Report
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of business performance metrics
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsCards.length > 0 ? (
            metricsCards.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </h3>
                      <div className="text-3xl font-bold text-foreground">
                        {metric.value}
                      </div>
                    </div>
                    <div
                      className={`${metric.iconBgColor} rounded-lg p-3 flex items-center justify-center ml-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-lg ml-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Filters Section - Read Only */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  placeholder="Search by listing name or ZIP code"
                  className="w-full pl-10 pr-4 py-2 border border-input bg-muted text-muted-foreground rounded-md cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
              <div className="flex gap-2">
                <Select disabled>
                  <SelectTrigger className="w-40 bg-muted">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                </Select>
                <Select disabled>
                  <SelectTrigger className="w-40 bg-muted">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                </Select>
              </div>
            </div>
          </div>

          {/* Dashboard Controls - Read Only */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold">GMB Listings</h3>
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select disabled>
                    <SelectTrigger className="w-full sm:w-48 bg-muted">
                      <SelectValue placeholder="Default Dashboard" />
                    </SelectTrigger>
                  </Select>
                </div>

                <ToggleGroup
                  type="single"
                  value={viewMode}
                  onValueChange={(value) => value && setViewMode(value)}
                >
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <Grid3X3 className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Placeholder for dashboard content */}
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Dashboard Content</h3>
              <p className="text-muted-foreground">
                This is a read-only public view of the multi-dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicMultiDashboardLayout>
  );
};