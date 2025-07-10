import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, Globe, MapPin, Phone, Monitor, Smartphone, BarChart3, LineChart } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart as RechartsLineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export const PublicInsightsReport: React.FC = () => {
  const { token } = useParams();
  const [reportType, setReportType] = useState<'individual' | 'comparison'>('individual');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Enhanced sample data
  const insightsData = {
    companyName: 'Demo Business',
    companyLogo: null,
    dateRange: {
      individual: 'Jan 1, 2024 - Jan 31, 2024',
      comparison: {
        period1: 'Jan 1, 2024 - Jan 31, 2024',
        period2: 'Dec 1, 2023 - Dec 31, 2023'
      }
    },
    summaryCards: {
      website: { current: 1245, previous: 1100, change: 13.2 },
      direction: { current: 687, previous: 620, change: 10.8 },
      call: { current: 156, previous: 140, change: 11.4 },
      desktopSearch: { current: 8500, previous: 7800, change: 9.0 },
      desktopMap: { current: 4350, previous: 4100, change: 6.1 },
      mobileSearch: { current: 6200, previous: 5900, change: 5.1 },
      mobileMap: { current: 3800, previous: 3600, change: 5.6 }
    },
    customerSearchData: [
      { name: 'Desktop Search', value: 42, count: 8500, fill: 'hsl(var(--primary))' },
      { name: 'Mobile Search', value: 31, count: 6200, fill: 'hsl(var(--secondary))' },
      { name: 'Desktop Map', value: 17, count: 4350, fill: 'hsl(var(--accent))' },
      { name: 'Mobile Map', value: 10, count: 3800, fill: 'hsl(var(--muted))' }
    ],
    viewsClicksData: [
      { month: 'Jan', search: 14700, map: 8150, website: 1245, direction: 687, call: 156, message: 89 },
      { month: 'Feb', search: 15200, map: 8400, website: 1310, direction: 720, call: 162, message: 95 },
      { month: 'Mar', search: 14900, map: 8200, website: 1280, direction: 705, call: 158, message: 92 },
      { month: 'Apr', search: 15800, map: 8600, website: 1350, direction: 750, call: 165, message: 98 },
      { month: 'May', search: 16200, map: 8900, website: 1420, direction: 780, call: 172, message: 103 },
      { month: 'Jun', search: 15600, map: 8700, website: 1380, direction: 760, call: 168, message: 100 }
    ]
  };

  const chartConfig = {
    search: { label: 'Search', color: 'hsl(var(--primary))' },
    map: { label: 'Map', color: 'hsl(var(--secondary))' },
    website: { label: 'Website', color: 'hsl(var(--accent))' },
    direction: { label: 'Direction', color: 'hsl(var(--destructive))' },
    call: { label: 'Call', color: 'hsl(var(--muted-foreground))' },
    message: { label: 'Message', color: 'hsl(var(--border))' }
  };

  const renderSummaryCard = (title: string, value: number, previousValue: number, change: number, icon: React.ReactNode) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            {reportType === 'comparison' && (
              <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}% vs previous
              </p>
            )}
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PublicReportDashboardLayout
      title="Business Insights Report"
      companyName={insightsData.companyName}
      companyLogo={insightsData.companyLogo}
    >
      <div className="relative space-y-6">
        {/* Report Type Toggle - Absolute positioned */}
        <div className="absolute top-0 right-0 z-10">
          <div className="flex items-center space-x-4 bg-background/95 backdrop-blur border rounded-lg p-3 shadow-sm">
            <Label htmlFor="report-type" className="text-sm font-medium">Report Type:</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="individual" className="text-sm">Individual</Label>
              <Switch
                id="report-type"
                checked={reportType === 'comparison'}
                onCheckedChange={(checked) => setReportType(checked ? 'comparison' : 'individual')}
              />
              <Label htmlFor="comparison" className="text-sm">Comparison</Label>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {renderSummaryCard(
            'Website Visits',
            insightsData.summaryCards.website.current,
            insightsData.summaryCards.website.previous,
            insightsData.summaryCards.website.change,
            <Globe className="h-4 w-4 text-primary" />
          )}
          {renderSummaryCard(
            'Direction Requests',
            insightsData.summaryCards.direction.current,
            insightsData.summaryCards.direction.previous,
            insightsData.summaryCards.direction.change,
            <MapPin className="h-4 w-4 text-primary" />
          )}
          {renderSummaryCard(
            'Phone Calls',
            insightsData.summaryCards.call.current,
            insightsData.summaryCards.call.previous,
            insightsData.summaryCards.call.change,
            <Phone className="h-4 w-4 text-primary" />
          )}
          {renderSummaryCard(
            'Desktop Search',
            insightsData.summaryCards.desktopSearch.current,
            insightsData.summaryCards.desktopSearch.previous,
            insightsData.summaryCards.desktopSearch.change,
            <Monitor className="h-4 w-4 text-primary" />
          )}
          {renderSummaryCard(
            'Desktop Map',
            insightsData.summaryCards.desktopMap.current,
            insightsData.summaryCards.desktopMap.previous,
            insightsData.summaryCards.desktopMap.change,
            <Monitor className="h-4 w-4 text-primary" />
          )}
          {renderSummaryCard(
            'Mobile Search',
            insightsData.summaryCards.mobileSearch.current,
            insightsData.summaryCards.mobileSearch.previous,
            insightsData.summaryCards.mobileSearch.change,
            <Smartphone className="h-4 w-4 text-primary" />
          )}
          {renderSummaryCard(
            'Mobile Map',
            insightsData.summaryCards.mobileMap.current,
            insightsData.summaryCards.mobileMap.previous,
            insightsData.summaryCards.mobileMap.change,
            <Smartphone className="h-4 w-4 text-primary" />
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* How Customers Search Doughnut Chart */}
          <Card>
            <CardHeader>
              <CardTitle>How Customers Search For Your Business</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insightsData.customerSearchData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {insightsData.customerSearchData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: data.fill }}
                                />
                                <span className="font-medium">{data.name}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {data.count.toLocaleString()} ({data.value}%)
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Listing Views & Clicks Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Listing Views & Clicks</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <RechartsLineChart data={insightsData.viewsClicksData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      {Object.keys(chartConfig).map((key) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={chartConfig[key].color}
                          strokeWidth={2}
                          name={chartConfig[key].label}
                        />
                      ))}
                    </RechartsLineChart>
                  ) : (
                    <BarChart data={insightsData.viewsClicksData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      {Object.keys(chartConfig).map((key) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={chartConfig[key].color}
                          name={chartConfig[key].label}
                        />
                      ))}
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicReportDashboardLayout>
  );
};