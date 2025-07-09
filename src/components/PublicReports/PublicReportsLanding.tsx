import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Heart, 
  MapPin, 
  Star, 
  TrendingUp, 
  Image,
  ExternalLink,
  Clock,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const reportTypes = [
  {
    id: 'gmb-health',
    title: 'GMB Health Report',
    description: 'Comprehensive Google My Business health analysis including optimization score, listing completeness, and improvement recommendations.',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    features: ['Health Score', 'Optimization Tips', 'Performance Metrics', 'Compliance Check'],
    sampleUrl: '/public-reports/gmb-health/demo-token'
  },
  {
    id: 'geo-ranking',
    title: 'GEO Ranking Report',
    description: 'Location-based search ranking analysis with competitor insights and keyword performance across different geographic areas.',
    icon: MapPin,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    features: ['Ranking Maps', 'Competitor Analysis', 'Local SEO', 'Geographic Performance'],
    sampleUrl: '/public-reports/geo-ranking/demo-token'
  },
  {
    id: 'reviews',
    title: 'Reviews Report',
    description: 'Customer review analysis with sentiment tracking, response rates, and reputation management insights.',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    features: ['Sentiment Analysis', 'Rating Trends', 'Response Rates', 'Review Insights'],
    sampleUrl: '/public-reports/reviews/demo-token'
  },
  {
    id: 'insights',
    title: 'Business Insights Report',
    description: 'Comprehensive analytics dashboard with customer interactions, search queries, and visibility trends.',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    features: ['Analytics Dashboard', 'Customer Data', 'Search Trends', 'Performance KPIs'],
    sampleUrl: '/public-reports/insights/demo-token'
  },
  {
    id: 'media',
    title: 'Media Performance Report',
    description: 'Visual content performance analysis including engagement metrics, popular content, and ROI tracking.',
    icon: Image,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    features: ['Media Analytics', 'Engagement Metrics', 'Popular Content', 'ROI Analysis'],
    sampleUrl: '/public-reports/media/demo-token'
  }
];

export const PublicReportsLanding: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredReports = reportTypes.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewSample = (sampleUrl: string) => {
    navigate(sampleUrl);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Public Business Reports</h1>
            <p className="text-muted-foreground text-lg">
              Access comprehensive business intelligence reports with detailed analytics and insights
            </p>
          </div>
        </div>
      </header>

      {/* Search and Stats */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search report types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">5 Report Types</h3>
              <p className="text-sm text-muted-foreground">Comprehensive business analytics</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-3">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-1">Public Access</h3>
              <p className="text-sm text-muted-foreground">No login required</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg mx-auto mb-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-semibold mb-1">Real-time Data</h3>
              <p className="text-sm text-muted-foreground">Always up-to-date insights</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Report Types */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const IconComponent = report.icon;
            return (
              <Card key={report.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${report.bgColor} mb-4`}>
                      <IconComponent className={`h-6 w-6 ${report.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Public
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {report.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {report.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    onClick={() => handleViewSample(report.sampleUrl)}
                    className="w-full group-hover:shadow-md transition-all duration-200"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Sample Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reports found matching your search.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Powered by Business Intelligence Platform • Generate your own reports
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};