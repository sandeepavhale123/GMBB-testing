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
  
  // State management - replicated from MultiDashboard
  const [dashboardType, setDashboardType] = useState<string>("default");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"0" | "1" | "2" | "3" | "4" | "5" | "6">("0");
  const [postStatus, setPostStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const itemsPerPage = 9;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Load theme for public report
  usePublicReportTheme();
  
  // Fetch public dashboard data
  const { data, isLoading, error, trendsData } = usePublicMultiDashboard(token || "");
  
  // Filter dummy data based on current filters
  const filteredListings = useMemo(() => {
    let filtered = [...DUMMY_LISTINGS];
    
    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(listing => 
        listing.locationName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        listing.listingId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        listing.zipCode.includes(debouncedSearchTerm)
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }
    
    // Apply state filter
    if (selectedState && selectedState !== "all") {
      filtered = filtered.filter(listing => listing.state === selectedState);
    }
    
    return filtered;
  }, [debouncedSearchTerm, selectedCategory, selectedState]);

  const filteredPosts = useMemo(() => {
    let filtered = [...DUMMY_POSTS];
    
    // Apply search filter for posts
    if (debouncedSearchTerm) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        post.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }
    
    // Apply post status filter
    if (postStatus !== "all") {
      filtered = filtered.filter(post => post.status === postStatus);
    }
    
    return filtered;
  }, [debouncedSearchTerm, selectedCategory, selectedState, postStatus, dateRange]);

  // Pagination
  const totalItems = dashboardType === "post" ? filteredPosts.length : filteredListings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = dashboardType === "post" 
    ? filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredListings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  // Helper functions
  const getStatusColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return "text-green-600";
    if (numRating >= 3.0) return "text-blue-600";
    return "text-red-600";
  };

  const getStatusText = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return "Excellent";
    if (numRating >= 3.0) return "Good";
    return "Poor";
  };

  // Handler functions
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: "category" | "state", value: string) => {
    if (type === "category") {
      setSelectedCategory(value === "all" ? "" : value);
    } else {
      setSelectedState(value === "all" ? "" : value);
    }
    setCurrentPage(1);
  };

  const handleReviewFilterChange = (value: "0" | "1" | "2" | "3" | "4" | "5" | "6") => {
    setReviewFilter(value);
    setCurrentPage(1);
  };

  const handlePostStatusChange = (value: string) => {
    setPostStatus(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleDashboardTypeChange = (newType: string) => {
    setDashboardType(newType);
    setCurrentPage(1);
  };

  // Generate metrics cards from trends data or dummy data
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
    : [
        {
          title: "Total Listings",
          value: DUMMY_LISTINGS.length.toString(),
          subtitle: "Active locations",
          trend: "+2 this month",
          icon: Building2,
          bgColor: "bg-blue-100",
          iconBgColor: "bg-blue-500",
        },
        {
          title: "Avg. Rating",
          value: "4.4",
          subtitle: "Across all listings",
          trend: "↑ 0.3 points",
          icon: Star,
          bgColor: "bg-yellow-100",
          iconBgColor: "bg-yellow-500",
        },
        {
          title: "Total Review",
          value: "2,847",
          subtitle: "Customer feedback",
          trend: "Improving",
          icon: MessageSquare,
          bgColor: "bg-green-100",
          iconBgColor: "bg-green-500",
        },
        {
          title: "Total Posts",
          value: "156",
          subtitle: "Published this month",
          trend: "+12 this week",
          icon: FileText,
          bgColor: "bg-purple-100",
          iconBgColor: "bg-purple-500",
        },
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

        {/* Search and Filters */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  placeholder="Search by listing name, ID, or ZIP code"
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger className="w-40 bg-background">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    <SelectItem value="all">All Categories</SelectItem>
                    {DUMMY_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedState}
                  onValueChange={(value) => handleFilterChange("state", value)}
                >
                  <SelectTrigger className="w-40 bg-background">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    <SelectItem value="all">All States</SelectItem>
                    {DUMMY_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* GMB Listings */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold">
                {dashboardType === "post" ? "Posts" : "GMB Listings"}
              </h3>
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select
                    value={dashboardType}
                    onValueChange={handleDashboardTypeChange}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Dashboard Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Dashboard</SelectItem>
                      <SelectItem value="insight">Insight Dashboard</SelectItem>
                      <SelectItem value="review">Review Dashboard</SelectItem>
                      <SelectItem value="location">Location Dashboard</SelectItem>
                      <SelectItem value="post">Post Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Review Filter Dropdown - Only show for review dashboard */}
                {dashboardType === "review" && (
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

                {/* Post Filters - Only show for post dashboard */}
                {dashboardType === "post" && (
                  <>
                    <Select
                      value={postStatus}
                      onValueChange={handlePostStatusChange}
                    >
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Post status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Posts</SelectItem>
                        <SelectItem value="scheduled">Scheduled Post</SelectItem>
                        <SelectItem value="live">Live Post</SelectItem>
                        <SelectItem value="failed">Failed Post</SelectItem>
                      </SelectContent>
                    </Select>
                    <DateRangePicker
                      date={dateRange}
                      onDateChange={handleDateRangeChange}
                      className="w-full sm:w-auto"
                    />
                  </>
                )}

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

            {/* Display counts */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {dashboardType === "post"
                  ? `Showing ${paginatedData.length} of ${totalItems} posts`
                  : `Showing ${paginatedData.length} of ${totalItems} listings`}
              </p>
            </div>

            {/* Content Display */}
            <TooltipProvider>
              {dashboardType === "post" ? (
                // Post Dashboard Layout
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedData.map((post: any) => (
                      <PostCard
                        key={post.id}
                        post={transformPostDashboardPost(post)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {paginatedData.map((post: any) => {
                      const transformedPost = transformPostDashboardPost(post);
                      return (
                        <PostListItem
                          key={post.id}
                          post={transformedPost}
                          onClonePost={(post) => {
                            console.log("Clone post:", post);
                          }}
                        />
                      );
                    })}
                  </div>
                )
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedData.map((listing: any) => (
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <h4 className="font-bold text-foreground text-lg leading-tight mb-1 truncate">
                                {listing.locationName}
                              </h4>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{listing.locationName}</p>
                            </TooltipContent>
                          </Tooltip>
                          <p className="text-xs text-muted-foreground">
                            ID: {listing.listingId}
                          </p>
                          {(dashboardType === "insight" || dashboardType === "review") && listing.zipCode && (
                            <p className="text-xs text-muted-foreground">
                              Zip: {listing.zipCode}
                            </p>
                          )}
                          {(dashboardType === "insight" || dashboardType === "review") && listing.city && (
                            <p className="text-xs text-muted-foreground">
                              City: {listing.city}
                            </p>
                          )}
                          {dashboardType === "insight" && listing.category && (
                            <p className="text-xs text-muted-foreground">
                              Category: {listing.category}
                            </p>
                          )}
                        </div>
                        {listing.isSync === 1 && (
                          <Loader2 className="w-4 h-4 animate-spin text-primary absolute top-0 right-0" />
                        )}
                      </div>

                      {/* Dashboard Type Specific Content */}
                      {dashboardType === "insight" ? (
                        // Insight Dashboard Content
                        <>
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                              Visibility Stats
                            </h5>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div className="text-center p-2 bg-blue-50 rounded">
                                <div className="text-lg font-bold text-blue-600">
                                  {listing.visibility?.search_views || 0}
                                </div>
                                <div className="text-xs text-gray-500">Search</div>
                              </div>
                              <div className="text-center p-2 bg-green-50 rounded">
                                <div className="text-lg font-bold text-green-600">
                                  {listing.visibility?.maps_views || 0}
                                </div>
                                <div className="text-xs text-gray-500">Maps</div>
                              </div>
                              <div className="text-center p-2 bg-purple-50 rounded">
                                <div className="text-lg font-bold text-purple-600">
                                  {listing.visibility?.total_views || 0}
                                </div>
                                <div className="text-xs text-gray-500">Total</div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                              Customer Actions
                            </h5>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="text-center p-2 bg-orange-50 rounded">
                                <div className="font-semibold text-orange-600">
                                  {listing.customer_actions?.phone_calls || 0}
                                </div>
                                <div className="text-gray-500">Calls</div>
                              </div>
                              <div className="text-center p-2 bg-indigo-50 rounded">
                                <div className="font-semibold text-indigo-600">
                                  {listing.customer_actions?.website_clicks || 0}
                                </div>
                                <div className="text-gray-500">Clicks</div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : dashboardType === "review" ? (
                        // Review Dashboard Content
                        <>
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                              Review Stats
                            </h5>
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span
                                className={`font-bold text-sm ${getStatusColor(listing.rating)}`}
                              >
                                {listing.rating}
                              </span>
                            </div>
                          </div>

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
                        </>
                      ) : (
                        // Default Dashboard Content
                        <>
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                              Avg. Rating
                            </h5>
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span
                                className={`font-bold text-sm ${getStatusColor(listing.rating)}`}
                              >
                                {listing.rating} {getStatusText(listing.rating)}
                              </span>
                            </div>
                          </div>

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

                    </div>
                  ))}
                </div>
              ) : (
                // List View for Listings
                <div className="space-y-2">
                  {paginatedData.map((listing: any) => (
                    <div
                      key={listing.listingId || listing.id}
                      className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground text-sm truncate">
                                {listing.locationName}
                              </h4>
                              {listing.isSync === 1 && (
                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              ID: {listing.listingId || listing.id}
                            </p>
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
                              <div className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span
                                  className={`font-semibold ${getStatusColor(listing.rating)}`}
                                >
                                  {listing.rating}
                                </span>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-foreground">
                                  {listing.reviewCount || 0}
                                </div>
                                <div className="text-muted-foreground">Reviews</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-green-600">
                                  {listing.sentiment?.positive || 0}
                                </div>
                                <div className="text-muted-foreground">Positive</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-gray-600">
                                  {listing.sentiment?.neutral || 0}
                                </div>
                                <div className="text-muted-foreground">Neutral</div>
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
                              <div className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span
                                  className={`font-semibold ${getStatusColor(listing.rating)}`}
                                >
                                  {listing.rating}
                                </span>
                              </div>
                              <div className="text-center min-w-0">
                                <div className="font-semibold text-foreground truncate">
                                  {listing.phone || "N/A"}
                                </div>
                                <div className="text-muted-foreground">Phone</div>
                              </div>
                              <div className="text-center min-w-0">
                                <div className="font-semibold text-foreground truncate">
                                  {listing.state || "N/A"}
                                </div>
                                <div className="text-muted-foreground">State</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span
                                  className={`font-semibold ${getStatusColor(listing.rating)}`}
                                >
                                  {listing.rating}
                                </span>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-foreground">
                                  {listing.reviewReply}
                                </div>
                                <div className="text-muted-foreground">Reviews</div>
                              </div>
                              <div className="text-center min-w-0">
                                <div className="font-semibold text-foreground truncate">
                                  {listing.lastPost}
                                </div>
                                <div className="text-muted-foreground">Last Post</div>
                              </div>
                              <div className="text-center min-w-0">
                                <div className="font-semibold text-foreground truncate">
                                  {listing.upcomingPost}
                                </div>
                                <div className="text-muted-foreground">Upcoming</div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TooltipProvider>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  {dashboardType === "post"
                    ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
                        currentPage * itemsPerPage,
                        totalItems
                      )} of ${totalItems} posts`
                    : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
                        currentPage * itemsPerPage,
                        totalItems
                      )} of ${totalItems} listings`}
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const maxVisiblePages = 5;
                      if (totalPages <= maxVisiblePages) {
                        return Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          )
                        );
                      }
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }
                      const pages = [];
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <Button
                            key={i}
                            variant={currentPage === i ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>
                        );
                      }
                      return pages;
                    })()}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicMultiDashboardLayout>
  );
};