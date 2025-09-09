import React from "react";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";

export const GmbProspectReport: React.FC = () => {
  // Mock data - replace with actual data fetching
  const reportData = {
    title: "GMB Prospect Report",
    listingName: "Sample Business",
    address: "123 Main St, City, State 12345",
    logo: "",
    date: "January 15, 2025",
    prospects: {
      totalViews: 1250,
      totalClicks: 85,
      callsReceived: 32,
      directionsRequested: 156,
    },
    monthlyTrend: [
      { month: "Sep", views: 980, clicks: 65 },
      { month: "Oct", views: 1100, clicks: 72 },
      { month: "Nov", views: 1180, clicks: 78 },
      { month: "Dec", views: 1250, clicks: 85 },
    ],
  };

  const brandingData = {
    company_name: "Digital Marketing Solutions",
    company_logo: "",
    company_website: "www.digitalmarketing.com", 
    company_email: "contact@digitalmarketing.com",
    company_phone: "(555) 123-4567",
    company_address: "456 Business Ave, Marketing City, MC 67890",
  };

  return (
    <PublicReportLayout
      title={reportData.title}
      listingName={reportData.listingName}
      address={reportData.address}
      logo={reportData.logo}
      date={reportData.date}
      brandingData={brandingData}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{reportData.prospects.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Clicks</p>
                  <p className="text-2xl font-bold">{reportData.prospects.totalClicks}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Calls Received</p>
                  <p className="text-2xl font-bold">{reportData.prospects.callsReceived}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Directions</p>
                  <p className="text-2xl font-bold">{reportData.prospects.directionsRequested}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.monthlyTrend.map((month, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="font-medium">{month.month}</div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Views</div>
                      <div className="font-semibold">{month.views.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Clicks</div>
                      <div className="font-semibold">{month.clicks}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {((reportData.prospects.totalClicks / reportData.prospects.totalViews) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-800">View to Click Rate</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {((reportData.prospects.callsReceived / reportData.prospects.totalViews) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-green-800">View to Call Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {((reportData.prospects.directionsRequested / reportData.prospects.totalViews) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-purple-800">View to Direction Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};