import React, { useState, lazy, Suspense, useEffect } from "react";

// import { EnhancedStatsCards } from "./EnhancedStatsCards";



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
import PostPreviewErrorBoundary from "../Posts/PostPreviewErrorBoundary";
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
import { useI18nNamespace } from "@/hooks/useI18nNamespace"; // ✅ import hook for language

const BusinessProfileHeader = lazy(() => import('./BusinessProfileHeader').then((module) => ({ default: module.BusinessProfileHeader, })))
const DashboardRecentReviews = lazy(() => import('./DashboardRecentReviews').then((module) => ({ default: module.DashboardRecentReviews, })))
const QuickWinsCard = lazy(() => import('./QuickWinsCard').then((module) => ({ default: module.QuickWinsCard, })))
const ReviewSummaryCard = lazy(() => import('./ReviewSummaryCard').then((module) => ({ default: module.ReviewSummaryCard, })))
const SentimentBreakdownCard = lazy(() => import('./SentimentBreakdownCard').then((module) => ({ default: module.SentimentBreakdownCard, })))
const QACard = lazy(() => import('./QACard').then((module) => ({ default: module.QACard, })))
const TrafficSourcesChart = lazy(() => import("./TrafficSourcesChart"));
const VisibilitySummaryCard = lazy(() => import('../Insights/VisibilitySummaryCard').then((module) => ({ default: module.VisibilitySummaryCard, })))
const CustomerInteractionsCard = lazy(() => import('../Insights/CustomerInteractionsCard').then((module) => ({ default: module.CustomerInteractionsCard, })))

const CreatePostCard = lazy(() =>
  import("./CreatePostCard").then((module) => ({
    default: module.CreatePostCard,
  }))
);
const EnhancedStatsCards = lazy(() => import('./EnhancedStatsCards'))
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

const LazyComponentLoader = React.memo(({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    }
  >
    {children}
  </Suspense>
));

export const Dashboard: React.FC = () => {
  const { t, loaded: i18nLoaded } = useI18nNamespace("Dashboard/dashboard"); // ✅ use namespace
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

  // Fetch insights data when insights tab is active and listing is selected
  React.useEffect(() => {
    if (activeTab === "insights" && selectedListing?.id) {
      const params = {
        listingId: parseInt(selectedListing.id, 10),
        dateRange: insightsDateRange,
        startDate: "",
        endDate: "",
      };

      dispatch(fetchInsightsSummary(params));
      dispatch(fetchVisibilityTrends(params));
    }
  }, [activeTab, selectedListing?.id, insightsDateRange, dispatch]);

  // Handle media context - open modal when image is selected from gallery
  useEffect(() => {
    if (shouldOpenCreatePost && selectedMedia) {
      setIsCreateModalOpen(true);
    }
  }, [shouldOpenCreatePost, selectedMedia]);

  const handleApprovePost = (post: any) => {
    setSelectedPost(post);
    setIsPreviewModalOpen(true);
  };

  const handleFinalApprove = () => {
    setIsPreviewModalOpen(false);
    setSelectedPost(null);
  };

  const handleOptimize = () => {
    navigate(`/health/${selectedListing?.id}`);

    // If no valid listing is available, show an error or redirect to a selection page
    // console.warn("No valid listing available to navigate to health page");
    // You might want to show a toast notification here or redirect to a listing selection page
    // For now, we'll just log the warning
  };

  // Show loading state during initial load
  if (isInitialLoading || !i18nLoaded) {
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
        <LazyComponentLoader>
          <div className="xl:col-span-8 space-y-4 sm:space-y-6">
            {/* Business Profile Header */}
            <BusinessProfileHeader overviewData={overviewData} />
            {/* Enhanced Stats Cards */}
            <EnhancedStatsCards />
          </div>
        </LazyComponentLoader>

        {/* Auto Optimization - Responsive positioning */}
        <div className="xl:col-span-4">
          <Card className="h-full from-slate-800 to-slate-900 text-white border-grey-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-black">
                {t("gbpProfileOptimization")}
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
                    ? t("optimizationExcellent")
                    : (overviewData?.healthScore || 0) >= 50
                      ? t("optimizationHealthy")
                      : t("optimizationNeedsImprovement")}
                </p>
                <p className="text-blue-400 font-medium text-sm sm:text-base">
                  {overviewData?.healthScore || 0}% {t("optmized")}
                </p>
              </div>
              {/* Optimize Button */}
              <Button
                className="w-full font-medium text-sm sm:text-base"
                onClick={handleOptimize}
              >
                {t("checkGMBReport")}
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
            <TabsList
              className="inline-flex bg-white border-b border-border w-full p-0 h-auto rounded-none"
              style={{ justifyContent: "start" }}
            >
              <TabsTrigger value="posts">
                <FileText className="w-3 h-3 me-2 sm:w-4 sm:h-4" />
                <span className="text-md">{t("posts")}</span>
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <MessageSquare className="w-3 h-3 me-2 sm:w-4 sm:h-4" />
                <span className="text-md">{t("reviews")}</span>
              </TabsTrigger>
              <TabsTrigger value="geo-ranking">
                <MapPin className="w-3 h-3 me-2 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-md">
                  {" "}
                  {t("geoRanking")}
                </span>
                <span className="sm:hidden text-md"> {t("geo")}</span>
              </TabsTrigger>
              <TabsTrigger value="insights">
                <TrendingUp className="w-3 h-3 me-2 sm:w-4 sm:h-4" />
                <span className="text-md"> {t("insights")}</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "posts" && (
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
                    <LazyComponentLoader>
                      <QuickWinsCard quickwins={overviewData?.quickWins} />
                    </LazyComponentLoader>
                  </div>

                  {/* Bottom Row - Scheduled Posts Table (Full Width) */}
                  <LazyComponentLoader>
                    <ScheduledPostCard onApprovePost={handleApprovePost} />
                  </LazyComponentLoader>
                </div>
              </TabsContent>
            )}
            {activeTab === "reviews" && (
              <TabsContent value="reviews" className="mt-4 sm:mt-6">
                <LazyComponentLoader>
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
                </LazyComponentLoader>
              </TabsContent>
            )}

            {activeTab === "geo-ranking" && (
              <TabsContent value="geo-ranking" className="mt-4 sm:mt-6">
                <LazyComponentLoader>
                  <GeoRankingPage />
                </LazyComponentLoader>
              </TabsContent>
            )}

            {activeTab === "insights" && (
              <TabsContent value="insights" className="mt-4 sm:mt-6">
                <LazyComponentLoader>
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
                    <InsightsComparisonChart />
                  </div>
                </LazyComponentLoader>
              </TabsContent>
            )}

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
              {t("postPreviewTitle")}
            </DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {t("previewText")}: {selectedPost.title}
              </p>
              <PostPreviewErrorBoundary
                fallback={
                  <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm">{t("previewError")}</p>
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
              {t("close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
