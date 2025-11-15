import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  BarChart3,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Star,
  Eye,
  Phone,
  ExternalLink,
  Grid3X3,
  List,
  FileText,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Building2,
  Loader2,
  Loader,
  Share2,
  ArrowRight,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PostCard } from "@/components/Posts/PostCard";
import { PostListItem } from "@/components/Posts/PostListItem";
import { transformPostDashboardPost } from "@/types/postTypes";
import type { DateRange } from "react-day-picker";
import { useTrendsData } from "@/api/trendsApi";
import {
  useDashboardData,
  useInsightsDashboardData,
  useReviewDashboardData,
  useListingDashboardData,
  useLocationDashboardData,
  usePostsDashboardData,
  useCategoryAndStateData,
  setDashboard,
} from "@/api/dashboardApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useReviewDashboardPolling } from "@/hooks/useReviewDashboardPolling";
import { useDashboardPolling } from "@/hooks/useDashboardPolling";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { formatDateForBackend } from "@/utils/dateUtils";
import { ShareReportModal } from "@/components/Dashboard/ShareReportModal";
import { CopyUrlModal } from "@/components/Dashboard/CopyUrlModal";
import { ExportReviewsModal } from "@/components/BulkReview/ExportReviewsModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Dashboard type mapping for API
const DASHBOARD_TYPE_MAPPING = {
  default: "1",
  insight: "3",
  review: "4",
  location: "8",
  post: "9",
} as const;

// Reverse mapping to convert API numeric IDs to frontend string keys
const DASHBOARD_ID_TO_TYPE_MAPPING = {
  "1": "default",
  "3": "insight",
  "4": "review",
  "8": "location",
  "9": "post",
} as const;
export const MultiDashboard: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardPages/multiDashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profileData, isLoading: profileLoading } = useProfile();
  const [dashboardType, setDashboardType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [reviewFilter, setReviewFilter] = useState<
    "0" | "1" | "2" | "3" | "4" | "5" | "6"
  >("0");
  const [postStatus, setPostStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isUpdatingDashboard, setIsUpdatingDashboard] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCopyUrlModal, setShowCopyUrlModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [generatedReportUrl, setGeneratedReportUrl] = useState("");
  const itemsPerPage = 9;
  const debouncedSearchTerm = useDebounce(searchTerm, 3000);

  // Initialize dashboard type from localStorage, then profile data
  useEffect(() => {
    // Check localStorage first
    const localDashboardType = localStorage.getItem("dashboardType");
    if (
      localDashboardType &&
      DASHBOARD_TYPE_MAPPING[
        localDashboardType as keyof typeof DASHBOARD_TYPE_MAPPING
      ]
    ) {
      setDashboardType(localDashboardType);
      return;
    }

    // Fall back to profile data
    if (profileData?.dashboardFilterType) {
      const savedType =
        DASHBOARD_ID_TO_TYPE_MAPPING[
          profileData.dashboardFilterType as keyof typeof DASHBOARD_ID_TO_TYPE_MAPPING
        ];

      if (savedType) {
        setDashboardType(savedType);
      } else {
        setDashboardType("default");
      }
    } else if (profileData && !profileData.dashboardFilterType) {
      setDashboardType("default");
    }
  }, [profileData]);

  // Fetch trends data
  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useTrendsData();

  // Fetch category and state data
  const {
    data: categoryAndStateData,
    isLoading: categoryStateLoading,
    error: categoryStateError,
  } = useCategoryAndStateData();

  const defaultParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: selectedCategory,
      state: selectedState,
    }),
    [
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      selectedCategory,
      selectedState,
    ]
  );

  const insightsParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: selectedCategory,
      state: selectedState,
    }),
    [
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      selectedCategory,
      selectedState,
    ]
  );

  const reviewParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: selectedCategory,
      state: selectedState,
      review: reviewFilter,
    }),
    [
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      selectedCategory,
      selectedState,
      reviewFilter,
    ]
  );

  const locationParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: selectedCategory,
      state: selectedState,
    }),
    [
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      selectedCategory,
      selectedState,
    ]
  );

  const postParams = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: selectedCategory,
      city: selectedState,
      dateRange: {
        startDate: dateRange?.from ? formatDateForBackend(dateRange.from) : "",
        endDate: dateRange?.to ? formatDateForBackend(dateRange.to) : "",
      },
      postStatus: postStatus === "all" ? "" : postStatus,
    }),
    [
      currentPage,
      itemsPerPage,
      debouncedSearchTerm,
      selectedCategory,
      selectedState,
      dateRange,
      postStatus,
    ]
  );

  // Conditionally call the appropriate hook based on dashboard type
  // const defaultDashboardQuery = useDashboardData(
  //   {
  //     page: currentPage,
  //     limit: itemsPerPage,
  //     search: debouncedSearchTerm,
  //     category: selectedCategory,
  //     state: selectedState,
  //   },
  //   dashboardType === "default"
  // );
  // const insightsDashboardQuery = useInsightsDashboardData(
  //   {
  //     page: currentPage,
  //     limit: itemsPerPage,
  //     search: debouncedSearchTerm,
  //     category: selectedCategory,
  //     state: selectedState,
  //   },
  //   dashboardType === "insight"
  // );
  // const reviewDashboardQuery = useReviewDashboardData(
  //   {
  //     page: currentPage,
  //     limit: itemsPerPage,
  //     search: debouncedSearchTerm,
  //     category: selectedCategory,
  //     state: selectedState,
  //     review: reviewFilter,
  //   },
  //   dashboardType === "review"
  // );
  const listingDashboardQuery = useListingDashboardData(
    {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm,
      category: selectedCategory,
      state: selectedState,
    },
    dashboardType === "listing"
  );
  // const locationDashboardQuery = useLocationDashboardData(
  //   {
  //     page: currentPage,
  //     limit: itemsPerPage,
  //     search: debouncedSearchTerm,
  //     category: selectedCategory,
  //     state: selectedState,
  //   },
  //   dashboardType === "location"
  // );
  // const postDashboardQuery = usePostsDashboardData(
  //   {
  //     page: currentPage,
  //     limit: itemsPerPage,
  //     search: debouncedSearchTerm,
  //     category: selectedCategory,
  //     city: selectedState,
  //     dateRange: {
  //       startDate: dateRange?.from
  //         ? dateRange.from.toISOString().split("T")[0]
  //         : "",
  //       endDate: dateRange?.to ? dateRange.to.toISOString().split("T")[0] : "",
  //     },
  //     postStatus: postStatus === "all" ? "" : postStatus,
  //   },
  //   dashboardType === "post"
  // );

  // Review dashboard polling - only active when on review dashboard
  // const reviewPolling = useReviewDashboardPolling(
  //   {
  //     page: currentPage,
  //     limit: itemsPerPage,
  //     search: debouncedSearchTerm,
  //     category: selectedCategory,
  //     state: selectedState,
  //     review: reviewFilter,
  //   },
  //   reviewDashboardQuery.refetch,
  //   dashboardType === "review"
  // );

  // Use the memoized params everywhere:
  const defaultDashboardQuery = useDashboardData(
    defaultParams,
    dashboardType === "default"
  );
  const insightsDashboardQuery = useInsightsDashboardData(
    insightsParams,
    dashboardType === "insight"
  );
  const reviewDashboardQuery = useReviewDashboardData(
    reviewParams,
    dashboardType === "review"
  );
  const locationDashboardQuery = useLocationDashboardData(
    locationParams,
    dashboardType === "location"
  );
  const postDashboardQuery = usePostsDashboardData(
    postParams,
    dashboardType === "post"
  );

  // Default dashboard polling - only active when on default dashboard
  const defaultPolling = useDashboardPolling({
    dashboardType: "default",
    refetch: defaultDashboardQuery.refetch,
    data: defaultDashboardQuery.data,
    // params: {
    //   page: currentPage,
    //   limit: itemsPerPage,
    //   search: debouncedSearchTerm,
    //   category: selectedCategory,
    //   state: selectedState,
    // },
    params: defaultParams,
    enabled: dashboardType === "default",
  });

  // Insights dashboard polling - only active when on insight dashboard
  const insightsPolling = useDashboardPolling({
    dashboardType: "insight",
    refetch: insightsDashboardQuery.refetch,
    data: insightsDashboardQuery.data,
    // params: {
    //   page: currentPage,
    //   limit: itemsPerPage,
    //   search: debouncedSearchTerm,
    //   category: selectedCategory,
    //   state: selectedState,
    // },
    params: insightsParams,
    enabled: dashboardType === "insight",
  });

  // Location dashboard polling - only active when on location dashboard
  const locationPolling = useDashboardPolling({
    dashboardType: "location",
    refetch: locationDashboardQuery.refetch,
    data: locationDashboardQuery.data,
    // params: {
    //   page: currentPage,
    //   limit: itemsPerPage,
    //   search: debouncedSearchTerm,
    //   category: selectedCategory,
    //   state: selectedState,
    // },
    params: locationParams,
    enabled: dashboardType === "location",
  });

  // Get the current active query
  const getCurrentQuery = () => {
    if (!dashboardType) return null; // Don't query if dashboard type not set yet

    switch (dashboardType) {
      case "insight":
        return insightsDashboardQuery;
      case "review":
        return reviewDashboardQuery;
      case "listing":
        return listingDashboardQuery;
      case "location":
        return locationDashboardQuery;
      case "post":
        return postDashboardQuery;
      default:
        return defaultDashboardQuery;
    }
  };
  const currentQuery = getCurrentQuery();

  // Show loading while profile or dashboard type is not ready
  if (profileLoading || !dashboardType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  const isDashboardLoading = currentQuery.isLoading;
  const isDashboardError = currentQuery.error;
  const dashboardResponse = currentQuery.data;
  const metricsCards = trendsData?.data?.stats
    ? [
        {
          title: t("metrics.totalListings.title"),
          value: trendsData.data.stats.totalListings.toLocaleString(),
          subtitle: t("metrics.totalListings.subtitle"),
          trend: t("metrics.totalListings.trend"),
          icon: Building2,
          bgColor: "bg-blue-100",
          iconBgColor: "bg-blue-500",
          textColor: "text-gray-900",
        },
        {
          title: t("metrics.avgRating.title"),
          value: trendsData.data.stats.avgRating,
          subtitle: t("metrics.avgRating.subtitle"),
          trend: t("metrics.avgRating.trend"),
          icon: Star,
          bgColor: "bg-yellow-100",
          iconBgColor: "bg-green-500",
          textColor: "text-gray-900",
        },
        {
          title: t("metrics.totalReviews.title"),
          value: trendsData.data.stats.totalReviews.toLocaleString(),
          subtitle: t("metrics.totalReviews.subtitle"),
          trend: t("metrics.totalReviews.trend"),
          icon: MessageSquare,
          bgColor: "bg-green-100",
          iconBgColor: "bg-orange-500",
          textColor: "text-gray-900",
        },
        {
          title: t("metrics.totalPosts.title"),
          value: trendsData.data.stats.totalPosts.toLocaleString(),
          subtitle: t("metrics.totalPosts.subtitle"),
          trend: t("metrics.totalPosts.trend"),
          icon: FileText,
          bgColor: "bg-purple-100",
          iconBgColor: "bg-purple-500",
          textColor: "text-gray-900",
        },
      ]
    : [];

  // Transform API data to display format
  const listings =
    dashboardType === "post"
      ? []
      : (dashboardResponse?.data as any)?.listings || [];
  const posts =
    dashboardType === "post"
      ? (dashboardResponse?.data as any)?.posts || []
      : [];
  const pagination = dashboardResponse?.data?.pagination;

  // Helper function to get status color based on rating
  const getStatusColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return "text-green-600";
    if (numRating >= 3.0) return "text-blue-600";
    return "text-red-600";
  };

  // Helper function to get status text based on rating
  const getStatusText = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return t("rating.excellent");
    if (numRating >= 3.0) return t("rating.good");
    return t("rating.poor");
  };
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  };
  const handleFilterChange = (type: "category" | "state", value: string) => {
    if (type === "category") {
      setSelectedCategory(value === "all" ? "" : value);
    } else {
      setSelectedState(value === "all" ? "" : value);
    }
    setCurrentPage(1); // Reset to first page on filter change
  };
  const handleReviewFilterChange = (
    value: "0" | "1" | "2" | "3" | "4" | "5" | "6"
  ) => {
    setReviewFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };
  const handlePostStatusChange = (value: string) => {
    setPostStatus(value);
    setCurrentPage(1);
  };
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setCurrentPage(1);
  };
  const handleDashboardTypeChange = async (newType: string) => {
    try {
      setIsUpdatingDashboard(true);
      const numericId =
        DASHBOARD_TYPE_MAPPING[newType as keyof typeof DASHBOARD_TYPE_MAPPING];
      localStorage.setItem("dashboardType", newType);
      await setDashboard(numericId);
      setDashboardType(newType);
      setCurrentPage(1); // Reset pagination when changing dashboard type
    } catch (error) {
      // console.error("Dashboard save error:", error);
    } finally {
      setIsUpdatingDashboard(false);
    }
  };
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendsLoading ? (
            Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-lg ml-4" />
                </div>
              </div>
            ))
          ) : trendsError ? (
            <div className="col-span-4 text-center py-8">
              <p className="text-gray-500">{t("errors.metricsLoad")}</p>
            </div>
          ) : (
            metricsCards.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-medium text-gray-600">
                        {metric.title}
                      </h3>
                      <div className="text-3xl font-bold text-gray-900">
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
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-lg font-semibold mb-2">
              {t("dashboard.title", {
                type:
                  dashboardType === "review"
                    ? t("dashboard.review")
                    : dashboardType === "insight"
                    ? t("dashboard.insight")
                    : dashboardType === "location"
                    ? t("dashboard.location")
                    : dashboardType === "post"
                    ? t("dashboard.post")
                    : t("dashboard.default"),
              })}
              {/* GMB Listing –{" "}
              {dashboardType === "review"
                ? "Review"
                : dashboardType === "insight"
                ? "Insight"
                : dashboardType === "location"
                ? "Location"
                : dashboardType === "post"
                ? "Post"
                : "Default"}{" "}
              dashboard */}
            </h3>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  key={dashboardType} // Force re-render when dashboard type changes
                  value={dashboardType || "default"}
                  onValueChange={handleDashboardTypeChange}
                  disabled={isUpdatingDashboard}
                >
                  <SelectTrigger className="w-full sm:w-48 bg-background">
                    <SelectValue placeholder="Dashboard Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="default">
                      {t("dashboard.types.default")}
                    </SelectItem>
                    <SelectItem value="insight">
                      {t("dashboard.types.insight")}
                    </SelectItem>
                    <SelectItem value="review">
                      {t("dashboard.types.review")}
                    </SelectItem>
                    <SelectItem value="location">
                      {t("dashboard.types.location")}
                    </SelectItem>
                    <SelectItem value="post">
                      {t("dashboard.types.post")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                {isUpdatingDashboard && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </div>

              <div className="flex gap-4">
                {/* Share Report Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowShareModal(true)}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t("dashboard.shareReport")}
                  </span>
                </Button>

                {/* Export CSV Button - Only show for Review Dashboard */}
                {dashboardType === "review" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setShowExportModal(true)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("export")}</span>
                  </Button>
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
          </div>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  placeholder={t("dashboard.searchPlaceholder")}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                  disabled={categoryStateLoading}
                >
                  <SelectTrigger className="w-full sm:w-40 bg-background">
                    <SelectValue
                      placeholder={
                        categoryStateLoading
                          ? t("status.loading")
                          : t("dashboard.filters.allCategories")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    <SelectItem value="all">
                      {t("dashboard.filters.allCategories")}
                    </SelectItem>
                    {!categoryStateLoading &&
                      !categoryStateError &&
                      categoryAndStateData?.data?.categories?.map(
                        (category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        )
                      )}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedState}
                  onValueChange={(value) => handleFilterChange("state", value)}
                  disabled={categoryStateLoading}
                >
                  <SelectTrigger className="w-full sm:w-40 bg-background">
                    <SelectValue
                      placeholder={
                        categoryStateLoading
                          ? t("status.loading")
                          : t("dashboard.filters.allStates")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background">
                    <SelectItem value="all">
                      {t("dashboard.filters.allStates")}
                    </SelectItem>
                    {!categoryStateLoading &&
                      !categoryStateError &&
                      categoryAndStateData?.data?.states?.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {/* Review Filter Dropdown - Only show for review dashboard */}
                {dashboardType === "review" && (
                  <Select
                    value={reviewFilter}
                    onValueChange={handleReviewFilterChange}
                  >
                    <SelectTrigger className="w-full sm:w-52">
                      <SelectValue
                        placeholder={t("dashboard.filters.reviewFilter")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">
                        {t("dashboard.filters.allReviews")}
                      </SelectItem>
                      <SelectItem value="1">
                        {t("dashboard.filters.unrespondedReview")}
                      </SelectItem>
                      <SelectItem value="2">
                        {t("dashboard.filters.unrespondedARE")}
                      </SelectItem>
                      <SelectItem value="3">
                        {t("dashboard.filters.unrespondedDNR")}
                      </SelectItem>
                      <SelectItem value="4">
                        {t("dashboard.filters.excludeARE")}
                      </SelectItem>
                      <SelectItem value="5">
                        {t("dashboard.filters.excludeDNR")}
                      </SelectItem>
                      <SelectItem value="6">
                        {t("dashboard.filters.excludeARE_DNR")}
                      </SelectItem>
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
                        <SelectValue
                          placeholder={t("dashboard.filters.postStatus")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("dashboard.filters.allPosts")}
                        </SelectItem>
                        <SelectItem value="scheduled">
                          {t("dashboard.filters.scheduledPost")}
                        </SelectItem>
                        <SelectItem value="live">
                          {t("dashboard.filters.livePost")}
                        </SelectItem>
                        <SelectItem value="failed">
                          {t("dashboard.filters.failedPost")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <DateRangePicker
                      date={dateRange}
                      onDateChange={handleDateRangeChange}
                      className="w-full sm:w-auto"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* GMB Listings */}
          <div>
            {/* Display counts */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {
                  isDashboardLoading
                    ? t("status.loading")
                    : isDashboardError
                    ? t("status.error")
                    : dashboardType === "post"
                    ? t("status.showingPosts", {
                        count: posts.length,
                        total: (pagination as any)?.totalPosts || 0,
                      })
                    : // `Showing ${posts.length} of ${
                      //     (pagination as any)?.totalPosts || 0
                      //   } posts`
                      t("status.showingListings", {
                        count: listings.length,
                        total: (pagination as any)?.totalResults || 0,
                      })
                  // `Showing ${listings.length} of ${
                  //     (pagination as any)?.totalResults || 0
                  //   } listings`
                }
              </p>
            </div>

            {isDashboardLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({
                  length: itemsPerPage,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-background border border-border rounded-lg p-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-16 rounded" />
                        <Skeleton className="h-8 w-24 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isDashboardError ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {dashboardType === "post"
                    ? t("errors.postsLoad")
                    : t("errors.listingsLoad")}
                  {/* Failed to load{" "}
                  {dashboardType === "post" ? "posts" : "listings"}. Please try
                  again. */}
                </p>
              </div>
            ) : dashboardType === "post" ? (
              // Post Dashboard Layout
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={transformPostDashboardPost(post)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {posts.map((post) => {
                    const transformedPost = transformPostDashboardPost(post);
                    return (
                      <PostListItem
                        key={post.id}
                        post={transformedPost}
                        onClonePost={(post) => {
                          // Handle clone post logic here
                        }}
                      />
                    );
                  })}
                </div>
              )
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/20 flex flex-col"
                  >
                    {/* Header with Logo and Title */}
                    <div className="flex items-start gap-4 mb-4 relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary/20">
                        {listing.profilePhoto ? (
                          <img
                            src={listing.profilePhoto}
                            alt={listing.locationName || listing.listingName}
                            className="w-full h-full "
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h4 className="font-bold text-foreground text-lg leading-tight mb-1 truncate">
                              {listing.locationName || listing.listingName}
                            </h4>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{listing.locationName || listing.listingName}</p>
                          </TooltipContent>
                        </Tooltip>
                        <p className="text-xs text-muted-foreground">
                          {t("listing.listingid", {
                            id: listing.listingId || listing.id,
                          })}
                          {/* ID: {listing.listingId || listing.id} */}
                        </p>
                        {(dashboardType === "insight" ||
                          dashboardType === "review") &&
                          listing.zipCode && (
                            <p className="text-xs text-muted-foreground">
                              {t("listing.zipcode", {
                                zipcode: listing.zipCode,
                              })}
                              {/* Zip: {listing.zipCode} */}
                            </p>
                          )}
                        {(dashboardType === "insight" ||
                          dashboardType === "review") &&
                          listing.city && (
                            <p className="text-xs text-muted-foreground">
                              {t("listing.state", {
                                city: listing.city,
                              })}
                              {/* State: {listing.city} */}
                            </p>
                          )}
                        {dashboardType === "insight" && listing.category && (
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

                    {listing.isSync === 1 ? (
                      <div className="flex flex-col items-center justify-center h-[200px] bg-gray-100 rounded-lg mb-4  ">
                        {/* <Loader className="w-4 h-4" /> */}
                        <img
                          src="/lovable-uploads/sync-icon.png"
                          alt=""
                          className="animate-spin-slow mb-3"
                        />
                        <h4 className="mb-4"> {t("listing.fetchingData")}</h4>
                        {/* <Loader2 className="w-4 h-4 animate-spin text-primary" /> */}
                      </div>
                    ) : dashboardType === "insight" ? (
                      // Insights Dashboard Content
                      <>
                        {/* Visibility Stats */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-muted-foreground mb-2">
                            {t("listing.visibility")}
                          </h5>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="font-semibold text-blue-600">
                                {listing.visibility?.search_views || 0}
                              </div>
                              <div className="text-gray-500">
                                {" "}
                                {t("listing.Search")}
                              </div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="font-semibold text-green-600">
                                {listing.visibility?.maps_views || 0}
                              </div>
                              <div className="text-gray-500">
                                {" "}
                                {t("listing.Maps")}
                              </div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="font-semibold text-purple-600">
                                {listing.visibility?.total_views || 0}
                              </div>
                              <div className="text-gray-500">
                                {" "}
                                {t("listing.Total")}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Customer Actions */}
                        <div className="mb-5">
                          <h5 className="text-sm font-medium text-muted-foreground mb-2">
                            {t("listing.customerActions")}
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <ExternalLink className="w-3 h-3 text-blue-500" />
                              <span>
                                {listing.customer_actions?.website_clicks || 0}{" "}
                                {t("listing.clicks")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <MapPin className="w-3 h-3 text-green-500" />
                              <span>
                                {listing.customer_actions?.direction_requests ||
                                  0}{" "}
                                {t("listing.directions")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <Phone className="w-3 h-3 text-orange-500" />
                              <span>
                                {listing.customer_actions?.phone_calls || 0}{" "}
                                {t("listing.calls")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <MessageSquare className="w-3 h-3 text-purple-500" />
                              <span>
                                {listing.customer_actions?.messages || 0}{" "}
                                {t("listing.messages")}
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
                            {t("listing.reviewStats")}
                          </h5>
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span
                              className={`font-bold text-sm ${getStatusColor(
                                listing.avgRating || listing.rating
                              )}`}
                            >
                              {listing.avgRating || listing.rating}
                            </span>
                          </div>
                        </div>

                        {/* Review Stats */}
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <div className="grid grid-cols-2 text-sm">
                            <div className="text-center border-r border-gray-300">
                              <span className="text-muted-foreground font-medium">
                                {t("listing.reviewsReplies")}
                              </span>
                              <p className="font-semibold text-foreground">
                                {listing.reviewCount || 0} /{" "}
                                {listing.replyCount || 0}
                              </p>
                            </div>
                            <div className="text-center">
                              <span className="text-muted-foreground font-medium">
                                {t("listing.autoReply")}:
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
                            {t("listing.reviewSentiment")}
                          </h5>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="font-semibold text-green-600">
                                {listing.sentiment?.positive || 0}
                              </div>
                              <div className="text-gray-500">
                                {" "}
                                {t("listing.positive")}
                              </div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="font-semibold text-gray-600">
                                {listing.sentiment?.neutral || 0}
                              </div>
                              <div className="text-gray-500">
                                {" "}
                                {t("listing.neutral")}
                              </div>
                            </div>
                            <div className="text-center p-2 bg-red-50 rounded">
                              <div className="font-semibold text-red-600">
                                {listing.sentiment?.negative || 0}
                              </div>
                              <div className="text-gray-500">
                                {" "}
                                {t("listing.negative")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : dashboardType === "listing" ? (
                      // Listing Dashboard Content
                      <>
                        {/* Status Section */}
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-muted-foreground mb-2">
                            {t("listing.listingStatus")}
                          </h5>
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                listing.status === "Active"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            ></div>
                            <span className="font-bold text-sm text-foreground">
                              {listing.status || "Active"}
                            </span>
                          </div>
                        </div>

                        {/* Listing Info */}
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-muted-foreground font-medium">
                                {t("listing.visibilityLabel")}
                              </span>
                              <p className="font-semibold text-foreground">
                                {listing.visibility || "Public"}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground font-medium">
                                {t("listing.completeLabel")}
                              </span>
                              <p className="font-semibold text-foreground">
                                {listing.completeness || 100}%
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Last Updated */}
                        <div className="mb-5 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">
                              {t("listing.lastUpdated")}
                            </span>
                            <span className="text-foreground font-medium">
                              {listing.lastUpdated || "Recently"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : dashboardType === "location" ? (
                      // Location Dashboard Content
                      <>
                        {/* Location Card Header */}
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
                                  {listing.phone || t("listing.na")}
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
                              {t("listing.photos")}
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 text-center">
                            <div className="text-lg font-bold text-green-700 dark:text-green-300">
                              {listing.rating}
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                              {t("listing.rating")}
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 mb-4">
                          {listing.website && (
                            <button
                              onClick={() => {
                                const tempDiv = document.createElement("div");
                                tempDiv.innerHTML = listing.website;
                                const link = tempDiv.querySelector("a");
                                if (link) window.open(link.href, "_blank");
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {t("listing.website")}
                            </button>
                          )}

                          {listing.map && (
                            <button
                              onClick={() => {
                                const tempDiv = document.createElement("div");
                                tempDiv.innerHTML = listing.map;
                                const link = tempDiv.querySelector("a");
                                if (link) window.open(link.href, "_blank");
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-lg transition-colors text-sm font-medium"
                            >
                              <MapPin className="w-3 h-3" />
                              {t("listing.maps")}
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
                            {t("listing.avgRating")}
                          </h5>
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span
                              className={`font-bold text-sm ${getStatusColor(
                                listing.rating
                              )}`}
                            >
                              {listing.rating} {getStatusText(listing.rating)}
                            </span>
                          </div>
                        </div>

                        {/* Engagement Stats */}
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm">
                            <div className="text-center">
                              <span className="text-muted-foreground font-medium">
                                {t("listing.reviewsReplies")}
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
                              {t("listing.lastPost")}:
                            </span>
                            <span className="text-foreground font-medium">
                              {listing.lastPost?.includes("No post")
                                ? t("listing.nopost")
                                : listing.lastPost}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">
                              {t("listing.upcoming")}:
                            </span>
                            <span className="text-foreground font-medium">
                              {listing.upcomingPost?.includes("No post")
                                ? t("listing.nopost")
                                : listing.upcomingPost}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-end mt-auto">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/location-dashboard/${
                              listing.listingId || listing.id
                            }`
                          )
                        }
                        className="w-full gap-2"
                      >
                        {t("listing.viewDetails")}
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {listings.map((listing) => (
                  <div
                    key={listing.listingId || listing.id}
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
                        <div
                          className="min-w-0 flex-1 hover:text-primary cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/location-dashboard/${
                                listing.listingId || listing.id
                              }`
                            )
                          }
                        >
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground text-sm truncate">
                              {listing.locationName || listing.listingName}
                            </h4>
                            {listing.isSync === 1 && (
                              <Loader2 className="w-3 h-3 animate-spin text-primary" />
                            )}
                          </div>
                          <div className="flex gap-2 items-center text-xs text-muted-foreground">
                            {listing.zipCode && (
                              <span>
                                {t("listing.zipcode", {
                                  zipcode: listing.zipCode,
                                })}
                                {/* Zip: {listing.zipCode} */}
                              </span>
                            )}
                            {listing.zipCode && listing.category && (
                              <span>•</span>
                            )}
                            {listing.category && (
                              <span>{listing.category}</span>
                            )}
                            {listing.city &&
                              (listing.zipCode || listing.category) && (
                                <span>•</span>
                              )}
                            {listing.city && <span>{listing.city}</span>}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {listing.storeCode && (
                              <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium">
                                {listing.storeCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dashboard Type Specific Data */}
                      <div
                        className="flex items-center gap-4 overflow-x-auto text-xs min-w-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                        style={{ scrollbarWidth: "thin" }}
                      >
                        {dashboardType === "insight" ? (
                          <>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-indigo-600">
                                {listing.visibility?.total_views || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.totalViews")}
                              </div>
                            </div>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-blue-600">
                                {listing.visibility?.search_views || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.Search")}
                              </div>
                            </div>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-green-600">
                                {listing.visibility?.maps_views || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {" "}
                                {t("listing.Maps")}
                              </div>
                            </div>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div className="font-semibold text-cyan-600">
                                {listing.customer_actions?.direction_requests ||
                                  0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.directions")}
                              </div>
                            </div>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-orange-600">
                                {listing.customer_actions?.phone_calls || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {" "}
                                {t("listing.calls")}
                              </div>
                            </div>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div className="font-semibold text-pink-600">
                                {listing.customer_actions?.messages || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.messages")}
                              </div>
                            </div>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-purple-600">
                                {listing.customer_actions?.website_clicks || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.clicks")}
                              </div>
                            </div>
                          </>
                        ) : dashboardType === "review" ? (
                          <>
                            <div className="flex items-center gap-2 min-w-16 flex-shrink-0">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span
                                className={`font-semibold ${getStatusColor(
                                  listing.avgRating || listing.rating
                                )}`}
                              >
                                {listing.avgRating || listing.rating}
                              </span>
                            </div>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div className="font-semibold text-foreground">
                                {listing.reviewCount || 0} /{" "}
                                {listing.replyCount || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.reviewsVsReplies")}
                              </div>
                            </div>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-green-600">
                                {listing.sentiment?.positive || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.positive")}
                              </div>
                            </div>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-gray-600">
                                {listing.sentiment?.neutral || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.neutral")}
                              </div>
                            </div>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-red-600">
                                {listing.sentiment?.negative || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.negative")}
                              </div>
                            </div>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div
                                className={`font-semibold ${
                                  listing.autoReplyStatus === "Active"
                                    ? "text-green-600"
                                    : listing.autoReplyStatus === "Inactive"
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {listing.autoReplyStatus || "N/A"}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.autoReply")}
                              </div>
                            </div>
                          </>
                        ) : dashboardType === "location" ? (
                          <>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-blue-600">
                                {listing.photoCount || 0}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.photos")}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 min-w-16 flex-shrink-0">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span
                                className={`font-semibold ${getStatusColor(
                                  listing.rating
                                )}`}
                              >
                                {listing.rating}
                              </span>
                            </div>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div className="font-semibold text-foreground truncate">
                                {listing.phone || t("listing.na")}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.phone")}
                              </div>
                            </div>
                            <div className="text-center min-w-16 flex-shrink-0">
                              <div className="font-semibold text-foreground truncate">
                                {listing.state || t("listing.na")}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.stateLabel")}
                              </div>
                            </div>
                            {listing.map && (
                              <div className="text-center min-w-16 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    const tempDiv =
                                      document.createElement("div");
                                    tempDiv.innerHTML = listing.map;
                                    const link = tempDiv.querySelector("a");
                                    if (link) window.open(link.href, "_blank");
                                  }}
                                  className="flex flex-col items-center gap-1 hover:opacity-80 cursor-pointer"
                                >
                                  <MapPin className="h-4 w-4 text-primary" />
                                  <div className="text-muted-foreground text-xs">
                                    {t("listing.maps")}
                                  </div>
                                </button>
                              </div>
                            )}
                            {listing.website && (
                              <div className="text-center min-w-16 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    const tempDiv =
                                      document.createElement("div");
                                    tempDiv.innerHTML = listing.website;
                                    const link = tempDiv.querySelector("a");
                                    if (link) window.open(link.href, "_blank");
                                  }}
                                  className="flex flex-col items-center gap-1 hover:opacity-80 cursor-pointer"
                                  title={listing.website}
                                >
                                  <ExternalLink className="h-4 w-4 text-primary" />
                                  <div className="text-muted-foreground text-xs">
                                    {t("listing.website")}
                                  </div>
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div className=" flex  items-center gap-2">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span
                                  className={`font-semibold ${getStatusColor(
                                    listing.rating
                                  )}`}
                                >
                                  {listing.rating}
                                </span>
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.starRating")}
                              </div>
                            </div>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div className="font-semibold text-foreground">
                                {listing.reviewReply}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.reviewsVsReplies")}
                              </div>
                            </div>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div className="font-semibold text-foreground truncate">
                                {listing.lastPost?.includes("No post")
                                  ? t("listing.nopost")
                                  : listing.lastPost}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.lastPost")}
                              </div>
                            </div>
                            <div className="text-center min-w-20 flex-shrink-0">
                              <div className="font-semibold text-foreground truncate">
                                {listing.upcomingPost?.includes("No post")
                                  ? t("listing.nopost")
                                  : listing.upcomingPost}
                              </div>
                              <div className="text-muted-foreground">
                                {t("listing.upcoming")}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/location-dashboard/${
                                listing.listingId || listing.id
                              }`
                            )
                          }
                        >
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  {
                    dashboardType === "post"
                      ? t("pagination.showing.posts", {
                          from: (pagination.currentPage - 1) * itemsPerPage + 1,
                          to: Math.min(
                            pagination.currentPage * itemsPerPage,
                            (pagination as any).totalPosts
                          ),
                          total: (pagination as any).totalPosts,
                        })
                      : // `Showing ${
                        //     (pagination.currentPage - 1) * itemsPerPage + 1
                        //   } to ${Math.min(
                        //     pagination.currentPage * itemsPerPage,
                        //     (pagination as any).totalPosts
                        //   )} of ${(pagination as any).totalPosts} posts`
                        t("pagination.showing.listings", {
                          from:
                            (pagination.currentPage - 1) *
                              (pagination as any).resultsPerPage +
                            1,
                          to: Math.min(
                            pagination.currentPage *
                              (pagination as any).resultsPerPage,
                            (pagination as any).totalResults
                          ),
                          total: (pagination as any).totalResults,
                        })
                    // `Showing ${
                    //   (pagination.currentPage - 1) *
                    //     (pagination as any).resultsPerPage +
                    //   1
                    // } to ${Math.min(
                    //   pagination.currentPage *
                    //     (pagination as any).resultsPerPage,
                    //   (pagination as any).totalResults
                    // )} of ${(pagination as any).totalResults} listings`
                  }
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || isDashboardLoading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {t("pagination.previous")}
                    </span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const maxVisiblePages = 5;
                      const totalPages = pagination.totalPages;
                      const current = currentPage;
                      if (totalPages <= maxVisiblePages) {
                        // Show all pages if total is 5 or less
                        return Array.from(
                          {
                            length: totalPages,
                          },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                            disabled={isDashboardLoading}
                          >
                            {page}
                          </Button>
                        ));
                      }
                      let startPage = Math.max(
                        1,
                        current - Math.floor(maxVisiblePages / 2)
                      );
                      let endPage = Math.min(
                        totalPages,
                        startPage + maxVisiblePages - 1
                      );
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
                            disabled={isDashboardLoading}
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
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.totalPages)
                      )
                    }
                    disabled={
                      currentPage === pagination.totalPages ||
                      isDashboardLoading
                    }
                  >
                    <span className="hidden sm:inline">
                      {t("pagination.next")}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Report Modal */}
      <ShareReportModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        dashboardFilterType={parseInt(
          DASHBOARD_TYPE_MAPPING[dashboardType] || "1"
        )}
        onReportGenerated={(reportId) => {
          setShowShareModal(false);
          setGeneratedReportUrl(
            `${window.location.origin}/multi-dashboard-report/${reportId}`
          );
          setShowCopyUrlModal(true);
        }}
      />

      {/* Copy URL Modal */}
      <CopyUrlModal
        open={showCopyUrlModal}
        onOpenChange={setShowCopyUrlModal}
        reportUrl={generatedReportUrl}
      />

      {/* Export Reviews Modal */}
      <ExportReviewsModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
      />
    </TooltipProvider>
  );
};
