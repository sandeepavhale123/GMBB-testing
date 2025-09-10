import React, { useState, lazy, Suspense, useEffect } from "react";
import { BusinessProfileHeader } from "./BusinessProfileHeader";
import { EnhancedStatsCards } from "./EnhancedStatsCards";
import { QuickWinsCard } from "./QuickWinsCard";
import { DashboardRecentReviews } from "./DashboardRecentReviews";
import { ReviewSummaryCard } from "./ReviewSummaryCard";
import { SentimentBreakdownCard } from "./SentimentBreakdownCard";
import { QACard } from "./QACard";
import { VisibilitySummaryCard } from "../Insights/VisibilitySummaryCard";
import { CustomerInteractionsCard } from "../Insights/CustomerInteractionsCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { CircularProgress } from "../ui/circular-progress";
import { CreatePostModal } from "../Posts/CreatePostModal";
import { PostPreview } from "../Posts/PostPreview";
import { PostPreviewErrorBoundary } from "../Posts/PostPreviewErrorBoundary";
import { ListingLoader } from "../ui/listing-loader";
import { NoListingSelected } from "../ui/no-listing-selected";
import {
  BarChart3,
  FileText,
  MessageSquare,
  MapPin,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { useListingContext } from "@/context/ListingContext";
import { useMediaContext } from "@/context/MediaContext";
import {
  fetchInsightsSummary,
  fetchVisibilityTrends,
} from "../../store/slices/insightsSlice";
import { useOverviewData } from "../../api/overviewApi";
import { useListingSetup } from "../../api/listingSetupApi";
import { SetupProgressAlert } from "./SetupProgressAlert";
import { useNavigate } from "react-router-dom";
import { FaComments, FaQuestion, FaEdit } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { useProfile } from "@/hooks/useProfile";

// Lazy load heavy components for better performance
const TrafficSourcesChart = lazy(() => import("./TrafficSourcesChart"));
const CreatePostCard = lazy(() =>
  import("./CreatePostCard").then((module) => ({
    default: module.CreatePostCard,
  }))
);
const ScheduledPostCard = lazy(() =>
  import("./ScheduledPostCard").then((module) => ({
    default: module.ScheduledPostCard,
  }))
);
const GeoRankingPage = lazy(() =>
  import("../GeoRanking/GeoRankingPage").then((module) => ({
    default: module.GeoRankingPage,
  }))
);
const InsightsComparisonChart = lazy(() =>
  import("./InsightsComparisonChart").then((module) => ({
    default: module.InsightsComparisonChart,
  }))
);

const LazyComponentLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const Dashboard: React.FC = () => {
  const { selectedListing, isLoading, isInitialLoading } = useListingContext();
  const [activeTab, setActiveTab] = useState("posts");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [insightsDateRange, setInsightsDateRange] = useState("30");
  const navigate = useNavigate();
  const { listings } = useListingContext();
  const { selectedMedia, shouldOpenCreatePost, clearSelection } =
    useMediaContext();

  const {
    data: setupData,
    isLoading: isLoadingSetup,
    isSetupComplete,
  } = useListingSetup(
    selectedListing?.id ? parseInt(selectedListing.id) : null
  );

  const { data: overviewData } = useOverviewData(
    isSetupComplete && selectedListing?.id ? parseInt(selectedListing.id) : null
  );

  const dispatch = useAppDispatch();
  const { summary, visibilityTrends, isLoadingSummary, isLoadingVisibility } =
    useAppSelector((state) => state.insights);

  console.log("listingid", selectedListing?.id);
  console.log("listings", listings);

  // Fetch insights data when insights tab is active and listing is selected
  React.useEffect(() => {
    if (activeTab === "insights" && selectedListing?.id) {
      const params = {
        listingId: parseInt(selectedListing.id, 10),
        dateRange: insightsDateRange,
        startDate: "",
        endDate: "",
      };

      // console.log("Fetching dashboard insights data with params:", params);

      dispatch(fetchInsightsSummary(params));
      dispatch(fetchVisibilityTrends(params));
    }
  }, [activeTab, selectedListing?.id, insightsDateRange, dispatch]);

  // Handle media context - open modal when image is selected from gallery
  useEffect(() => {
    console.log("🎯 Dashboard media context changed:", {
      shouldOpenCreatePost,
      selectedMedia,
    });
    if (shouldOpenCreatePost && selectedMedia) {
      console.log("🎯 Opening create post modal from media context");
      setIsCreateModalOpen(true);
    }
  }, [shouldOpenCreatePost, selectedMedia]);

  const handleApprovePost = (post: any) => {
    console.log("🎯 Dashboard handleApprovePost called with:", post);
    setSelectedPost(post);
    setIsPreviewModalOpen(true);
  };

  const handleFinalApprove = () => {
    setIsPreviewModalOpen(false);
    setSelectedPost(null);
  };

  const handleOptimize = () => {
    // console.log("handleOptimize called - listings:", listings);
    // console.log("selectedListing:", selectedListing);

    navigate(`/health/${selectedListing?.id}`);

    // If no valid listing is available, show an error or redirect to a selection page
    // console.warn("No valid listing available to navigate to health page");
    // You might want to show a toast notification here or redirect to a listing selection page
    // For now, we'll just log the warning
  };

  // Show loading state during initial load
  if (isInitialLoading) {
    return (
      <ListingLoader isLoading={true}>
        <div />
      </ListingLoader>
    );
  }

  // Show no listing state
  if (!selectedListing && !isInitialLoading) {
    return <NoListingSelected pageType="Dashboard" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Setup Progress Alert - Show when setup is not complete */}
      {!isSetupComplete && setupData?.data && (
        <SetupProgressAlert
          setupData={setupData.data}
          isLoading={isLoadingSetup}
        />
      )}
      {/* Top Section - Responsive grid layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Business Overview + Performance Overview - Responsive columns */}
        <div className="xl:col-span-8 space-y-4 sm:space-y-6">
          {/* Business Profile Header */}
          <BusinessProfileHeader overviewData={overviewData} />

          {/* Enhanced Stats Cards */}
          <EnhancedStatsCards />
        </div>

        {/* Auto Optimization - Responsive positioning */}
        <div className="xl:col-span-4">
          <Card className="h-full from-slate-800 to-slate-900 text-white border-grey-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-black">
                GBP Profile Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 flex-1 mt-4 sm:mt-[28px] my-0">
              {/* Responsive Circular Progress */}
              <div className="flex items-center justify-center">
                <CircularProgress
                  value={overviewData?.healthScore || 0}
                  size={100}
                  strokeWidth={6}
                  className="text-blue-400 sm:w-[120px] sm:h-[120px]"
                >
                  <div className="text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-black">
                      {overviewData?.healthScore || 0}
                    </span>
                  </div>
                </CircularProgress>
              </div>

              {/* Time left section */}
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm text-black">
                  {(overviewData?.healthScore || 0) >= 75
                    ? "Optimization level is excellent"
                    : (overviewData?.healthScore || 0) >= 50
                    ? "Optimization level is healthy"
                    : "Optimization needs improvement"}
                </p>
                <p className="text-blue-400 font-medium text-sm sm:text-base">
                  {overviewData?.healthScore || 0}% optimized
                </p>
              </div>

              {/* Optimize Button */}
              <Button
                className="w-full font-medium text-sm sm:text-base"
                onClick={handleOptimize}
              >
                Check GMB health report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content - Responsive layout */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
          {/* Tab Navigation - Responsive */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-50  rounded-none p-0 h-auto">
              <TabsTrigger value="posts">
                <FileText className="w-3 h-3 me-2 sm:w-4 sm:h-4" />
                <span>Posts</span>
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <MessageSquare className="w-3 h-3 me-2 sm:w-4 sm:h-4" />
                <span>Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="geo-ranking">
                <MapPin className="w-3 h-3 me-2 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">GEO Ranking</span>
                <span className="sm:hidden">GEO</span>
              </TabsTrigger>
              <TabsTrigger value="insights">
                <TrendingUp className="w-3 h-3 me-2 sm:w-4 sm:h-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Top Row - Responsive grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <LazyComponentLoader>
                    <TrafficSourcesChart
                      live={overviewData?.livePosts}
                      failed={overviewData?.failedPosts}
                    />
                  </LazyComponentLoader>
                  <LazyComponentLoader>
                    <CreatePostCard
                      onCreatePost={() => setIsCreateModalOpen(true)}
                    />
                  </LazyComponentLoader>
                  <QuickWinsCard quickwins={overviewData?.quickWins} />
                </div>

                {/* Bottom Row - Scheduled Posts Table (Full Width) */}
                <LazyComponentLoader>
                  <ScheduledPostCard onApprovePost={handleApprovePost} />
                </LazyComponentLoader>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Summary Cards Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <ReviewSummaryCard />
                  <SentimentBreakdownCard />
                  <QACard />
                </div>

                {/* Recent Reviews Section - Full Width */}
                <DashboardRecentReviews />
              </div>
            </TabsContent>
            <TabsContent value="geo-ranking" className="mt-4 sm:mt-6">
              <LazyComponentLoader>
                <GeoRankingPage />
              </LazyComponentLoader>
            </TabsContent>
            <TabsContent value="insights" className="mt-4 sm:mt-6">
              <div className="space-y-6">
                {/* First Row: Existing Cards Side by Side */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <VisibilitySummaryCard
                    isLoadingSummary={isLoadingSummary}
                    isLoadingVisibility={isLoadingVisibility}
                    summary={summary}
                    visibilityTrends={visibilityTrends}
                  />
                  <CustomerInteractionsCard
                    isLoadingSummary={isLoadingSummary}
                    summary={summary}
                  />
                </div>

                {/* Second Row: Full-Width Comparison Chart */}
                <LazyComponentLoader>
                  <InsightsComparisonChart />
                </LazyComponentLoader>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Create Post Modal - Responsive */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          clearSelection();
          setIsCreateModalOpen(false);
        }}
      />

      {/* Post Preview Modal - Responsive */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-sm sm:max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Post Preview
            </DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Previewing post: {selectedPost.title}
              </p>
              <PostPreviewErrorBoundary
                fallback={
                  <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm">Unable to display preview</p>
                  </div>
                }
              >
                <PostPreview
                  data={{
                    title: selectedPost.title,
                    description: selectedPost.content,
                    ctaButton: "",
                    ctaUrl: "",
                    image: selectedPost.image,
                    platforms: [],
                    scheduledDate: selectedPost.scheduledDate,
                  }}
                />
              </PostPreviewErrorBoundary>
            </div>
          )}
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setIsPreviewModalOpen(false)}
              className="w-full sm:w-auto text-sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
