import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, Globe, MapPin, Phone, Monitor, Smartphone, MessageSquare } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export const PublicInsightsReport: React.FC = () => {
  const { token } = useParams();
  const [reportType, setReportType] = useState<'individual' | 'comparison'>('individual');

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
      message: { current: 89, previous: 78, change: 14.1 },
      desktopSearch: { current: 8500, previous: 7800, change: 9.0 },
      desktopMap: { current: 4350, previous: 4100, change: 6.1 },
      mobileSearch: { current: 6200, previous: 5900, change: 5.1 },
      mobileMap: { current: 3800, previous: 3600, change: 5.6 }
    },
    customerSearchData: [
      { name: 'Desktop Search', value: 42, count: 8500, fill: 'hsl(220 100% 60%)' },
      { name: 'Mobile Search', value: 31, count: 6200, fill: 'hsl(142 76% 60%)' },
      { name: 'Desktop Map', value: 17, count: 4350, fill: 'hsl(47 96% 60%)' },
      { name: 'Mobile Map', value: 10, count: 3800, fill: 'hsl(280 100% 60%)' }
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
    search: { label: 'Search', color: 'hsl(210 100% 55%)' },
    map: { label: 'Map', color: 'hsl(160 85% 50%)' },
    website: { label: 'Website', color: 'hsl(25 95% 55%)' },
    direction: { label: 'Direction', color: 'hsl(340 100% 55%)' },
    call: { label: 'Call', color: 'hsl(260 85% 55%)' },
    message: { label: 'Message', color: 'hsl(195 90% 50%)' }
  };

  const renderSummaryCard = (title: string, value: number, previousValue: number, change: number, icon: React.ReactNode, bgColor: string, iconColor: string) => (
    <Card>
      <CardContent className="p-4 text-center">
        <div className={`flex items-center justify-center w-10 h-10 ${bgColor} rounded-lg mx-auto mb-2`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {reportType === 'comparison' && (
          <div className="mt-1">
            <div className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}% vs previous
            </div>
          </div>
        )}
        <div className="text-sm text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  );

  return (
    <PublicReportDashboardLayout
      title="Business Insights Report"
      companyName={insightsData.companyName}
      companyLogo={insightsData.companyLogo}
    >
      <div className="space-y-6">

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {renderSummaryCard(
            'Website Visits',
            insightsData.summaryCards.website.current,
            insightsData.summaryCards.website.previous,
            insightsData.summaryCards.website.change,
            <Globe className="h-5 w-5" />,
            'bg-blue-50',
            'text-blue-600'
          )}
          {renderSummaryCard(
            'Direction Requests',
            insightsData.summaryCards.direction.current,
            insightsData.summaryCards.direction.previous,
            insightsData.summaryCards.direction.change,
            <MapPin className="h-5 w-5" />,
            'bg-green-50',
            'text-green-600'
          )}
          {renderSummaryCard(
            'Phone Calls',
            insightsData.summaryCards.call.current,
            insightsData.summaryCards.call.previous,
            insightsData.summaryCards.call.change,
            <Phone className="h-5 w-5" />,
            'bg-purple-50',
            'text-purple-600'
          )}
          {renderSummaryCard(
            'Messages',
            insightsData.summaryCards.message.current,
            insightsData.summaryCards.message.previous,
            insightsData.summaryCards.message.change,
            <MessageSquare className="h-5 w-5" />,
            'bg-orange-50',
            'text-orange-600'
          )}
          {renderSummaryCard(
            'Desktop Search',
            insightsData.summaryCards.desktopSearch.current,
            insightsData.summaryCards.desktopSearch.previous,
            insightsData.summaryCards.desktopSearch.change,
            <Monitor className="h-5 w-5" />,
            'bg-indigo-50',
            'text-indigo-600'
          )}
          {renderSummaryCard(
            'Desktop Map',
            insightsData.summaryCards.desktopMap.current,
            insightsData.summaryCards.desktopMap.previous,
            insightsData.summaryCards.desktopMap.change,
            <Monitor className="h-5 w-5" />,
            'bg-teal-50',
            'text-teal-600'
          )}
          {renderSummaryCard(
            'Mobile Search',
            insightsData.summaryCards.mobileSearch.current,
            insightsData.summaryCards.mobileSearch.previous,
            insightsData.summaryCards.mobileSearch.change,
            <Smartphone className="h-5 w-5" />,
            'bg-pink-50',
            'text-pink-600'
          )}
          {renderSummaryCard(
            'Mobile Map',
            insightsData.summaryCards.mobileMap.current,
            insightsData.summaryCards.mobileMap.previous,
            insightsData.summaryCards.mobileMap.change,
            <Smartphone className="h-5 w-5" />,
            'bg-yellow-50',
            'text-yellow-600'
          )}
        </div>

        {/* Charts Section */}
        <div className={`grid gap-6 ${reportType === 'comparison' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* How Customers Search Doughnut Chart */}
          {reportType === 'comparison' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Period 1 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">How Customers Search For Your Business</CardTitle>
                  <p className="text-sm text-muted-foreground text-center">Period 1: {insightsData.dateRange.comparison.period1}</p>
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

              {/* Period 2 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">How Customers Search For Your Business</CardTitle>
                  <p className="text-sm text-muted-foreground text-center">Period 2: {insightsData.dateRange.comparison.period2}</p>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Desktop Search', value: 38, count: 7800, fill: 'hsl(220 100% 60%)' },
                            { name: 'Mobile Search', value: 35, count: 5900, fill: 'hsl(142 76% 60%)' },
                            { name: 'Desktop Map', value: 19, count: 4100, fill: 'hsl(47 96% 60%)' },
                            { name: 'Mobile Map', value: 8, count: 3600, fill: 'hsl(280 100% 60%)' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[
                            { name: 'Desktop Search', value: 38, count: 7800, fill: 'hsl(220 100% 60%)' },
                            { name: 'Mobile Search', value: 35, count: 5900, fill: 'hsl(142 76% 60%)' },
                            { name: 'Desktop Map', value: 19, count: 4100, fill: 'hsl(47 96% 60%)' },
                            { name: 'Mobile Map', value: 8, count: 3600, fill: 'hsl(280 100% 60%)' }
                          ].map((entry, index) => (
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
            </div>
          ) : (
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
          )}

          {/* Listing Views & Clicks Chart */}
          {reportType === 'comparison' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Period 1 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Listing Views & Clicks</CardTitle>
                  <p className="text-sm text-muted-foreground text-center">Period 1: {insightsData.dateRange.comparison.period1}</p>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
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
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Period 2 Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Listing Views & Clicks</CardTitle>
                  <p className="text-sm text-muted-foreground text-center">Period 2: {insightsData.dateRange.comparison.period2}</p>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { month: 'Jan', search: 13500, map: 7800, website: 1100, direction: 620, call: 140, message: 78 },
                        { month: 'Feb', search: 14000, map: 8100, website: 1180, direction: 650, call: 145, message: 82 },
                        { month: 'Mar', search: 13800, map: 7900, website: 1150, direction: 635, call: 142, message: 80 },
                        { month: 'Apr', search: 14500, map: 8300, website: 1220, direction: 680, call: 148, message: 85 },
                        { month: 'May', search: 14900, map: 8500, website: 1280, direction: 710, call: 152, message: 88 },
                        { month: 'Jun', search: 14300, map: 8200, website: 1240, direction: 690, call: 150, message: 86 }
                      ]}>
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
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Listing Views & Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
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
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Report Type Toggle - Bottom positioned */}
        <div className="flex justify-center pt-6">
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
      </div>
    </PublicReportDashboardLayout>
  );
};