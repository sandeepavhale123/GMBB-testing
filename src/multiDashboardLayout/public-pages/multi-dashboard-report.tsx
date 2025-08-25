import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PublicMultiDashboardLayout } from "./PublicMultiDashboardLayout";
import { usePublicReportTheme } from "@/hooks/usePublicReportTheme";
import { usePublicMultiDashboard } from "@/hooks/usePublicMultiDashboard";
import { useDebounce } from "@/hooks/useDebounce";
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
  MapPin,
  Phone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PostCard } from "@/components/Posts/PostCard";
import { PostListItem } from "@/components/Posts/PostListItem";
import { transformPostDashboardPost } from "@/types/postTypes";
import type { DateRange } from "react-day-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Dummy data
const DUMMY_CATEGORIES = ["Restaurant", "Retail", "Healthcare", "Automotive", "Professional Services"];
const DUMMY_STATES = ["California", "Texas", "Florida", "New York", "Illinois"];

const DUMMY_LISTINGS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  listingId: `GMB${String(i + 1).padStart(3, '0')}`,
  locationName: `Business Location ${i + 1}`,
  category: DUMMY_CATEGORIES[i % DUMMY_CATEGORIES.length],
  address: `${100 + i} Main St, City ${i + 1}`,
  city: `City ${i + 1}`,
  state: DUMMY_STATES[i % DUMMY_STATES.length],
  zipCode: `${10000 + i}`,
  phone: `(555) ${String(i + 100).slice(-3)}-${String((i * 1234) % 10000).padStart(4, '0')}`,
  rating: (3.5 + (i % 3) * 0.5).toFixed(1),
  reviewCount: 50 + (i * 13) % 200,
  replyCount: 30 + (i * 7) % 150,
  reviewReply: `${50 + (i * 13) % 200} / ${30 + (i * 7) % 150}`,
  lastPost: ["Yesterday", "2 days ago", "1 week ago", "2 weeks ago"][i % 4],
  upcomingPost: ["Today", "Tomorrow", "Next week", "Next month"][i % 4],
  status: "Active",
  visibility: {
    search_views: 1000 + (i * 127) % 2000,
    maps_views: 500 + (i * 89) % 1500,
    total_views: 1500 + (i * 216) % 3500
  },
  customer_actions: {
    phone_calls: 10 + (i * 7) % 50,
    website_clicks: 20 + (i * 11) % 100,
    direction_requests: 15 + (i * 5) % 75
  },
  sentiment: {
    positive: 40 + (i * 3) % 80,
    neutral: 5 + (i * 2) % 20,
    negative: 2 + i % 10
  },
  autoReplyStatus: i % 2 === 0 ? "ON" : "OFF",
  photoCount: 10 + (i * 3) % 50,
  isSync: i % 5 === 0 ? 1 : 0
}));

const DUMMY_POSTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  content: `Post content ${i + 1} - Sample post text for demonstration`,
  status: ["live", "scheduled", "failed"][i % 3],
  scheduledDate: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
  location: `Business Location ${(i % 6) + 1}`,
  media: []
}));

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
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
              {[
                {
                  id: 1,
                  name: "Downtown Restaurant",
                  address: "123 Main St, New York, NY 10001",
                  rating: 4.5,
                  reviews: 128,
                  category: "Restaurant",
                  status: "Active",
                  phone: "(555) 123-4567",
                  listingId: "GMB001",
                  storeCode: "DTR-001",
                  profilePhoto: null,
                  totalListings: 15,
                  lastPost: "2 days ago",
                  upcomingPost: "Tomorrow",
                  visibility: 4250,
                  completeness: 95
                },
                {
                  id: 2,
                  name: "Coffee Corner Cafe",
                  address: "456 Oak Ave, Los Angeles, CA 90210",
                  rating: 4.8,
                  reviews: 89,
                  category: "Cafe",
                  status: "Active",
                  phone: "(555) 987-6543",
                  listingId: "GMB002",
                  storeCode: "CCC-002",
                  profilePhoto: null,
                  totalListings: 8,
                  lastPost: "1 day ago",
                  upcomingPost: "Today",
                  visibility: 3150,
                  completeness: 88
                },
                {
                  id: 3,
                  name: "Tech Solutions Hub",
                  address: "789 Tech Blvd, San Francisco, CA 94105",
                  rating: 4.2,
                  reviews: 45,
                  category: "Service",
                  status: "Active",
                  phone: "(555) 456-7890",
                  listingId: "GMB003",
                  storeCode: "TSH-003",
                  profilePhoto: null,
                  totalListings: 12,
                  lastPost: "3 days ago",
                  upcomingPost: "Next week",
                  visibility: 2890,
                  completeness: 92
                },
                {
                  id: 4,
                  name: "Wellness Spa Center",
                  address: "321 Wellness Way, Miami, FL 33101",
                  rating: 4.7,
                  reviews: 167,
                  category: "Healthcare",
                  status: "Active",
                  phone: "(555) 234-5678",
                  listingId: "GMB004",
                  storeCode: "WSC-004",
                  profilePhoto: null,
                  totalListings: 6,
                  lastPost: "4 days ago",
                  upcomingPost: "This week",
                  visibility: 3750,
                  completeness: 97
                },
                {
                  id: 5,
                  name: "Fashion Boutique",
                  address: "654 Style St, Chicago, IL 60601",
                  rating: 4.3,
                  reviews: 92,
                  category: "Retail",
                  status: "Active",
                  phone: "(555) 345-6789",
                  listingId: "GMB005",
                  storeCode: "FB-005",
                  profilePhoto: null,
                  totalListings: 9,
                  lastPost: "1 week ago",
                  upcomingPost: "Next month",
                  visibility: 2234,
                  completeness: 85
                },
                {
                  id: 6,
                  name: "Auto Repair Shop",
                  address: "987 Garage Rd, Houston, TX 77001",
                  rating: 4.1,
                  reviews: 73,
                  category: "Service",
                  status: "Active",
                  phone: "(555) 678-9012",
                  listingId: "GMB006",
                  storeCode: "ARS-006",
                  profilePhoto: null,
                  totalListings: 11,
                  lastPost: "5 days ago",
                  upcomingPost: "End of month",
                  visibility: 1980,
                  completeness: 78
                }
              ].map((listing) => 
                viewMode === 'grid' ? (
                  <div
                    key={listing.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20 flex flex-col"
                  >
                    {/* Header with Logo and Title */}
                    <div className="flex items-start gap-4 mb-4 relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-lg leading-tight mb-1 truncate">
                          {listing.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          ID: {listing.listingId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {listing.storeCode && (
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                            {listing.storeCode}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Address & Contact */}
                    <div className="mb-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground font-medium">
                            {listing.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-foreground font-medium">
                            {listing.phone}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded">
                          {listing.category}
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                          {listing.reviews}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Reviews
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-700 dark:text-green-300">
                          {listing.rating}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Rating
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="mb-5 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">
                          Visibility:
                        </span>
                        <span className="text-foreground font-medium">
                          {listing.visibility.toLocaleString()} views
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">
                          Complete:
                        </span>
                        <span className="text-foreground font-medium">
                          {listing.completeness}%
                        </span>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-auto pt-4 border-t border-border">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-green-600">
                            {listing.rating}
                          </span>
                        </div>
                        <div className="text-center min-w-0">
                          <div className="font-semibold text-foreground">
                            {listing.reviews}
                          </div>
                          <div className="text-muted-foreground">
                            Reviews
                          </div>
                        </div>
                        <div className="text-center min-w-0">
                          <div className="font-semibold text-foreground truncate">
                            {listing.lastPost}
                          </div>
                          <div className="text-muted-foreground">
                            Last Post
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div
                    key={listing.id}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 flex items-center gap-4">
                      {/* Logo */}
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>

                      {/* Basic Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground text-sm truncate">
                            {listing.name}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          ID: {listing.listingId}
                        </p>
                        {listing.storeCode && (
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                            {listing.storeCode}
                          </span>
                        )}
                      </div>

                      {/* Dashboard Stats */}
                      <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-6 text-xs flex-wrap sm:flex-nowrap">
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-green-600">
                            {listing.rating}
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-foreground">
                            {listing.reviews}
                          </div>
                          <div className="text-muted-foreground">
                            Reviews
                          </div>
                        </div>
                        <div className="text-center min-w-0">
                          <div className="font-semibold text-foreground truncate">
                            {listing.lastPost}
                          </div>
                          <div className="text-muted-foreground">
                            Last Post
                          </div>
                        </div>
                        <div className="text-center min-w-0">
                          <div className="font-semibold text-foreground truncate">
                            {listing.upcomingPost}
                          </div>
                          <div className="text-muted-foreground">
                            Upcoming
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicMultiDashboardLayout>
  );
};