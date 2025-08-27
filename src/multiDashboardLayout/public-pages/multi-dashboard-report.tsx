import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { PublicMultiDashboardLayout } from "./PublicMultiDashboardLayout";
import { applyStoredTheme } from "@/utils/themeUtils";
import { usePublicDashboardData } from "@/hooks/usePublicDashboardData";
import { usePublicCategoryAndState } from "@/hooks/usePublicCategoryAndState";
import { usePublicReportConfig } from "@/hooks/usePublicReportConfig";
import { ShareableDefaultListing, ShareableInsightListing, ShareableReviewListing, ShareableLocationListing, ShareablePost } from "@/api/publicDashboardApi";
import { useDebounce } from "@/hooks/useDebounce";
import { getDashboardType, getDashboardDisplayName, getDashboardFilterType } from "@/utils/dashboardMappings";
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
  Calendar,
  Heart,
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

  // Apply theme for public report
  React.useEffect(() => {
    applyStoredTheme();
  }, []);

  // Fetch report configuration first
  const { data: reportConfig, isLoading: configLoading, error: configError } = usePublicReportConfig(token || "");
  
  // Set initial dashboard type from API config, but allow user override
  const configDashboardFilterType = reportConfig?.data?.report?.dashboardFilterType ? parseInt(reportConfig.data.report.dashboardFilterType) : undefined;
  const configDashboardType = configDashboardFilterType ? getDashboardType(configDashboardFilterType) : 'default';
  
  // Use user-selected dashboard type or fall back to config
  const activeDashboardType = dashboardType;
  const activeDashboardFilterType = getDashboardFilterType(activeDashboardType);
  
  // Update dashboard type when config loads (only if user hasn't changed it)
  React.useEffect(() => {
    if (configDashboardType && dashboardType === 'default') {
      setDashboardType(configDashboardType);
    }
  }, [configDashboardType, dashboardType]);

  // Fetch dashboard data using the token and filters (only when config is loaded)
  const { data, isLoading, error, refetch } = usePublicDashboardData({
    reportId: token || "",
    dashboardFilterType: activeDashboardFilterType,
    page: currentPage,
    limit: 9,
    search: debouncedSearchTerm,
    category: selectedCategory,
    city: selectedState,
    dateRange: dateRange.startDate && dateRange.endDate ? dateRange : undefined,
    postStatus: postStatus || undefined,
    reviewFilter,
  });


  // Fetch categories and states for filters
  const { data: categoryStateData, isLoading: categoryStateLoading } = usePublicCategoryAndState(token || "");
  
  const availableCategories = categoryStateData?.data?.categories || [];
  const availableStates = categoryStateData?.data?.states || [];

  // Process API data immediately after fetching
  const apiData = data?.data;
  const isPostDashboard = activeDashboardType === "post";

  // Update Select values to show "all" when empty
  const displayCategory = selectedCategory || "all";
  const displayState = selectedState || "all";
  const displayPostStatus = postStatus || "all";

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
  if (configLoading || isLoading) {
    return (
      <PublicMultiDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {configLoading ? "Loading report configuration..." : "Loading dashboard data..."}
            </p>
          </div>
        </div>
      </PublicMultiDashboardLayout>
    );
  }

  if (configError || error) {
    return (
      <PublicMultiDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">
              {configError ? "Failed to load report configuration" : "Failed to load dashboard data"}
            </p>
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

  // Generate metrics cards from report config stats
  const metricsCards = reportConfig?.data?.stats
    ? [
      {
        title: "Total Listings",
        value: reportConfig.data.stats.totalListings.toLocaleString(),
        subtitle: "Active locations",
        icon: Building2,
      },
      {
        title: "Avg. Rating",
        value: reportConfig.data.stats.avgRating,
        subtitle: "Across all listings",
        icon: Star,
      },
      {
        title: "Total Posts",
        value: reportConfig.data.stats.totalPosts.toLocaleString(),
        subtitle: "Published content",
        icon: FileText,
      },
      {
        title: "Total Reviews",
        value: reportConfig.data.stats.totalReviews.toLocaleString(),
        subtitle: "Customer feedback",
        icon: MessageSquare,
      },
    ]
    : [
      { title: "Total Listings", value: "0", subtitle: "Active locations", icon: Building2 },
      { title: "Avg. Rating", value: "0", subtitle: "Across all listings", icon: Star },
      { title: "Total Posts", value: "0", subtitle: "Published content", icon: FileText },
      { title: "Total Reviews", value: "0", subtitle: "Customer feedback", icon: MessageSquare },
    ];

  return (
    <PublicMultiDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        {/* <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Multi-Dashboard Report
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of business performance metrics
          </p>
        </div> */}

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
                <h3 className="text-lg font-semibold mb-2">
                  GMB Listing – {getDashboardDisplayName(activeDashboardType)} dashboard
                </h3>
               <div className="flex flex-col sm:flex-row gap-4">
                <Select value={activeDashboardType} onValueChange={handleDashboardTypeChange}>
                 <SelectTrigger className="sm:w-[250px]">
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
                <Select value={displayCategory} onValueChange={(value) => handleFilterChange("category", value === "all" ? "" : value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={displayState} onValueChange={(value) => handleFilterChange("state", value === "all" ? "" : value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {availableStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                 {activeDashboardType === "review" && (
                  <Select
                    value={reviewFilter}
                    onValueChange={handleReviewFilterChange}
                  >
                    <SelectTrigger className="w-full sm:w-52">
                      <SelectValue placeholder="Review Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Reviews</SelectItem>
                      <SelectItem value="1">Un - Responded Review</SelectItem>
                      <SelectItem value="2">Un - Responded ARE</SelectItem>
                      <SelectItem value="3">Un - Responded DNR</SelectItem>
                      <SelectItem value="4">Exclude ARE Review</SelectItem>
                      <SelectItem value="5">Exclude DNR Review</SelectItem>
                      <SelectItem value="6">Exclude ARE/DNR Review</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              {/* Additional Filters for Post Dashboard */}
              {activeDashboardType === "post" && (
                <div className="flex gap-2">
                  <Select value={displayPostStatus} onValueChange={(value) => setPostStatus(value === "all" ? "" : value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Post Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="LIVE">Live</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              </div>
            </div>

          


          </div>
        </Card>

        {/* Content Display */}
        <Card className="p-6">
          <div className="mb-4">
            {/* <h3 className="text-lg font-semibold mb-2">
              {dashboardType === "post" ? "Posts" : "Listings"}
            </h3> */}
            <p className="text-sm text-muted-foreground">
              Showing {paginatedData.length} of {totalItems} {activeDashboardType === "post" ? "posts" : "listings"}
            </p>
          </div>

          <div className="space-y-4">
            {paginatedData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <>
                {activeDashboardType === "post" ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(paginatedData as ShareablePost[]).map((post: ShareablePost, index) => (
                        <Card key={post.id || index} className="overflow-hidden hover:shadow-md transition-shadow relative flex flex-col h-full">
                           {/* Post Image */}
                           <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden relative">
                             {post.media?.images ? (
                               <img
                                 src={post.media.images}
                                 alt="Post media"
                                 className="w-full h-full object-cover"
                               />
                             ) : (
                               <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                 <span className="text-gray-500 text-sm font-medium">
                                   Image not available
                                 </span>
                               </div>
                             )}
                             
                             {/* Arrow Button for GMB Post */}
                             {post.searchUrl && (
                               <button
                                 onClick={() => window.open(post.searchUrl, '_blank')}
                                 className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                                 title="View on Google My Business"
                               >
                                 <ExternalLink className="w-4 h-4 text-primary" />
                               </button>
                             )}
                           </div>

                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 line-clamp-2">
                                  {post.title || "Untitled Post"}
                                </h3>
                                {post.listingName && (
                                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                                    {post.listingName}
                                  </p>
                                )}
                              </div>
                              <Badge variant={post.status === "LIVE" ? "default" : "secondary"}>
                                {post.status}
                              </Badge>
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {post.content}
                            </p>
                          </CardContent>

                          <CardFooter className="p-4 pt-0 flex justify-between mt-auto">
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {post.publishDate}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(paginatedData as ShareablePost[]).map((post: ShareablePost, index) => (
                        <div
                          key={post.id || index}
                          className="border border-border rounded-lg bg-card p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20"
                        >
                          {/* Date positioned at top right */}
                          <div className="absolute bottom-1 left-1 sm:top-1 sm:right-1 sm:bottom-auto sm:left-auto flex items-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded border">
                            <Calendar className="w-3 h-3 mr-1" />
                            {post.publishDate}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                              {/* Thumbnail */}
                              <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {post.media?.images ? (
                                  <img
                                    src={post.media.images}
                                    alt="Post media"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white text-xs font-medium">IMG</span>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0 sm:pr-20">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-foreground truncate">
                                    {post.title || "Untitled Post"}
                                  </h3>
                                  <Badge variant={post.status === "LIVE" ? "default" : "secondary"}>
                                    {post.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1 mb-1">
                                  {post.content}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  {post.listingName && (
                                    <span className="text-primary">{post.listingName}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className={`grid gap-4 ${viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                    }`}>
                    {viewMode === "grid" ? (
                      // Grid View - Rich detailed cards
                      paginatedData.map((listing: any, index) => (
                        <div
                          key={listing.id || index}
                          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20 flex flex-col"
                        >
                          {/* Header with Logo and Title */}
                          <div className="flex items-start gap-4 mb-4 relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                              {listing.profilePhoto ? (
                                <img
                                  src={listing.profilePhoto}
                                  alt={listing.locationName || listing.listingName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-foreground text-lg leading-tight mb-1 truncate">
                                {listing.locationName || listing.listingName}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                ID: {listing.listingId || listing.id}
                              </p>
                              {listing.zipCode && (
                                <p className="text-xs text-muted-foreground">
                                  Zip: {listing.zipCode}
                                </p>
                              )}
                              {listing.city && (
                                <p className="text-xs text-muted-foreground">
                                  City: {listing.city}
                                </p>
                              )}
                              {listing.category && (
                                <p className="text-xs text-muted-foreground">
                                  {listing.category}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {listing.storeCode && (
                                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                                  {listing.storeCode}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Dashboard-specific content */}
                          {dashboardType === "insight" ? (
                            // Insights Dashboard Content
                            <>
                              {/* Visibility Stats */}
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                  Visibility
                                </h5>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center p-2 bg-blue-50 rounded">
                                    <div className="font-semibold text-blue-600">
                                      {listing.visibility?.search_views || 0}
                                    </div>
                                    <div className="text-gray-500">Search</div>
                                  </div>
                                  <div className="text-center p-2 bg-green-50 rounded">
                                    <div className="font-semibold text-green-600">
                                      {listing.visibility?.maps_views || 0}
                                    </div>
                                    <div className="text-gray-500">Maps</div>
                                  </div>
                                  <div className="text-center p-2 bg-purple-50 rounded">
                                    <div className="font-semibold text-purple-600">
                                      {listing.visibility?.total_views || 0}
                                    </div>
                                    <div className="text-gray-500">Total</div>
                                  </div>
                                </div>
                              </div>

                              {/* Customer Actions */}
                              <div className="mb-5">
                                <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                  Customer Actions
                                </h5>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                    <ExternalLink className="w-3 h-3 text-blue-500" />
                                    <span>
                                      {listing.customer_actions?.website_clicks || 0} Clicks
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                    <MapPin className="w-3 h-3 text-green-500" />
                                    <span>
                                      {listing.customer_actions?.direction_requests || 0} Directions
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                    <Phone className="w-3 h-3 text-orange-500" />
                                    <span>
                                      {listing.customer_actions?.phone_calls || 0} Calls
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                    <MessageSquare className="w-3 h-3 text-purple-500" />
                                    <span>
                                      {listing.customer_actions?.messages || 0} Messages
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : dashboardType === "review" ? (
                            // Review Dashboard Content
                            <>
                              {/* Rating Section */}
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                  Review Stats
                                </h5>
                                <div className="flex items-center gap-2 mb-3">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  <span className="font-bold text-sm text-foreground">
                                    {listing.avgRating || listing.rating}
                                  </span>
                                </div>
                              </div>

                              {/* Review Stats */}
                              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                                <div className="grid grid-cols-2 text-sm">
                                  <div className="text-center border-r border-gray-300">
                                    <span className="text-muted-foreground font-medium">
                                      Reviews / Replies
                                    </span>
                                    <p className="font-semibold text-foreground">
                                      {listing.reviewCount || 0} / {listing.replyCount || 0}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <span className="text-muted-foreground font-medium">
                                      Auto reply:
                                    </span>
                                    <p className="font-semibold text-foreground">
                                      {listing.autoReplyStatus || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Review Sentiment */}
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                  Review Sentiment
                                </h5>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center p-2 bg-green-50 rounded">
                                    <div className="font-semibold text-green-600">
                                      {listing.sentiment?.positive || 0}
                                    </div>
                                    <div className="text-gray-500">Positive</div>
                                  </div>
                                  <div className="text-center p-2 bg-gray-50 rounded">
                                    <div className="font-semibold text-gray-600">
                                      {listing.sentiment?.neutral || 0}
                                    </div>
                                    <div className="text-gray-500">Neutral</div>
                                  </div>
                                  <div className="text-center p-2 bg-red-50 rounded">
                                    <div className="font-semibold text-red-600">
                                      {listing.sentiment?.negative || 0}
                                    </div>
                                    <div className="text-gray-500">Negative</div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : dashboardType === "location" ? (
                            // Location Dashboard Content
                            <>
                              {/* Address & Contact */}
                              <div className="mb-4 space-y-3">
                                <div className="flex items-start gap-3">
                                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground font-medium truncate">
                                      {listing.address}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {listing.state} {listing.zipCode}
                                    </p>
                                  </div>
                                </div>
                                {listing.phone && (
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
                                )}
                              </div>

                              {/* Stats Grid */}
                              <div className="mb-4 grid grid-cols-2 gap-3">
                                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-3 text-center">
                                  <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                    {listing.photoCount || 0}
                                  </div>
                                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                    Photos
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

                              {/* Quick Actions */}
                              <div className="flex gap-2 mb-4">
                                {listing.website && (
                                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium">
                                    <ExternalLink className="w-3 h-3" />
                                    Website
                                  </button>
                                )}
                                {listing.map && (
                                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-lg transition-colors text-sm font-medium">
                                    <MapPin className="w-3 h-3" />
                                    Maps
                                  </button>
                                )}
                              </div>
                            </>
                          ) : (
                            // Default Dashboard Content
                            <>
                              {/* Rating Section */}
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                  Avg. Rating
                                </h5>
                                <div className="flex items-center gap-2 mb-3">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  <span className="font-bold text-sm text-foreground">
                                    {listing.rating}
                                  </span>
                                </div>
                              </div>

                              {/* Engagement Stats */}
                              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                                <div className="text-sm">
                                  <div className="text-center">
                                    <span className="text-muted-foreground font-medium">
                                      Reviews / Replies
                                    </span>
                                    <p className="font-semibold text-foreground">
                                      {listing.reviewReply}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Scheduled Posts */}
                              <div className="mb-5 space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground font-medium">
                                    Last Post:
                                  </span>
                                  <span className="text-foreground font-medium">
                                    {listing.lastPost}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground font-medium">
                                    Upcoming:
                                  </span>
                                  <span className="text-foreground font-medium">
                                    {listing.upcomingPost}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* View Details Button - Hidden for public report */}
                          {/* No button needed for public dashboard */}
                        </div>
                      ))
                    ) : (
                      // List View - Horizontal layout
                      paginatedData.map((listing: any, index) => (
                        <div
                          key={listing.id || index}
                          className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative">
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              {/* Logo */}
                              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                                {listing.profilePhoto ? (
                                  <img
                                    src={listing.profilePhoto}
                                    alt={listing.locationName || listing.listingName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Building2 className="w-5 h-5 text-primary" />
                                )}
                              </div>

                              {/* Basic Info */}
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-foreground text-sm truncate">
                                  {listing.locationName || listing.listingName}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  ID: {listing.listingId || listing.id}
                                </p>
                                {listing.storeCode && (
                                  <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                                    {listing.storeCode}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Dashboard Type Specific Data */}
                            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-6 text-xs flex-wrap sm:flex-nowrap">
                              {dashboardType === "insight" ? (
                                <>
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">
                                      {listing.visibility?.search_views || 0}
                                    </div>
                                    <div className="text-muted-foreground">Search</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">
                                      {listing.visibility?.maps_views || 0}
                                    </div>
                                    <div className="text-muted-foreground">Maps</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-orange-600">
                                      {listing.customer_actions?.phone_calls || 0}
                                    </div>
                                    <div className="text-muted-foreground">Calls</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-purple-600">
                                      {listing.customer_actions?.website_clicks || 0}
                                    </div>
                                    <div className="text-muted-foreground">Clicks</div>
                                  </div>
                                </>
                              ) : dashboardType === "review" ? (
                                <>
                                  <div className="text-center">
                                    <div className="font-semibold text-yellow-600">
                                      {listing.avgRating || listing.rating}
                                    </div>
                                    <div className="text-muted-foreground">Rating</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">
                                      {listing.sentiment?.positive || 0}
                                    </div>
                                    <div className="text-muted-foreground">Positive</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-red-600">
                                      {listing.sentiment?.negative || 0}
                                    </div>
                                    <div className="text-muted-foreground">Negative</div>
                                  </div>
                                </>
                              ) : dashboardType === "location" ? (
                                <>
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">
                                      {listing.photoCount || 0}
                                    </div>
                                    <div className="text-muted-foreground">Photos</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">
                                      {listing.rating}
                                    </div>
                                    <div className="text-muted-foreground">Rating</div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="text-center">
                                    <div className="font-semibold text-yellow-600">
                                      {listing.rating}
                                    </div>
                                    <div className="text-muted-foreground">Rating</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">
                                      {listing.reviewReply}
                                    </div>
                                    <div className="text-muted-foreground">Reviews</div>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* View Details Button - Hidden for public report */}
                            {/* No button needed for public dashboard */}
                          </div>
                        </div>
                      ))
                    )}
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