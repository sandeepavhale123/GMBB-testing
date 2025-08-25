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

            {/* Listing Cards */}
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[
                {
                  id: 1,
                  name: "Downtown Restaurant",
                  address: "123 Main St, New York, NY 10001",
                  rating: 4.5,
                  reviews: 128,
                  category: "Restaurant",
                  status: "Active",
                  phone: "(555) 123-4567"
                },
                {
                  id: 2,
                  name: "Coffee Corner Cafe",
                  address: "456 Oak Ave, Los Angeles, CA 90210",
                  rating: 4.8,
                  reviews: 89,
                  category: "Cafe",
                  status: "Active",
                  phone: "(555) 987-6543"
                },
                {
                  id: 3,
                  name: "Tech Solutions Hub",
                  address: "789 Tech Blvd, San Francisco, CA 94105",
                  rating: 4.2,
                  reviews: 45,
                  category: "Service",
                  status: "Active",
                  phone: "(555) 456-7890"
                },
                {
                  id: 4,
                  name: "Wellness Spa Center",
                  address: "321 Wellness Way, Miami, FL 33101",
                  rating: 4.7,
                  reviews: 167,
                  category: "Healthcare",
                  status: "Active",
                  phone: "(555) 234-5678"
                },
                {
                  id: 5,
                  name: "Fashion Boutique",
                  address: "654 Style St, Chicago, IL 60601",
                  rating: 4.3,
                  reviews: 92,
                  category: "Retail",
                  status: "Active",
                  phone: "(555) 345-6789"
                },
                {
                  id: 6,
                  name: "Auto Repair Shop",
                  address: "987 Garage Rd, Houston, TX 77001",
                  rating: 4.1,
                  reviews: 73,
                  category: "Service",
                  status: "Active",
                  phone: "(555) 678-9012"
                }
              ].map((listing) => (
                <div
                  key={listing.id}
                  className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        {listing.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {listing.category}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      listing.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      {listing.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {listing.phone}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">
                        ({listing.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      View Details
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicMultiDashboardLayout>
  );
};