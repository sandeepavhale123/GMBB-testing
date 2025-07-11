import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
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