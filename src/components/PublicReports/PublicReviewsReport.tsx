import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, TrendingUp, MessageSquare, Heart, ArrowUp, ArrowDown, Bot } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const PublicReviewsReport: React.FC = () => {
  const { token } = useParams();
  const [reportType, setReportType] = useState<'individual' | 'comparison'>('individual');

  // Sample data
  const reviewData = {
    companyName: 'Demo Business',
    companyLogo: null,
    dateRange: {
      individual: 'Jan 1, 2024 - Jan 31, 2024',
      comparison: {
        period1: 'Jan 1, 2024 - Jan 31, 2024',
        period2: 'Dec 1, 2023 - Dec 31, 2023'
      }
    },
    overview: {
      individual: {
        averageRating: 4.3,
        totalReviews: 247,
        responseRate: 78,
        newReviews: 12
      },
      comparison: {
        period1: {
          averageRating: 4.3,
          totalReviews: 247,
          responseRate: 78,
          newReviews: 12
        },
        period2: {
          averageRating: 4.1,
          totalReviews: 220,
          responseRate: 72,
          newReviews: 8
        }
      }
    },
    sentimentBreakdown: {
      individual: [
        { stars: 5, count: 145, percentage: 59 },
        { stars: 4, count: 62, percentage: 25 },
        { stars: 3, count: 25, percentage: 10 },
        { stars: 2, count: 10, percentage: 4 },
        { stars: 1, count: 5, percentage: 2 }
      ],
      comparison: {
        period1: [
          { stars: 5, count: 145, percentage: 59 },
          { stars: 4, count: 62, percentage: 25 },
          { stars: 3, count: 25, percentage: 10 },
          { stars: 2, count: 10, percentage: 4 },
          { stars: 1, count: 5, percentage: 2 }
        ],
        period2: [
          { stars: 5, count: 130, percentage: 59 },
          { stars: 4, count: 55, percentage: 25 },
          { stars: 3, count: 22, percentage: 10 },
          { stars: 2, count: 9, percentage: 4 },
          { stars: 1, count: 4, percentage: 2 }
        ]
      }
    },
    sentimentAnalysis: {
      individual: {
        positive: 84, // 5-star + 4-star percentages
        neutral: 10, // 3-star percentage
        negative: 6 // 2-star + 1-star percentages
      },
      comparison: {
        period1: {
          positive: 84,
          neutral: 10,
          negative: 6
        },
        period2: {
          positive: 81,
          neutral: 11,
          negative: 8
        }
      }
    },
    reviewChartData: [
      { date: '2024-01-01', totalReviews: 15, star5: 8, star4: 4, star3: 2, star2: 1, star1: 0 },
      { date: '2024-01-02', totalReviews: 12, star5: 7, star4: 3, star3: 1, star2: 1, star1: 0 },
      { date: '2024-01-03', totalReviews: 18, star5: 11, star4: 5, star3: 1, star2: 1, star1: 0 },
      { date: '2024-01-04', totalReviews: 20, star5: 13, star4: 4, star3: 2, star2: 1, star1: 0 },
      { date: '2024-01-05', totalReviews: 16, star5: 9, star4: 4, star3: 2, star2: 1, star1: 0 },
      { date: '2024-01-06', totalReviews: 22, star5: 14, star4: 5, star3: 2, star2: 1, star1: 0 },
      { date: '2024-01-07', totalReviews: 19, star5: 12, star4: 4, star3: 2, star2: 1, star1: 0 }
    ],
    tableData: [
      { date: '2024-01-15', totalReviews: 25, star5: 15, star4: 6, star3: 3, star2: 1, star1: 0 },
      { date: '2024-01-14', totalReviews: 22, star5: 13, star4: 5, star3: 3, star2: 1, star1: 0 },
      { date: '2024-01-13', totalReviews: 28, star5: 18, star4: 6, star3: 3, star2: 1, star1: 0 },
      { date: '2024-01-12', totalReviews: 20, star5: 12, star4: 5, star3: 2, star2: 1, star1: 0 },
      { date: '2024-01-11', totalReviews: 24, star5: 15, star4: 5, star3: 3, star2: 1, star1: 0 }
    ],
    recentReviews: [
      { rating: 5, text: "Excellent service and food quality. Will definitely come back!", author: "Sarah M.", date: "2024-01-15", responded: true },
      { rating: 4, text: "Great atmosphere and friendly staff. Food was good.", author: "John D.", date: "2024-01-14", responded: false },
      { rating: 5, text: "Amazing experience! Best restaurant in the area.", author: "Emily R.", date: "2024-01-13", responded: true }
    ]
  };

  const calculateChange = (current: number, previous: number) => {
    const change = (current - previous) / previous * 100;
    return {
      value: change,
      isPositive: change >= 0
    };
  };

  const renderChangeIndicator = (current: number, previous: number) => {
    const { value, isPositive } = calculateChange(current, previous);
    return (
      <div className={`flex items-center justify-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
        <span>{Math.abs(value).toFixed(1)}% vs previous</span>
      </div>
    );
  };

  const getCurrentOverview = () => {
    return reportType === 'individual' ? reviewData.overview.individual : reviewData.overview.comparison.period1;
  };

  const getPreviousOverview = () => {
    return reportType === 'comparison' ? reviewData.overview.comparison.period2 : null;
  };

  const getCurrentSentiment = () => {
    return reportType === 'individual' ? reviewData.sentimentBreakdown.individual : reviewData.sentimentBreakdown.comparison.period1;
  };

  const getPreviousSentiment = () => {
    return reportType === 'comparison' ? reviewData.sentimentBreakdown.comparison.period2 : null;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <PublicReportDashboardLayout 
      title="Reviews Report" 
      companyName={reviewData.companyName} 
      companyLogo={reviewData.companyLogo}
    >
      <div className="space-y-6">
        {/* Report Type Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="report-type"
            checked={reportType === 'comparison'}
            onCheckedChange={(checked) => setReportType(checked ? 'comparison' : 'individual')}
          />
          <Label htmlFor="report-type">Comparison Report</Label>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-50 rounded-lg mx-auto mb-2">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold">{getCurrentOverview().averageRating}</div>
              {reportType === 'comparison' && getPreviousOverview() && (
                <div className="mt-1">
                  {renderChangeIndicator(getCurrentOverview().averageRating, getPreviousOverview()!.averageRating)}
                </div>
              )}
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mx-auto mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{getCurrentOverview().totalReviews}</div>
              {reportType === 'comparison' && getPreviousOverview() && (
                <div className="mt-1">
                  {renderChangeIndicator(getCurrentOverview().totalReviews, getPreviousOverview()!.totalReviews)}
                </div>
              )}
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mx-auto mb-2">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{getCurrentOverview().responseRate}</div>
              {reportType === 'comparison' && getPreviousOverview() && (
                <div className="mt-1">
                  {renderChangeIndicator(getCurrentOverview().responseRate, getPreviousOverview()!.responseRate)}
                </div>
              )}
              <div className="text-sm text-muted-foreground">Manually Reply</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mx-auto mb-2">
                <Bot className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{getCurrentOverview().newReviews}</div>
              {reportType === 'comparison' && getPreviousOverview() && (
                <div className="mt-1">
                  {renderChangeIndicator(getCurrentOverview().newReviews, getPreviousOverview()!.newReviews)}
                </div>
              )}
              <div className="text-sm text-muted-foreground">AI Reply</div>
            </CardContent>
          </Card>
        </div>

        {/* Rating Distribution and Rating Summary */}
        {reportType === 'comparison' ? (
          <div className="space-y-6">
            {/* Rating Count Summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Period 1 */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Count Summary - Period 1</CardTitle>
                  <p className="text-sm text-muted-foreground">{reviewData.dateRange.comparison.period1}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getCurrentSentiment().map(item => (
                      <div key={item.stars} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: item.stars }, (_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium">{item.stars} Star</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.count}</div>
                          <div className="text-xs text-muted-foreground">reviews</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Period 2 */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Count Summary - Period 2</CardTitle>
                  <p className="text-sm text-muted-foreground">{reviewData.dateRange.comparison.period2}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getPreviousSentiment()?.map(item => (
                      <div key={item.stars} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: item.stars }, (_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium">{item.stars} Star</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.count}</div>
                          <div className="text-xs text-muted-foreground">reviews</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sentiment Analysis - Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Period 1 Sentiment Analysis */}
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">Sentiment Analysis - Period 1</CardTitle>
                </CardHeader>
                
                <CardContent className="bg-white rounded-lg mx-4 mb-4 p-4">
                  <div className="h-48 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={[
                            { name: 'Positive', value: reviewData.sentimentAnalysis.comparison.period1.positive, fill: '#22c55e' },
                            { name: 'Neutral', value: reviewData.sentimentAnalysis.comparison.period1.neutral, fill: '#f59e0b' },
                            { name: 'Negative', value: reviewData.sentimentAnalysis.comparison.period1.negative, fill: '#ef4444' }
                          ]} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={40} 
                          outerRadius={80} 
                          dataKey="value" 
                          startAngle={90} 
                          endAngle={450}
                        >
                          {[
                            { name: 'Positive', value: reviewData.sentimentAnalysis.comparison.period1.positive, fill: '#22c55e' },
                            { name: 'Neutral', value: reviewData.sentimentAnalysis.comparison.period1.neutral, fill: '#f59e0b' },
                            { name: 'Negative', value: reviewData.sentimentAnalysis.comparison.period1.negative, fill: '#ef4444' }
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                        </Pie>
                        <Tooltip 
                          formatter={value => [`${value}%`, '']} 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Positive {reviewData.sentimentAnalysis.comparison.period1.positive}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">Neutral {reviewData.sentimentAnalysis.comparison.period1.neutral}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Negative {reviewData.sentimentAnalysis.comparison.period1.negative}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Period 2 Sentiment Analysis */}
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">Sentiment Analysis - Period 2</CardTitle>
                </CardHeader>
                
                <CardContent className="bg-white rounded-lg mx-4 mb-4 p-4">
                  <div className="h-48 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={[
                            { name: 'Positive', value: reviewData.sentimentAnalysis.comparison.period2.positive, fill: '#22c55e' },
                            { name: 'Neutral', value: reviewData.sentimentAnalysis.comparison.period2.neutral, fill: '#f59e0b' },
                            { name: 'Negative', value: reviewData.sentimentAnalysis.comparison.period2.negative, fill: '#ef4444' }
                          ]} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={40} 
                          outerRadius={80} 
                          dataKey="value" 
                          startAngle={90} 
                          endAngle={450}
                        >
                          {[
                            { name: 'Positive', value: reviewData.sentimentAnalysis.comparison.period2.positive, fill: '#22c55e' },
                            { name: 'Neutral', value: reviewData.sentimentAnalysis.comparison.period2.neutral, fill: '#f59e0b' },
                            { name: 'Negative', value: reviewData.sentimentAnalysis.comparison.period2.negative, fill: '#ef4444' }
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                        </Pie>
                        <Tooltip 
                          formatter={value => [`${value}%`, '']} 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Positive {reviewData.sentimentAnalysis.comparison.period2.positive}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">Neutral {reviewData.sentimentAnalysis.comparison.period2.neutral}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Negative {reviewData.sentimentAnalysis.comparison.period2.negative}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Rating Count Summary - 70% width */}
            <div className="lg:col-span-7">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Rating Count Summary</CardTitle>
                  <p className="text-sm text-muted-foreground">{reviewData.dateRange.individual}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getCurrentSentiment().map(item => (
                      <div key={item.stars} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: item.stars }, (_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium">{item.stars} Star</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.count}</div>
                          <div className="text-xs text-muted-foreground">reviews</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rating Distribution - 30% width */}
            <div className="lg:col-span-3">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">Sentiment Analysis</CardTitle>
                </CardHeader>
                
                {/* Sentiment Analysis Donut Chart */}
                <CardContent className="bg-white rounded-lg mx-4 mb-4 p-4">
                  <div className="h-48 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: 'Positive', value: reviewData.sentimentAnalysis.individual.positive, fill: '#22c55e' },
                          { name: 'Neutral', value: reviewData.sentimentAnalysis.individual.neutral, fill: '#f59e0b' },
                          { name: 'Negative', value: reviewData.sentimentAnalysis.individual.negative, fill: '#ef4444' }
                        ]} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" startAngle={90} endAngle={450}>
                          {[
                            { name: 'Positive', value: reviewData.sentimentAnalysis.individual.positive, fill: '#22c55e' },
                            { name: 'Neutral', value: reviewData.sentimentAnalysis.individual.neutral, fill: '#f59e0b' },
                            { name: 'Negative', value: reviewData.sentimentAnalysis.individual.negative, fill: '#ef4444' }
                          ].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                        </Pie>
                        <Tooltip formatter={value => [`${value}%`, '']} contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex justify-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Positive {reviewData.sentimentAnalysis.individual.positive}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">Neutral {reviewData.sentimentAnalysis.individual.neutral}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">Negative {reviewData.sentimentAnalysis.individual.negative}%</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardContent className="bg-white rounded-lg mx-4 mb-4 p-4">
                  <div className="space-y-3">
                    {getCurrentSentiment().map(item => (
                      <div key={item.stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-8">
                          <span className="text-sm font-medium text-gray-700">{item.stars}</span>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        </div>
                        <div className="flex-1">
                          <Progress value={item.percentage} className="h-2" />
                        </div>
                        <div className="text-sm text-gray-600 w-12 text-right">
                          {item.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Review Line Chart */}
        {reportType === 'comparison' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Period 1 Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Review Trends Over Time - Period 1</CardTitle>
                <p className="text-sm text-muted-foreground">{reviewData.dateRange.comparison.period1}</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reviewData.reviewChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="totalReviews" stroke="#8884d8" strokeWidth={2} name="Total Reviews" />
                      <Line type="monotone" dataKey="star5" stroke="#22c55e" strokeWidth={2} name="5 Star" />
                      <Line type="monotone" dataKey="star4" stroke="#3b82f6" strokeWidth={2} name="4 Star" />
                      <Line type="monotone" dataKey="star3" stroke="#f59e0b" strokeWidth={2} name="3 Star" />
                      <Line type="monotone" dataKey="star2" stroke="#f97316" strokeWidth={2} name="2 Star" />
                      <Line type="monotone" dataKey="star1" stroke="#ef4444" strokeWidth={2} name="1 Star" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Period 2 Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Review Trends Over Time - Period 2</CardTitle>
                <p className="text-sm text-muted-foreground">{reviewData.dateRange.comparison.period2}</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reviewData.reviewChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="totalReviews" stroke="#8884d8" strokeWidth={2} name="Total Reviews" />
                      <Line type="monotone" dataKey="star5" stroke="#22c55e" strokeWidth={2} name="5 Star" />
                      <Line type="monotone" dataKey="star4" stroke="#3b82f6" strokeWidth={2} name="4 Star" />
                      <Line type="monotone" dataKey="star3" stroke="#f59e0b" strokeWidth={2} name="3 Star" />
                      <Line type="monotone" dataKey="star2" stroke="#f97316" strokeWidth={2} name="2 Star" />
                      <Line type="monotone" dataKey="star1" stroke="#ef4444" strokeWidth={2} name="1 Star" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Review Trends Over Time</CardTitle>
              <p className="text-sm text-muted-foreground">{reviewData.dateRange.individual}</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reviewData.reviewChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalReviews" stroke="#8884d8" strokeWidth={2} name="Total Reviews" />
                    <Line type="monotone" dataKey="star5" stroke="#22c55e" strokeWidth={2} name="5 Star" />
                    <Line type="monotone" dataKey="star4" stroke="#3b82f6" strokeWidth={2} name="4 Star" />
                    <Line type="monotone" dataKey="star3" stroke="#f59e0b" strokeWidth={2} name="3 Star" />
                    <Line type="monotone" dataKey="star2" stroke="#f97316" strokeWidth={2} name="2 Star" />
                    <Line type="monotone" dataKey="star1" stroke="#ef4444" strokeWidth={2} name="1 Star" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Review Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Total Review</TableHead>
                  <TableHead>5 Star Rating</TableHead>
                  <TableHead>4 Star Rating</TableHead>
                  <TableHead>3 Star Rating</TableHead>
                  <TableHead>2 Star Rating</TableHead>
                  <TableHead>1 Star Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewData.tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.totalReviews}</TableCell>
                    <TableCell>{row.star5}</TableCell>
                    <TableCell>{row.star4}</TableCell>
                    <TableCell>{row.star3}</TableCell>
                    <TableCell>{row.star2}</TableCell>
                    <TableCell>{row.star1}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviewData.recentReviews.map((review, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                  <Avatar>
                    <AvatarFallback>{review.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{review.author}</span>
                        <div className="flex">{renderStars(review.rating)}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant={review.responded ? "default" : "secondary"}>
                        {review.responded ? "Responded" : "Not Responded"}
                      </Badge>
                    </div>
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