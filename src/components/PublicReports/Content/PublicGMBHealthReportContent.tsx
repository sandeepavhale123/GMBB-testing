import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/ui/circular-progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import {
  Heart,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  MessageSquare,
  Camera,
  FileText,
  Loader2,
} from "lucide-react";
import { usePerformanceHealthReport } from "@/hooks/useReports";

export const PublicGMBHealthReportContent: React.FC = () => {
  const { token } = useParams();
  const location = useLocation();
  const params = useParams();
  const isPublicLayout = location.pathname.startsWith("/public-reports");
  const reportId = token;

  const {
    data: publichealthData,
    isLoading,
    error,
    refetch,
  } = usePerformanceHealthReport(reportId || "");

  const truncateToTwoDecimals = (num: number) => {
    return Math.trunc(num * 100) / 100;
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Loading Health report...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center py-12">
          <div className="text-destructive mb-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Error Loading Report</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Unable to load the GMB health report with ID: {token}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => refetch()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded"
            >
              Retry
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!publichealthData) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested GMB health report could not be found.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Report ID: {token}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-secondary text-secondary-foreground px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const competitors = publichealthData?.data.competitorAndCitationData || [];

  const competitorChartData = competitors.map((item, index) => ({
    index: String(index + 1), // used on X axis
    displayName: item.title,
    avgRating: item.rating?.value ? parseFloat(item.rating.value) : 0,
    reviewCount: item.rating?.votes_count ?? 0,
  }));

  const citationChartData = competitors.map((item, index) => ({
    index: String(index + 1),
    displayName: item.title,
    citationCount: item.citation ?? 0,
  }));

  const getStatusBg = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const getSectionStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* GMB Health Score */}
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <CircularProgress
                value={publichealthData?.data?.successScore}
                size={80}
                strokeWidth={8}
                className="text-primary mb-4"
              >
                <span className="text-lg font-bold">
                  {publichealthData?.data?.successScore}%
                </span>
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
              <div className="text-2xl font-bold text-blue-600">
                {publichealthData?.data?.reviews.reply}
                <span className="text-sm">
                  / {publichealthData?.data?.reviews.review}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                No. Of Reviews
              </h3>
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
              <div className="text-2xl font-bold text-yellow-600">
                {truncateToTwoDecimals(publichealthData?.data?.avgRating)}
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                GMB Avg Rating
              </h3>
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
              <div className="text-2xl font-bold text-green-600">
                {publichealthData?.data?.gmbPhotos?.length || 0}
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                No. Of GMB Photos
              </h3>
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
              <div className="text-2xl font-bold text-purple-600">
                {publichealthData?.data?.totalPosts}
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground">
                No. Of GMB Posts
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Introduction Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-muted-foreground">
            Hello, Thank you for assessing your Google My Business (GMB)
            profile. Below are the results of our 10-point evaluation.
          </p>
        </CardContent>
      </Card>

      {/* GMB Report at a Glance */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your GMB Report at a Glance
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Test Results Cards */}
            <div className="space-y-4">
              {/* Failed Tests Card */}
              <div className="bg-red-100 border border-red-200 rounded-lg p-6">
                <div className="text-red-800 text-sm font-medium mb-1">
                  Failed Tests
                </div>
                <div className="text-2xl font-bold text-red-800">
                  {publichealthData?.data?.failedScore}%
                </div>
              </div>

              {/* Passed Tests Card */}
              <div className="bg-green-100 border border-green-200 rounded-lg p-6">
                <div className="text-green-800 text-sm font-medium mb-1">
                  Passed Tests
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {publichealthData?.data?.successScore} %
                </div>
              </div>
            </div>

            {/* Right side - Pie Chart */}
            <div className="flex justify-center">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Passed Tests",
                          value: publichealthData?.data?.successScore || 0,
                          fill: "#22c55e",
                        },
                        {
                          name: "Failed Tests",
                          value: publichealthData?.data?.failedScore || 0,
                          fill: "#ef4444",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    />
                    <Tooltip
                      formatter={(value) => [`${value || 0}%`, ""]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
