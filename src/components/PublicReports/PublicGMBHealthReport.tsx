import React from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  TrendingUp,
  Users,
  MapPin,
  Star
} from 'lucide-react';

export const PublicGMBHealthReport: React.FC = () => {
  const { token } = useParams();

  // Sample data - in real implementation, fetch based on token
  const healthData = {
    overallScore: 87,
    companyName: 'Demo Business',
    companyLogo: null,
    metrics: [
      { label: 'Profile Completeness', score: 92, status: 'excellent' },
      { label: 'Review Response Rate', score: 78, status: 'good' },
      { label: 'Photo Quality', score: 85, status: 'good' },
      { label: 'Business Hours Accuracy', score: 95, status: 'excellent' },
      { label: 'Contact Information', score: 100, status: 'excellent' },
      { label: 'Category Optimization', score: 70, status: 'needs-improvement' }
    ],
    insights: [
      { type: 'success', title: 'Strong Profile Completion', description: 'Your business profile is 92% complete with all essential information filled.' },
      { type: 'warning', title: 'Improve Review Responses', description: 'Consider responding to more customer reviews to improve engagement.' },
      { type: 'info', title: 'Category Optimization', description: 'Review your business categories to ensure maximum visibility.' }
    ],
    stats: {
      totalViews: '12.5K',
      searchAppearances: '8.9K',
      customerActions: '1.2K',
      averageRating: 4.3
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'needs-improvement': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Heart className="h-5 w-5 text-blue-600" />;
      default: return <Heart className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <PublicReportDashboardLayout
      title="GMB Health Report"
      companyName={healthData.companyName}
      companyLogo={healthData.companyLogo}
    >
      <div className="space-y-6">
        {/* Overall Health Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Overall Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${getScoreBg(healthData.overallScore)}`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(healthData.overallScore)}`}>
                    {healthData.overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Badge 
                variant={healthData.overallScore >= 85 ? 'default' : healthData.overallScore >= 70 ? 'secondary' : 'destructive'}
                className="px-3 py-1"
              >
                {healthData.overallScore >= 85 ? 'Excellent' : healthData.overallScore >= 70 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{healthData.stats.totalViews}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{healthData.stats.searchAppearances}</div>
              <div className="text-sm text-muted-foreground">Search Appearances</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{healthData.stats.customerActions}</div>
              <div className="text-sm text-muted-foreground">Customer Actions</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{healthData.stats.averageRating}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData.metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(metric.status)}
                    <span className="font-medium">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <Progress value={metric.score} className="flex-1" />
                    <span className={`font-semibold w-10 ${getScoreColor(metric.score)}`}>
                      {metric.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthData.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportDashboardLayout>
  );
};