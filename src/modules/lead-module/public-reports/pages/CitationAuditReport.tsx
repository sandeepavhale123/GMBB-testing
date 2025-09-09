import React from "react";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, XCircle, AlertTriangle, TrendingUp } from "lucide-react";

export const CitationAuditReport: React.FC = () => {
  // Mock data - replace with actual data fetching
  const reportData = {
    title: "Citation Audit Report",
    listingName: "Sample Business",
    address: "123 Main St, City, State 12345",
    logo: "",
    date: "January 15, 2025",
    citations: {
      total: 45,
      consistent: 32,
      inconsistent: 8,
      missing: 5,
      accuracy: 71,
    },
    topPlatforms: [
      { name: "Google My Business", status: "consistent", accuracy: 100 },
      { name: "Facebook", status: "consistent", accuracy: 95 },
      { name: "Yelp", status: "inconsistent", accuracy: 80 },
      { name: "Yellow Pages", status: "inconsistent", accuracy: 75 },
      { name: "Bing Places", status: "missing", accuracy: 0 },
    ],
    commonIssues: [
      { issue: "Inconsistent phone number", count: 5 },
      { issue: "Missing business hours", count: 3 },
      { issue: "Outdated address", count: 2 },
      { issue: "Incorrect category", count: 1 },
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "consistent":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "inconsistent":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "missing":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "consistent":
        return "text-green-600 bg-green-50";
      case "inconsistent":
        return "text-yellow-600 bg-yellow-50";
      case "missing":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
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
        {/* Citation Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Citations</p>
                  <p className="text-2xl font-bold">{reportData.citations.total}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Consistent</p>
                  <p className="text-2xl font-bold text-green-600">{reportData.citations.consistent}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inconsistent</p>
                  <p className="text-2xl font-bold text-yellow-600">{reportData.citations.inconsistent}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Missing</p>
                  <p className="text-2xl font-bold text-red-600">{reportData.citations.missing}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Citation Accuracy Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Citation Accuracy Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent transform -rotate-90"
                  style={{
                    borderRightColor: reportData.citations.accuracy >= 75 ? "#3b82f6" : "#ef4444",
                    clipPath: `conic-gradient(from 0deg, transparent ${
                      (100 - reportData.citations.accuracy) * 3.6
                    }deg, currentColor 0deg)`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">
                    {reportData.citations.accuracy}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-4">
              Overall citation accuracy across all platforms
            </p>
          </CardContent>
        </Card>

        {/* Top Platforms */}
        <Card>
          <CardHeader>
            <CardTitle>Citation Status by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topPlatforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(platform.status)}
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(platform.status)}`}>
                      {platform.status}
                    </span>
                    <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                      {platform.accuracy}% accurate
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Common Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Common Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.commonIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium text-red-900">{issue.issue}</span>
                  </div>
                  <span className="text-sm text-red-700 bg-red-100 px-2 py-1 rounded">
                    {issue.count} location{issue.count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Update Phone Number</h4>
                <p className="text-blue-800 text-sm">
                  Ensure your phone number is consistent across all 5 platforms to improve citation accuracy.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Add Missing Citations</h4>
                <p className="text-green-800 text-sm">
                  Claim your business listing on Bing Places and other missing platforms to increase online presence.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">Complete Business Hours</h4>
                <p className="text-yellow-800 text-sm">
                  Add complete business hours information to 3 platforms that are currently missing this data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};