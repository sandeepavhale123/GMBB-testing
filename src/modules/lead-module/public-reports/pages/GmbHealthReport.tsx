import React from "react";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const GmbHealthReport: React.FC = () => {
  // Mock data - replace with actual data fetching
  const reportData = {
    title: "GMB Health Report",
    listingName: "Sample Business",
    address: "123 Main St, City, State 12345",
    logo: "",
    date: "January 15, 2025",
    healthScore: 85,
    issues: [
      { type: "error", message: "Missing business hours", count: 1 },
      { type: "warning", message: "Incomplete business description", count: 1 },
      { type: "success", message: "All contact information complete", count: 5 },
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
        {/* Health Score Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              GMB Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent transform -rotate-90"
                  style={{
                    borderRightColor: reportData.healthScore >= 75 ? "#10b981" : "#ef4444",
                    clipPath: `conic-gradient(from 0deg, transparent ${
                      (100 - reportData.healthScore) * 3.6
                    }deg, currentColor 0deg)`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">
                    {reportData.healthScore}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-center text-muted-foreground mt-4">
              Your GMB listing health score
            </p>
          </CardContent>
        </Card>

        {/* Issues Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Health Check Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.issues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {issue.type === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                    {issue.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                    {issue.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    <span className="font-medium">{issue.message}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {issue.count} item{issue.count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Add Business Hours</h4>
                <p className="text-blue-800 text-sm">
                  Complete your business hours to help customers know when you're open.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">Improve Business Description</h4>
                <p className="text-yellow-800 text-sm">
                  Add more details to your business description to better inform potential customers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};