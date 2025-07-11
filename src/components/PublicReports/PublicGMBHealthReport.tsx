import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, CheckCircle, AlertCircle, XCircle, TrendingUp, Users, MapPin, Star, MessageSquare, Camera, FileText, Phone, Clock, Info, Building, HelpCircle } from 'lucide-react';
export const PublicGMBHealthReport: React.FC = () => {
  const {
    token
  } = useParams();

  // Sample data - in real implementation, fetch based on token
  const healthData = {
    companyName: 'Demo Business',
    companyLogo: null,
    summaryStats: {
      healthScore: 87,
      reviews: 142,
      avgRating: 4.3,
      photos: 89,
      posts: 24
    },
    healthSections: []
  };
  const getStatusBg = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };
  const getSectionStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  return <PublicReportDashboardLayout title="GMB Health Report" companyName={healthData.companyName} companyLogo={healthData.companyLogo}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* GMB Health Score */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <CircularProgress value={healthData.summaryStats.healthScore} size={80} strokeWidth={8} className="text-primary mb-4">
                  <span className="text-lg font-bold">{healthData.summaryStats.healthScore}%</span>
                </CircularProgress>
                <h3 className="font-semibold text-sm">GMB Health Score</h3>
              </div>
            </CardContent>
          </Card>

          {/* No. Of Reviews */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{healthData.summaryStats.reviews}</div>
                <h3 className="font-semibold text-sm text-muted-foreground">No. Of Reviews</h3>
              </div>
            </CardContent>
          </Card>

          {/* GMB Avg Rating */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">{healthData.summaryStats.avgRating}</div>
                <h3 className="font-semibold text-sm text-muted-foreground">GMB Avg Rating</h3>
              </div>
            </CardContent>
          </Card>

          {/* No. Of GMB Photos */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{healthData.summaryStats.photos}</div>
                <h3 className="font-semibold text-sm text-muted-foreground">No. Of GMB Photos</h3>
              </div>
            </CardContent>
          </Card>

          {/* No. Of GMB Posts */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{healthData.summaryStats.posts}</div>
                <h3 className="font-semibold text-sm text-muted-foreground">No. Of GMB Posts</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Introduction Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground">
              Hello, Thank you for assessing your Google My Business (GMB) profile. Below are the 
              results of our 10-point evaluation.
            </p>
          </CardContent>
        </Card>

        {/* GMB Report at a Glance */}
        <Card className="overflow-hidden bg-gradient-to-br from-gray-50 to-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 text-left">
                Your GMB Report at a Glance
              </h2>
              <p className="text-gray-600 text-lg text-left">Quick overview of your Google My Business profile performance</p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-center">
              {/* Left side - Test Results Cards */}
              <div className="xl:col-span-1 space-y-4">
                {/* Failed Tests Card */}
                <div className="group relative bg-white rounded-xl p-6 border border-red-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-200">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-t-xl"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-red-700 font-semibold text-sm uppercase tracking-wide mb-2">Failed Tests</div>
                      <div className="text-4xl font-bold text-red-600 mb-1">30<span className="text-xl text-red-500">%</span></div>
                      <div className="text-xs text-red-600/70">Areas for improvement</div>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </div>
                
                {/* Passed Tests Card */}
                <div className="group relative bg-white rounded-xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-200">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-t-xl"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-green-700 font-semibold text-sm uppercase tracking-wide mb-2">Passed Tests</div>
                      <div className="text-4xl font-bold text-green-600 mb-1">70<span className="text-xl text-green-500">%</span></div>
                      <div className="text-xs text-green-600/70">Successfully completed</div>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100 transition-colors duration-300">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - Visual Divider */}
              <div className="xl:col-span-1 flex justify-center">
                <div className="hidden xl:block w-px h-32 bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                <div className="xl:hidden w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              </div>

              {/* Right side - Enhanced Donut Chart */}
              <div className="xl:col-span-1 flex flex-col items-center">
                <div className="relative w-56 h-56 mb-6">
                  {/* Outer glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-red-200/30 rounded-full blur-xl"></div>
                  
                  {/* Main chart */}
                  <svg viewBox="0 0 42 42" className="w-full h-full relative z-10 drop-shadow-lg">
                    {/* Background circle with subtle gradient */}
                    <defs>
                      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f9fafb" />
                        <stop offset="100%" stopColor="#f3f4f6" />
                      </linearGradient>
                    </defs>
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="url(#bgGradient)" strokeWidth="4" />
                    {/* Passed tests arc - enhanced */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="70 30" strokeDashoffset="25" strokeLinecap="round" transform="rotate(-90 21 21)" className="drop-shadow-sm" />
                    {/* Failed tests arc - enhanced */}
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="-45" strokeLinecap="round" transform="rotate(-90 21 21)" className="drop-shadow-sm" />
                    
                     {/* Center score */}
                     {/* <text x="21" y="17" textAnchor="middle" className="text-xs font-medium fill-gray-500 uppercase tracking-wide">Overall</text>
                      <text x="21" y="22" textAnchor="middle" className="text-2xl font-bold fill-gray-800">70</text>
                      <text x="21" y="27" textAnchor="middle" className="text-xs font-medium fill-gray-500">out of 100</text> */}
                  </svg>
                </div>
                
                {/* Enhanced Legend */}
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
                    <div className="text-sm">
                      <span className="font-semibold text-green-700">70%</span>
                      <span className="text-gray-600 ml-1">Passed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200"></div>
                    <div className="text-sm">
                      <span className="font-semibold text-red-700">30%</span>
                      <span className="text-gray-600 ml-1">Failed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Summary */}
            
          </CardContent>
        </Card>

        {/* Detailed Breakdown */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Detailed Breakdown</h2>
            
            <div className="space-y-6">
              {/* Item 1 - Missing Description */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                  <Badge className="bg-red-500 text-white hover:bg-red-500">Failed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">1. Missing Description or Description Less Than 300 Characters</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">A detailed description helps customers quickly understand what your business offers and builds trust. Short or missing descriptions can make your profile less appealing.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Write a comprehensive description of at least 300 characters that highlights your unique offerings, key services, and values.</p>
                </div>
              </div>

              {/* Item 2 - Missing Website */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Impact</Badge>
                  <Badge className="bg-green-500 text-white hover:bg-green-500">Passed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">2. Missing Website</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">A website link allows customers to explore your business in greater detail. Without it, potential customers might turn to competitors for more information.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Add a working website link to your GMB profile to boost credibility and drive traffic to your site.</p>
                </div>
              </div>

              {/* Item 3 - Review Count */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Impact</Badge>
                  <Badge className="bg-green-500 text-white hover:bg-green-500">Passed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">3. Review Count</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Reviews are social proof. Listings with fewer than 10 reviews appear less credible, and customers are more likely to choose competitors with more reviews.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Encourage your satisfied customers to leave reviews. You can send them a direct link to your GMB profile for convenience.</p>
                </div>
              </div>

              {/* Item 4 - Rating Below */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Impact</Badge>
                  <Badge className="bg-green-500 text-white hover:bg-green-500">Passed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">4. Rating Below</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Even just a rating of 4 or above is a strong indicator of customer satisfaction.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Continue responding to reviews to show customers that you value their feedback.</p>
                </div>
              </div>

              {/* Item 5 - Additional Categories */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Medium Impact</Badge>
                  <Badge className="bg-red-500 text-white hover:bg-red-500">Failed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">5. Additional Categories Not Present or Less Than 5</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Additional categories help Google understand your services and display your listing for relevant search queries. This can limit your visibility.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Add additional categories that reflect all your services. For example, if you're a plumber, include categories like "Emergency Plumbing" or "Water Heater Installation."</p>
                </div>
              </div>

              {/* Item 6 - Less Than 5 Photos */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Impact</Badge>
                  <Badge className="bg-green-500 text-white hover:bg-green-500">Passed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">6. Less Than 5 Photos</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">High-quality photos enhance your profile's appeal and help customers visualize your offerings.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Regularly update your photos to keep your profile fresh and engaging.</p>
                </div>
              </div>

              {/* Item 7 - Missing Working Hours */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">High Impact</Badge>
                  <Badge className="bg-green-500 text-white hover:bg-green-500">Passed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">7. Missing Working Hours</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Customers need to know when you're open. Missing hours can lead to lost sales and frustrated customers.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Update your business hours, including holiday schedules, to ensure customers always have accurate information.</p>
                </div>
              </div>

              {/* Item 8 - Missing Attributes */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Impact</Badge>
                  <Badge className="bg-red-500 text-white hover:bg-red-500">Failed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">8. Missing or Fewer Than 5 Attributes</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Attributes like "Free Wi-Fi" or "Wheelchair Accessible" help customers decide if your business meets their specific needs.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Review your attributes periodically to add new ones as your services evolve.</p>
                </div>
              </div>

              {/* Item 9 - Logo Present */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Medium Impact</Badge>
                  <Badge className="bg-green-500 text-white hover:bg-green-500">Passed</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-3">9. The logo is present and professional.</h3>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">• Why it Matters:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Your logo helps build brand recognition and makes your profile look professional.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">• Recommendation:</h4>
                  <p className="text-sm text-muted-foreground ml-4">Your logo looks great! Ensure it stays consistent across all platforms.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Competitor Analysis</h2>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
              <div className="flex items-center justify-start mb-3">
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate Impact</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-3">The listing outperforms or matches its competitors in key areas</h3>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">• Why It Matters:</h4>
                <p className="text-sm text-muted-foreground ml-4">Standing out among competitors increase the chance of attraction more customer</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">• Recommendation:</h4>
                <p className="text-sm text-muted-foreground ml-4">analyze competitor profile and focus on areas where they excel such as better rating or more details description</p>
              </div>
            </div>

            {/* Competitor Analysis Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Competitor Analysis</h3>
                <p className="text-gray-600">See how you compare against your local competitors</p>
              </div>
              
              {/* Enhanced Legend */}
              <div className="flex justify-center items-center gap-8 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Average Rating</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                  <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Review Count</span>
                </div>
              </div>

              {/* Enhanced Bar Chart */}
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{
                  name: "Webmarts Software Solution",
                  shortName: "YOU",
                  index: "YOU",
                  displayName: "Webmarts Software Solution",
                  avgRating: 4.1,
                  reviewCount: 10,
                  isYou: true
                }, {
                  name: "Redbytes Software",
                  shortName: "2",
                  index: "2",
                  displayName: "Redbytes Software",
                  avgRating: 4.7,
                  reviewCount: 23,
                  isYou: false
                }, {
                  name: "Websar IT Solutions",
                  shortName: "3",
                  index: "3",
                  displayName: "Websar IT Solutions",
                  avgRating: 5,
                  reviewCount: 61,
                  isYou: false
                }, {
                  name: "Web Square IT Solutions",
                  shortName: "4",
                  index: "4",
                  displayName: "Web Square IT Solutions",
                  avgRating: 4.3,
                  reviewCount: 10,
                  isYou: false
                }, {
                  name: "WebNTT Technologies",
                  shortName: "5",
                  index: "5",
                  displayName: "WebNTT Technologies",
                  avgRating: 5,
                  reviewCount: 7,
                  isYou: false
                }]} margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="index" 
                      height={60} 
                      interval={0} 
                      fontSize={14}
                      tick={{ fill: '#374151', fontWeight: 600 }}
                    />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 5]} tick={{ fill: '#374151', fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fill: '#374151', fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'avgRating' ? `${value} ⭐` : `${value} reviews`, 
                        name === 'avgRating' ? 'Rating' : 'Reviews'
                      ]} 
                      labelFormatter={label => {
                        const business = [
                          { index: "YOU", displayName: "Webmarts Software Solution" },
                          { index: "2", displayName: "Redbytes Software" },
                          { index: "3", displayName: "Websar IT Solutions" },
                          { index: "4", displayName: "Web Square IT Solutions" },
                          { index: "5", displayName: "WebNTT Technologies" }
                        ].find(b => b.index === label);
                        return business ? business.displayName : label;
                      }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="avgRating" 
                      fill="url(#blueGradient)" 
                      name="avgRating" 
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="reviewCount" 
                      fill="url(#orangeGradient)" 
                      name="reviewCount" 
                      radius={[2, 2, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Competitor Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-200">
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Business Name</th>
                    <th className="px-4 py-3 text-center font-semibold">Avg. Rating</th>
                    <th className="px-4 py-3 text-center font-semibold">Review Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-100">
                    <td className="px-4 py-3 font-medium">YOU</td>
                    <td className="px-4 py-3">Webmarts Software Solution</td>
                    <td className="px-4 py-3 text-center">4.1</td>
                    <td className="px-4 py-3 text-center">10</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">2</td>
                    <td className="px-4 py-3">Redbytes Software</td>
                    <td className="px-4 py-3 text-center">4.7</td>
                    <td className="px-4 py-3 text-center">23</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">3</td>
                    <td className="px-4 py-3">Websar IT Solutions</td>
                    <td className="px-4 py-3 text-center">5</td>
                    <td className="px-4 py-3 text-center">61</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">4</td>
                    <td className="px-4 py-3">Web Square IT Solutions</td>
                    <td className="px-4 py-3 text-center">4.3</td>
                    <td className="px-4 py-3 text-center">10</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">5</td>
                    <td className="px-4 py-3">WebNTT Technologies</td>
                    <td className="px-4 py-3 text-center">5</td>
                    <td className="px-4 py-3 text-center">7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Citation Analysis */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Citation Analysis</h2>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
              <div className="flex items-center justify-start mb-3">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-3">The Listing has fewer citation then competitors.</h3>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">• Why It Matters:</h4>
                <p className="text-sm text-muted-foreground ml-4">citation improve local SEO ranking and signal credibility to search engines and customer.</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">• Recommendation:</h4>
                <p className="text-sm text-muted-foreground ml-4">identify citation gaps by auditing competitor profile submit your business to directories like Yelp,Yellow page and other niche-specific site.</p>
              </div>
            </div>

            {/* Citation Analysis Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Citation Analysis</h3>
                <p className="text-gray-600">Compare local citation counts across competitors</p>
              </div>
              
              {/* Enhanced Bar Chart */}
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{
                  name: "Webmarts Software Solution",
                  shortName: "YOU",
                  index: "YOU",
                  displayName: "Webmarts Software Solution",
                  citationCount: 14,
                  isYou: true
                }, {
                  name: "Redbytes Software",
                  shortName: "2",
                  index: "2",
                  displayName: "Redbytes Software",
                  citationCount: 18,
                  isYou: false
                }, {
                  name: "Websar IT Solutions",
                  shortName: "3",
                  index: "3",
                  displayName: "Websar IT Solutions",
                  citationCount: 13,
                  isYou: false
                }, {
                  name: "Web Square IT Solutions",
                  shortName: "4",
                  index: "4",
                  displayName: "Web Square IT Solutions",
                  citationCount: 26,
                  isYou: false
                }, {
                  name: "WebNTT Technologies",
                  shortName: "5",
                  index: "5",
                  displayName: "WebNTT Technologies",
                  citationCount: 20,
                  isYou: false
                }]} margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="index" 
                      height={60} 
                      interval={0} 
                      fontSize={14}
                      tick={{ fill: '#374151', fontWeight: 600 }}
                    />
                    <YAxis domain={[0, 30]} tick={{ fill: '#374151', fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => [`${value} citations`, 'Citation Count']} 
                      labelFormatter={label => {
                        const business = [
                          { index: "YOU", displayName: "Webmarts Software Solution" },
                          { index: "2", displayName: "Redbytes Software" },
                          { index: "3", displayName: "Websar IT Solutions" },
                          { index: "4", displayName: "Web Square IT Solutions" },
                          { index: "5", displayName: "WebNTT Technologies" }
                        ].find(b => b.index === label);
                        return business ? business.displayName : label;
                      }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="citationCount" 
                      fill="url(#citationGradient)" 
                      name="citationCount" 
                      radius={[2, 2, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="citationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Citation Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-200">
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Business Name</th>
                    <th className="px-4 py-3 text-center font-semibold">No. Local Citation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-100">
                    <td className="px-4 py-3 font-medium">YOU</td>
                    <td className="px-4 py-3">Webmarts Software Solution</td>
                    <td className="px-4 py-3 text-center">14</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">2</td>
                    <td className="px-4 py-3">Redbytes Software</td>
                    <td className="px-4 py-3 text-center">18</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">3</td>
                    <td className="px-4 py-3">Websar IT Solutions</td>
                    <td className="px-4 py-3 text-center">13</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">4</td>
                    <td className="px-4 py-3">Web Square IT Solutions</td>
                    <td className="px-4 py-3 text-center">26</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">5</td>
                    <td className="px-4 py-3">WebNTT Technologies</td>
                    <td className="px-4 py-3 text-center">20</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Suggestion Beyond Current Checks */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              Advanced Suggestion Beyond Current Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 w-16">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Suggestion</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 w-48">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">1</td>
                    <td className="px-4 py-3 text-gray-700">Use question and Answer (Q&A)</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">2</td>
                    <td className="px-4 py-3 text-gray-700">Add a virtual Tour</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">3</td>
                    <td className="px-4 py-3 text-gray-700">Highlight Special Features with Posts</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">4</td>
                    <td className="px-4 py-3 text-gray-700">Use Call Tracking</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">5</td>
                    <td className="px-4 py-3 text-gray-700">Optimize for Voice Search</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">6</td>
                    <td className="px-4 py-3 text-gray-700">Add Service Areas</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">7</td>
                    <td className="px-4 py-3 text-gray-700">Use Google Posts to Announce Offers</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">8</td>
                    <td className="px-4 py-3 text-gray-700">Use Emoji in Posts</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">9</td>
                    <td className="px-4 py-3 text-gray-700">Integrate Booking Options</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">10</td>
                    <td className="px-4 py-3 text-gray-700">Share Customer Stories</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">11</td>
                    <td className="px-4 py-3 text-gray-700">Promote Online Store or Delivery Options</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">12</td>
                    <td className="px-4 py-3 text-gray-700">Add Industry Certifications</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Optional Enhancements</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">13</td>
                    <td className="px-4 py-3 text-gray-700">Use Localized Keywords</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">14</td>
                    <td className="px-4 py-3 text-gray-700">Participate in Local Events</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Optional Enhancements</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">15</td>
                    <td className="px-4 py-3 text-gray-700">Use Custom Short Links</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 whitespace-nowrap">Optional</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">16</td>
                    <td className="px-4 py-3 text-gray-700">Track Clicks from GMB</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">17</td>
                    <td className="px-4 py-3 text-gray-700">Add Seasonal Business Hours</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Optional Enhancements</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">18</td>
                    <td className="px-4 py-3 text-gray-700">Create Video Content</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Optional Enhancements</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">19</td>
                    <td className="px-4 py-3 text-gray-700">Use Google Products and Services</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Impact</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">20</td>
                    <td className="px-4 py-3 text-gray-700">Monitor Competitor Activity</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Optional Enhancements</Badge>
                    </td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">21</td>
                    <td className="px-4 py-3 text-gray-700">Encourage Customer Photo Uploads</td>
                    <td className="px-4 py-3 text-right" style={{
                    width: "200px"
                  }}>
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100 ">Optional Enhancements</Badge>
                    </td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">22</td>
                    <td className="px-4 py-3 text-gray-700">Leverage Offers and Coupons</td>
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Optional Enhancements</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary of Recommendations */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">
              Summary of Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-1">•</span>
                  <span>Add a working website link.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-1">•</span>
                  <span>Encourage satisfied customers to leave reviews.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-1">•</span>
                  <span>Average Rating is below 4 star</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-1">•</span>
                  <span>The logo is present and professional.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-1">•</span>
                  <span>Update your business hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-1">•</span>
                  <span>Less Than 5 Photos. Enhance Photo</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Health Sections Breakdown */}
        <div className="space-y-4">
          {healthData.healthSections.map((section, sectionIndex) => <Card key={sectionIndex}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${section.status === 'excellent' ? 'bg-green-500' : section.status === 'good' ? 'bg-blue-500' : section.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    {section.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${getSectionStatusColor(section.status)}`}>
                      {section.percentage}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => <div key={itemIndex} className={`p-3 rounded-lg border ${getStatusBg(item.status)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          {getStatusIcon(item.status)}
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                      </div>
                      <div className="mt-2 ml-6">
                        <p className="text-xs text-muted-foreground">{item.recommendation}</p>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </PublicReportDashboardLayout>;
};