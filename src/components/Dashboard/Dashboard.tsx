
import React, { useState } from 'react';
import { BusinessProfileHeader } from './BusinessProfileHeader';
import { EnhancedStatsCards } from './EnhancedStatsCards';
import { QuickWinsCard } from './QuickWinsCard';
import { HealthScoreCard } from './HealthScoreCard';
import { DailyActivitySummaryChart } from './DailyActivitySummaryChart';
import { ProgressDonutChart } from './ProgressDonutChart';
import { ReviewSummaryCard } from './ReviewSummaryCard';
import { InsightsCard } from './InsightsCard';
import { ActivitySummaryChart } from './ActivitySummaryChart';
import { CreatePostCard } from './CreatePostCard';
import { TrafficSourcesChart } from './TrafficSourcesChart';
import { ScheduledPostCard } from './ScheduledPostCard';
import { ReviewComponent } from './ReviewComponent';
import { GeoRankingPage } from '../GeoRanking/GeoRankingPage';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { CircularProgress } from '../ui/circular-progress';
import { CreatePostModal } from '../Posts/CreatePostModal';
import { PostPreview } from '../Posts/PostPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { BarChart3, FileText, MessageSquare, MapPin, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../../hooks/useRedux';

export const Dashboard: React.FC = () => {
  const {
    qaStats
  } = useAppSelector(state => state.dashboard);
  const [activeTab, setActiveTab] = useState('posts');
  const [suggestionText, setSuggestionText] = useState('AI generated suggestion text');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const scheduledPost = {
    id: '1',
    title: 'Weekend Special Offer',
    content: 'Join us this weekend for 20% off all menu items! Perfect time to try our seasonal specialties.',
    image: null,
    scheduledDate: '2024-06-12 10:00 AM',
    platforms: ['Google My Business', 'Facebook']
  };
  const geoRankingData = [{
    keyword: "coffee shop near me",
    image: "/lovable-uploads/ab14a658-e6b9-4f6f-a35d-37a41ea3b0ba.png"
  }, {
    keyword: "best coffee downtown",
    image: "/lovable-uploads/ab14a658-e6b9-4f6f-a35d-37a41ea3b0ba.png"
  }, {
    keyword: "local coffee shop",
    image: "/lovable-uploads/ab14a658-e6b9-4f6f-a35d-37a41ea3b0ba.png"
  }];
  const handleApprovePost = () => {
    setSelectedPost(scheduledPost);
    setIsPreviewModalOpen(true);
  };
  const handleFinalApprove = () => {
    // Handle final approval logic here
    setIsPreviewModalOpen(false);
    setSelectedPost(null);
  };
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Section - Responsive grid layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Business Overview + Performance Overview - Responsive columns */}
        <div className="xl:col-span-8 space-y-4 sm:space-y-6">
          {/* Business Profile Header */}
          <BusinessProfileHeader />
          
          {/* Enhanced Stats Cards */}
          <EnhancedStatsCards />
        </div>

        {/* Auto Optimization - Responsive positioning */}
        <div className="xl:col-span-4">
          <Card className="h-full from-slate-800 to-slate-900 text-white border-grey-700">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-black">GBP Profile Optimization</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 flex-1 mt-4 sm:mt-[28px] my-0">
              {/* Responsive Circular Progress */}
              <div className="flex items-center justify-center">
                <CircularProgress value={78} size={100} strokeWidth={6} className="text-blue-400 sm:w-[120px] sm:h-[120px]">
                  <div className="text-center">
                    <span className="text-2xl sm:text-3xl font-bold text-black">78</span>
                  </div>
                </CircularProgress>
              </div>
              
              {/* Time left section */}
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm text-black">Optimization level is healthy</p>
                <p className="text-blue-400 font-medium text-sm sm:text-base">75% optimized</p>
              </div>
              
              {/* Optimize Button */}
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm sm:text-base">Optimize Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Main Content - Responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
          {/* Tab Navigation - Responsive */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-50 border-b border-gray-200 rounded-none p-0 h-auto">
              <TabsTrigger value="posts" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 hover:bg-gray-100 font-medium text-gray-600 transition-colors text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Posts</span>
                <span className="sm:hidden">Posts</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 hover:bg-gray-100 font-medium text-gray-600 transition-colors text-xs sm:text-sm">
                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Reviews</span>
                <span className="sm:hidden">Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="geo-ranking" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 hover:bg-gray-100 font-medium text-gray-600 transition-colors text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">GEO Ranking</span>
                <span className="sm:hidden">GEO</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 hover:bg-gray-100 font-medium text-gray-600 transition-colors text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Insights</span>
                <span className="sm:hidden">Insights</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                {/* Top Row - Responsive grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <TrafficSourcesChart />
                  <CreatePostCard onCreatePost={() => setIsCreateModalOpen(true)} />
                </div>
                
                {/* Bottom Row - Scheduled Posts Table (Full Width) */}
                <ScheduledPostCard onApprovePost={handleApprovePost} />
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 sm:mt-6">
              <ReviewComponent />
            </TabsContent>
            <TabsContent value="geo-ranking" className="mt-4 sm:mt-6">
              <div className="bg-white rounded-lg p-4">
                <GeoRankingPage />
              </div>
            </TabsContent>
            <TabsContent value="insights" className="mt-4 sm:mt-6">
              <InsightsCard />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar - Responsive ordering */}
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          {/* Quick Wins - Using the proper QuickWinsCard component */}
          <QuickWinsCard />

          {/* Q&A Section */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold">Questions & Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Answered</span>
                  <span className="font-semibold text-sm sm:text-base">{qaStats.answered}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600 text-sm sm:text-base">{qaStats.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Response Rate</span>
                  <span className="font-semibold text-green-600 text-sm sm:text-base">{qaStats.responseRate}%</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3 sm:mt-4 text-sm sm:text-base">
                View Q&A
              </Button>
            </CardContent>
          </Card>

          {/* GeoRank Snapshot with Carousel - Responsive */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                GeoRank Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full">
                <CarouselContent>
                  {geoRankingData.map((item, index) => <CarouselItem key={index}>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="text-center">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 mb-2">{item.keyword}</p>
                        </div>
                        <div className="aspect-square w-full overflow-hidden rounded-lg">
                          <img src={item.image} alt={`GEO ranking for ${item.keyword}`} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </CarouselItem>)}
                </CarouselContent>
                <CarouselPrevious className="left-1 sm:left-2 w-6 h-6 sm:w-8 sm:h-8" />
                <CarouselNext className="right-1 sm:right-2 w-6 h-6 sm:w-8 sm:h-8" />
              </Carousel>
              <Button variant="link" className="text-xs sm:text-sm p-0 w-full mt-3 sm:mt-4">
                View Full Geo Grid Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Post Modal - Responsive */}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Post Preview Modal - Responsive */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-sm sm:max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Post Preview</DialogTitle>
          </DialogHeader>
          {selectedPost && <PostPreview data={{
          title: selectedPost.title,
          description: selectedPost.content,
          ctaButton: '',
          ctaUrl: '',
          image: selectedPost.image,
          platforms: selectedPost.platforms
        }} />}
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)} className="w-full sm:w-auto text-sm">
              Close
            </Button>
             <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm" onClick={() => setIsCreateModalOpen(true)}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
