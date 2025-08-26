import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PublicMultiDashboardLayout } from "./PublicMultiDashboardLayout";
import { usePublicReportTheme } from "@/hooks/usePublicReportTheme";
import { usePublicDashboardData, usePublicDashboardStats } from "@/hooks/usePublicDashboardData";
import { ShareableDefaultListing, ShareableInsightListing, ShareableReviewListing, ShareableLocationListing, ShareablePost } from "@/api/publicDashboardApi";
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
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const PublicMultiDashboardReport: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [dashboardType, setDashboardType] = useState<string>("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [reviewFilter, setReviewFilter] = useState<string>("");
  const [postStatus, setPostStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Apply theme
  usePublicReportTheme();

  // Fetch dashboard data using the token and filters
  const { data, isLoading, error, refetch } = usePublicDashboardData({
    reportId: token || "",
    dashboardType,
    page: currentPage,
    limit: 9,
    search: debouncedSearchTerm,
    category: selectedCategory,
    city: selectedState,
    dateRange: dateRange.startDate && dateRange.endDate ? dateRange : undefined,
    postStatus: postStatus || undefined,
  });

  // Fetch stats data for metrics cards
  const { data: trendsData } = usePublicDashboardStats(token || "");

  // Process API data
  const apiData = data?.data;
  const isPostDashboard = dashboardType === "post";
  
  // Extract unique categories and states from API data for filters
  const availableCategories = useMemo(() => {
    if (!apiData) return [];
    const categories = new Set<string>();
    
    if ('listings' in apiData) {
      apiData.listings.forEach((listing: any) => {
        if (listing.category) categories.add(listing.category);
      });
    } else if ('posts' in apiData) {
      apiData.posts.forEach((post: ShareablePost) => {
        if (post.category) categories.add(post.category);
      });
    }
    
    return Array.from(categories).sort();
  }, [apiData]);

  const availableStates = useMemo(() => {
    if (!apiData) return [];
    const states = new Set<string>();
    
    if ('listings' in apiData) {
      apiData.listings.forEach((listing: any) => {
        if ('state' in listing && listing.state) states.add(listing.state);
        if (listing.zipCode) states.add(listing.zipCode); // Using zipCode as city/location
      });
    } else if ('posts' in apiData) {
      apiData.posts.forEach((post: ShareablePost) => {
        if (post.zipcode) states.add(post.zipcode);
      });
    }
    
    return Array.from(states).sort();
  }, [apiData]);

  // Get pagination from API response
  const pagination = apiData?.pagination;
  const totalItems = isPostDashboard 
    ? (pagination && 'totalPosts' in pagination ? pagination.totalPosts : 0)
    : (pagination && 'totalResults' in pagination ? pagination.totalResults : 0);
  const totalPages = pagination?.totalPages || 0;
  const paginatedData = isPostDashboard 
    ? (apiData && 'posts' in apiData ? apiData.posts : [])
    : (apiData && 'listings' in apiData ? apiData.listings : []);

  // Loading and error states
  if (isLoading) {
    return (
      <PublicMultiDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </PublicMultiDashboardLayout>
    );
  }

  if (error) {
    return (
      <PublicMultiDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load dashboard data</p>
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </PublicMultiDashboardLayout>
    );
  }

  // Handler functions
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: "category" | "state", value: string) => {
    if (type === "category") {
      setSelectedCategory(value);
    } else {
      setSelectedState(value);
    }
    setCurrentPage(1);
  };

  const handleReviewFilterChange = (value: string) => {
    setReviewFilter(value);
    setCurrentPage(1);
  };

  const handlePostStatusChange = (value: string) => {
    setPostStatus(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: { startDate: string; endDate: string }) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleDashboardTypeChange = (type: string) => {
    setDashboardType(type);
    setCurrentPage(1);
    // Reset filters when changing dashboard type
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedState("");
    setReviewFilter("");  
    setPostStatus("");
    setDateRange({ startDate: "", endDate: "" });
  };

  // Generate metrics cards from trends data
  const metricsCards = trendsData?.data?.stats
    ? [
        {
          title: "Total Listings",
          value: trendsData.data.stats.totalListings.toLocaleString(),
          subtitle: "Active locations",
          icon: Building2,
        },
        {
          title: "Avg. Rating",
          value: trendsData.data.stats.avgRating,
          subtitle: "Across all listings",
          icon: Star,
        },
        {
          title: "Total Reviews",
          value: trendsData.data.stats.totalReviews.toLocaleString(),
          subtitle: "Customer feedback",
          icon: MessageSquare,
        },
        {
          title: "Total Posts",
          value: trendsData.data.stats.totalPosts.toLocaleString(),
          subtitle: "Published content",
          icon: FileText,
        },
      ]
    : [
        { title: "Total Listings", value: "0", subtitle: "Active locations", icon: Building2 },
        { title: "Avg. Rating", value: "0", subtitle: "Across all listings", icon: Star },
        { title: "Total Reviews", value: "0", subtitle: "Customer feedback", icon: MessageSquare },
        { title: "Total Posts", value: "0", subtitle: "Published content", icon: FileText },
      ];

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
          {metricsCards.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </h3>
                    <div className="text-3xl font-bold text-foreground">
                      {metric.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metric.subtitle}
                    </p>
                  </div>
                  <div className="rounded-lg p-3 bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Dashboard Type Selector */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <Select value={dashboardType} onValueChange={handleDashboardTypeChange}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Select Dashboard Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Dashboard</SelectItem>
                  <SelectItem value="insight">Insight Dashboard</SelectItem>
                  <SelectItem value="review">Review Dashboard</SelectItem>
                  <SelectItem value="location">Location Dashboard</SelectItem>
                  <SelectItem value="post">Post Dashboard</SelectItem>
                </SelectContent>
              </Select>

              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value as "grid" | "list")}
              >
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Search and Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search listings, posts..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedState} onValueChange={(value) => handleFilterChange("state", value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {availableStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Filters for Post Dashboard */}
            {dashboardType === "post" && (
              <div className="flex gap-2">
                <Select value={postStatus} onValueChange={handlePostStatusChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Post Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="LIVE">Live</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>

        {/* Content Display */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {dashboardType === "post" ? "Posts" : "Listings"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Showing {paginatedData.length} of {totalItems} {dashboardType === "post" ? "posts" : "listings"}
            </p>
          </div>

          <div className="space-y-4">
            {paginatedData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <>
                {dashboardType === "post" ? (
                  <div className="grid gap-4">
                    {(paginatedData as ShareablePost[]).map((post: ShareablePost, index) => (
                      <Card key={post.id || index} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{post.title}</h3>
                            <Badge variant={post.status === "LIVE" ? "default" : "secondary"}>
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.content}</p>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{post.listingName}</span>
                            <span>{post.publishDate}</span>
                          </div>
                          {post.media?.images && (
                            <div className="mt-2">
                              <img 
                                src={post.media.images} 
                                alt="Post media" 
                                className="w-full h-32 object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className={`grid gap-4 ${
                    viewMode === "grid" 
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                      : "grid-cols-1"
                  }`}>
                    {paginatedData.map((listing: any, index) => (
                      <Card key={listing.id || index} className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={listing.profilePhoto} />
                            <AvatarFallback>
                              {(listing.listingName || listing.locationName)?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {listing.listingName || listing.locationName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {listing.category} • {listing.state || listing.zipCode}
                            </p>
                            {listing.rating && (
                              <div className="flex items-center mt-1">
                                <span className="text-sm font-medium">{listing.rating}</span>
                                <div className="flex ml-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3 w-3 ${
                                        i < Math.floor(Number(listing.rating)) 
                                          ? "text-yellow-400 fill-current" 
                                          : "text-gray-300"
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                            {dashboardType === "insight" && 'visibility' in listing && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                <div>Views: {listing.visibility.total_views}</div>
                                <div>Actions: {listing.customer_actions.website_clicks + listing.customer_actions.direction_requests}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </PublicMultiDashboardLayout>
  );
};