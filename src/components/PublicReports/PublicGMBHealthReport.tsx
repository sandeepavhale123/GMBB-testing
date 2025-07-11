import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Heart, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  TrendingUp,
  Users,
  MapPin,
  Star,
  MessageSquare,
  Camera,
  FileText,
  Phone,
  Clock,
  Info,
  Building,
  HelpCircle
} from 'lucide-react';

export const PublicGMBHealthReport: React.FC = () => {
  const { token } = useParams();

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
    healthSections: [
      {
        title: 'Business Information',
        percentage: 85,
        status: 'good',
        items: [
          { label: 'Business Name', status: 'complete', recommendation: 'Business name is properly set' },
          { label: 'Business Description', status: 'complete', recommendation: 'Description is comprehensive and keyword-optimized' },
          { label: 'Business Category', status: 'warning', recommendation: 'Consider adding secondary categories for better visibility' },
          { label: 'Service Area', status: 'complete', recommendation: 'Service area is clearly defined' }
        ]
      },
      {
        title: 'Contact Details',
        percentage: 95,
        status: 'excellent',
        items: [
          { label: 'Phone Number', status: 'complete', recommendation: 'Phone number is verified and active' },
          { label: 'Address', status: 'complete', recommendation: 'Address is accurate and verified' },
          { label: 'Website URL', status: 'complete', recommendation: 'Website is accessible and mobile-friendly' },
          { label: 'Email Address', status: 'warning', recommendation: 'Consider adding a business email for better contact options' }
        ]
      },
      {
        title: 'Business Hours',
        percentage: 90,
        status: 'good',
        items: [
          { label: 'Regular Hours', status: 'complete', recommendation: 'Operating hours are clearly defined' },
          { label: 'Holiday Hours', status: 'warning', recommendation: 'Update holiday hours for upcoming seasons' },
          { label: 'Special Hours', status: 'complete', recommendation: 'Special event hours are properly maintained' }
        ]
      },
      {
        title: 'Categories',
        percentage: 75,
        status: 'warning',
        items: [
          { label: 'Primary Category', status: 'complete', recommendation: 'Primary category accurately represents your business' },
          { label: 'Additional Categories', status: 'warning', recommendation: 'Add relevant secondary categories to improve discoverability' },
          { label: 'Category Accuracy', status: 'complete', recommendation: 'Categories align with actual business services' }
        ]
      },
      {
        title: 'Photos & Media',
        percentage: 80,
        status: 'good',
        items: [
          { label: 'Logo Photo', status: 'complete', recommendation: 'Logo is high-quality and represents brand well' },
          { label: 'Cover Photo', status: 'complete', recommendation: 'Cover photo showcases business effectively' },
          { label: 'Interior Photos', status: 'warning', recommendation: 'Add more interior photos to showcase atmosphere' },
          { label: 'Product Photos', status: 'complete', recommendation: 'Product photos are high-quality and well-lit' },
          { label: 'Team Photos', status: 'error', recommendation: 'Add team photos to build trust and personal connection' }
        ]
      },
      {
        title: 'Reviews & Ratings',
        percentage: 70,
        status: 'warning',
        items: [
          { label: 'Review Volume', status: 'warning', recommendation: 'Encourage more customers to leave reviews' },
          { label: 'Response Rate', status: 'error', recommendation: 'Respond to more customer reviews, especially negative ones' },
          { label: 'Average Rating', status: 'complete', recommendation: 'Maintain excellent service quality' },
          { label: 'Recent Reviews', status: 'warning', recommendation: 'Focus on getting more recent reviews to show active engagement' }
        ]
      },
      {
        title: 'Posts & Updates',
        percentage: 65,
        status: 'warning',
        items: [
          { label: 'Post Frequency', status: 'warning', recommendation: 'Post more regularly (at least 2-3 times per week)' },
          { label: 'Post Quality', status: 'complete', recommendation: 'Posts are engaging and relevant to your audience' },
          { label: 'Post Types', status: 'warning', recommendation: 'Use varied post types: offers, events, products, updates' },
          { label: 'Call-to-Actions', status: 'error', recommendation: 'Include clear call-to-actions in your posts' }
        ]
      },
      {
        title: 'Q&A Section',
        percentage: 60,
        status: 'error',
        items: [
          { label: 'Question Response', status: 'error', recommendation: 'Respond to customer questions within 24 hours' },
          { label: 'FAQ Management', status: 'warning', recommendation: 'Proactively add frequently asked questions' },
          { label: 'Answer Quality', status: 'complete', recommendation: 'Answers are helpful and detailed' }
        ]
      }
    ]
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSectionStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <PublicReportDashboardLayout
      title="GMB Health Report"
      companyName={healthData.companyName}
      companyLogo={healthData.companyLogo}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* GMB Health Score */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <CircularProgress 
                  value={healthData.summaryStats.healthScore} 
                  size={80} 
                  strokeWidth={8}
                  className="text-primary mb-4"
                >
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
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your GMB Report at a Glance</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Test Results */}
              <div className="space-y-4">
                {/* Failed Tests */}
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <div className="text-red-800 font-semibold mb-1">Failed Tests</div>
                  <div className="text-3xl font-bold text-red-700">30 %</div>
                </div>
                
                {/* Passed Tests */}
                <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                  <div className="text-green-800 font-semibold mb-1">Passed Tests</div>
                  <div className="text-3xl font-bold text-green-700">70 %</div>
                </div>
              </div>

              {/* Right side - Donut Chart */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 42 42" className="w-full h-full">
                    {/* Background circle */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#f3f4f6"
                      strokeWidth="3"
                    />
                    {/* Passed tests (green) - 70% */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeDasharray="70 30"
                      strokeDashoffset="25"
                      transform="rotate(-90 21 21)"
                    />
                    {/* Failed tests (red) - 30% */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="3"
                      strokeDasharray="30 70"
                      strokeDashoffset="-45"
                      transform="rotate(-90 21 21)"
                    />
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>30.0%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>70.0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-center mb-6">Competitor Analysis</h3>
              
              <div className="flex justify-center items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Avg. Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm">Review Count</span>
                </div>
              </div>

              {/* Recharts Bar Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Webmarts Software Solution",
                        shortName: "Webmarts Software Solution",
                        avgRating: 4.1,
                        reviewCount: 10,
                        isYou: true
                      },
                      {
                        name: "Redbytes Software", 
                        shortName: "Redbytes Software",
                        avgRating: 4.7,
                        reviewCount: 23,
                        isYou: false
                      },
                      {
                        name: "Websar IT Solutions",
                        shortName: "Websar IT Solutions", 
                        avgRating: 5,
                        reviewCount: 61,
                        isYou: false
                      },
                      {
                        name: "Web Square IT Solutions",
                        shortName: "Web Square IT Solutions",
                        avgRating: 4.3,
                        reviewCount: 10,
                        isYou: false
                      },
                      {
                        name: "WebNTT Technologies",
                        shortName: "WebNTT Technologies",
                        avgRating: 5,
                        reviewCount: 7,
                        isYou: false
                      }
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 80,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="shortName" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 5]} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'avgRating' ? `${value}` : `${value}`,
                        name === 'avgRating' ? 'Avg. Rating' : 'Review Count'
                      ]}
                      labelFormatter={(label) => `Business: ${label}`}
                    />
                    <Bar yAxisId="left" dataKey="avgRating" fill="#3b82f6" name="avgRating" />
                    <Bar yAxisId="right" dataKey="reviewCount" fill="#f97316" name="reviewCount" />
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
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-center mb-6">Citation Analysis</h3>
              
              {/* Recharts Bar Chart */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Webmarts Software Solution",
                        shortName: "Webmarts Software Solution",
                        citationCount: 14,
                        isYou: true
                      },
                      {
                        name: "Redbytes Software", 
                        shortName: "Redbytes Software",
                        citationCount: 18,
                        isYou: false
                      },
                      {
                        name: "Websar IT Solutions",
                        shortName: "Websar IT Solutions", 
                        citationCount: 13,
                        isYou: false
                      },
                      {
                        name: "Web Square IT Solutions",
                        shortName: "Web Square IT Solutions",
                        citationCount: 26,
                        isYou: false
                      },
                      {
                        name: "WebNTT Technologies",
                        shortName: "WebNTT Technologies",
                        citationCount: 20,
                        isYou: false
                      }
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 80,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="shortName" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis domain={[0, 30]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}`,
                        'Citation Count'
                      ]}
                      labelFormatter={(label) => `Business: ${label}`}
                    />
                    <Bar dataKey="citationCount" fill="#3b82f6" name="citationCount" />
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
                    <td className="px-4 py-3 text-right">
                      <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Optional Enhancements</Badge>
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

        {/* Health Sections Breakdown */}
        <div className="space-y-4">
          {healthData.healthSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      section.status === 'excellent' ? 'bg-green-500' :
                      section.status === 'good' ? 'bg-blue-500' :
                      section.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
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
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className={`p-3 rounded-lg border ${getStatusBg(item.status)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          {getStatusIcon(item.status)}
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                      </div>
                      <div className="mt-2 ml-6">
                        <p className="text-xs text-muted-foreground">{item.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicReportDashboardLayout>
  );
};