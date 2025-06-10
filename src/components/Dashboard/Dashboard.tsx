
import React, { useState } from 'react';
import { BusinessProfileHeader } from './BusinessProfileHeader';
import { EnhancedStatsCards } from './EnhancedStatsCards';
import { QuickWinsCard } from './QuickWinsCard';
import { HealthScoreCard } from './HealthScoreCard';
import { DailyActivitySummaryChart } from './DailyActivitySummaryChart';
import { ProgressDonutChart } from './ProgressDonutChart';
import { ReviewSummaryCard } from './ReviewSummaryCard';
import { QACard } from './QACard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { CircularProgress } from '../ui/circular-progress';
import { CreatePostModal } from '../Posts/CreatePostModal';
import { PostPreview } from '../Posts/PostPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { BarChart3, FileText, MessageSquare, Image as ImageIcon, HelpCircle, TrendingUp, MapPin, AlertTriangle, Plus, Eye, Calendar, PieChart, BarChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [suggestionText, setSuggestionText] = useState('AI generated suggestion text');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Sample data for charts
  const barChartData = [
    { name: 'Success', value: 85, fill: '#10b981' },
    { name: 'Failed', value: 15, fill: '#ef4444' }
  ];

  const donutChartData = [
    { name: 'Maps', value: 60, fill: '#3b82f6' },
    { name: 'Search', value: 40, fill: '#6b7280' }
  ];

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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
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
      </div>
      
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
          <Card className="h-full bg-gradient-to-br from-slate-800 to-slate-900 text-white border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Auto optimization</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 flex-1 mt-[28px] my-[26px]">
              {/* Centered Circular Progress */}
              <div className="flex items-center justify-center">
                <CircularProgress value={78} size={120} strokeWidth={8} className="text-blue-400">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-white">78</span>
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
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 rounded-xl p-1">
              <TabsTrigger value="posts" className="flex items-center gap-2 data-[state=active]:bg-white">
                <FileText className="w-4 h-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2 data-[state=active]:bg-white">
                <MessageSquare className="w-4 h-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-white">
                <ImageIcon className="w-4 h-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="qa" className="flex items-center gap-2 data-[state=active]:bg-white">
                <HelpCircle className="w-4 h-4" />
                Q&A
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Summary with Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BarChart className="w-5 h-5" />
                      Activity Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">% Success vs. Failed</span>
                        <span className="text-2xl font-bold">305</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Post Suggestion with Create Post */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Create Post</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Create engaging posts</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <ReviewSummaryCard />
            </TabsContent>
            <TabsContent value="media" className="mt-6">
              <DailyActivitySummaryChart />
            </TabsContent>
            <TabsContent value="qa" className="mt-6">
              <QACard />
            </TabsContent>
          </Tabs>

          {/* Bottom Row - Doughnut Chart and Scheduled Post */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Source Doughnut Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={40}
                          dataKey="value"
                        >
                          {donutChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Maps (60%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <span>Search (40%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Post */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Scheduled Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">{scheduledPost.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{scheduledPost.content.substring(0, 60)}...</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{scheduledPost.scheduledDate}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleApprovePost}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Approve Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Post Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <PostPreview 
              data={{
                title: selectedPost.title,
                description: selectedPost.content,
                ctaButton: '',
                ctaUrl: '',
                image: selectedPost.image,
                platforms: selectedPost.platforms
              }}
            />
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleFinalApprove}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
