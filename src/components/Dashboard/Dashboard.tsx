import React, { useState } from 'react';
import { BusinessProfileHeader } from './BusinessProfileHeader';
import { EnhancedStatsCards } from './EnhancedStatsCards';
import { QuickWinsCard } from './QuickWinsCard';
import { HealthScoreCard } from './HealthScoreCard';
import { DailyActivitySummaryChart } from './DailyActivitySummaryChart';
import { ProgressDonutChart } from './ProgressDonutChart';
import { ReviewSummaryCard } from './ReviewSummaryCard';
import { QACard } from './QACard';
import { ActivitySummaryChart } from './ActivitySummaryChart';
import { CreatePostCard } from './CreatePostCard';
import { TrafficSourcesChart } from './TrafficSourcesChart';
import { ScheduledPostCard } from './ScheduledPostCard';
import { ReviewComponent } from './ReviewComponent';
import { MediaPage } from '../Media/MediaPage';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { CircularProgress } from '../ui/circular-progress';
import { CreatePostModal } from '../Posts/CreatePostModal';
import { PostPreview } from '../Posts/PostPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { BarChart3, FileText, MessageSquare, Image as ImageIcon, HelpCircle, TrendingUp, MapPin, AlertTriangle } from 'lucide-react';
export const Dashboard: React.FC = () => {
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
  const handleApprovePost = () => {
    setSelectedPost(scheduledPost);
    setIsPreviewModalOpen(true);
  };
  const handleFinalApprove = () => {
    // Handle final approval logic here
    setIsPreviewModalOpen(false);
    setSelectedPost(null);
  };
  return <div className="space-y-6">
      {/* Action Required Alert */}
      {/* <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Action Required</h3>
            <p className="text-sm text-red-700">This listing is suspended. Take action to appeal and restore visibility.</p>
          </div>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Resolve
        </Button>
       </div> */}
      
      {/* Top Section - Business Overview, Performance Overview, and Auto Optimization in single row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Business Overview + Performance Overview - 8 columns */}
        <div className="col-span-8 space-y-6">
          {/* Business Profile Header */}
          <BusinessProfileHeader />
          
          {/* Enhanced Stats Cards */}
          <EnhancedStatsCards />
        </div>

        {/* Auto Optimization - 4 columns */}
        <div className="col-span-4">
          <Card className="h-full  from-slate-800 to-slate-900 text-white border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-dark">GBP Profile Optimization</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 flex-1 mt-[28px] my-0">
              {/* Centered Circular Progress */}
              <div className="flex items-center justify-center">
                <CircularProgress value={78} size={120} strokeWidth={8} className="text-blue-400">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-dark">78</span>
                  </div>
                </CircularProgress>
              </div>
              
              {/* Time left section */}
              <div className="text-center space-y-1">
                <p className="text-sm text-slate-400">Optimization level is healthy</p>
                <p className="text-blue-400 font-medium">75% optimized</p>
              </div>
              
              {/* Optimize Button */}
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium">Optimize Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 border-b border-gray-200 rounded-none p-0 h-auto">
              <TabsTrigger value="posts" className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 hover:bg-gray-100 font-medium text-gray-600 transition-colors">
                <FileText className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 hover:bg-gray-100 font-medium text-gray-600 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 hover:bg-gray-100 font-medium text-gray-600 transition-colors">
                <ImageIcon className="w-4 h-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="qa" className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600 hover:bg-gray-100 font-medium text-gray-600 transition-colors">
                <HelpCircle className="w-4 h-4" />
                Q&A
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              <div className="space-y-6">
                {/* Top Row - Traffic Source Chart and Create Post */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrafficSourcesChart />
                  <CreatePostCard onCreatePost={() => setIsCreateModalOpen(true)} />
                </div>
                
                {/* Bottom Row - Scheduled Posts Table (Full Width) */}
                <ScheduledPostCard onApprovePost={handleApprovePost} />
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <ReviewComponent />
            </TabsContent>
            <TabsContent value="media" className="mt-6">
              <MediaPage />
            </TabsContent>
            <TabsContent value="qa" className="mt-6">
              <QACard />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Wins */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Wins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Fix outstanding issues', 'Add photo to post', 'Update business info'].map((item, index) => <div key={index} className="flex items-center gap-3">
                    <Checkbox id={`sidebar-quick-win-${index}`} />
                    <label htmlFor={`sidebar-quick-win-${index}`} className="text-sm text-gray-700">
                      {item}
                    </label>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          {/* AI Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">AI Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">You can improve your listing</p>
              <Button variant="outline" className="w-full">
                View Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* GeoRank Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                GeoRank Snapshot
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Array.from({
                length: 16
              }, (_, i) => <div key={i} className={`w-6 h-6 rounded-full ${i < 4 ? 'bg-gray-300' : i < 8 ? 'bg-gray-400' : i < 12 ? 'bg-gray-600' : 'bg-gray-800'}`}></div>)}
              </div>
              <Button variant="link" className="text-sm p-0">
                View Full Geo Grid Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Post Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
          </DialogHeader>
          {selectedPost && <PostPreview data={{
          title: selectedPost.title,
          description: selectedPost.content,
          ctaButton: '',
          ctaUrl: '',
          image: selectedPost.image,
          platforms: selectedPost.platforms
        }} />}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
             <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsCreateModalOpen(true)}>
              Edit
            </Button>
            {/* <Button className="bg-green-600 hover:bg-green-700" onClick={handleFinalApprove}>
              Approve
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Dashboard;