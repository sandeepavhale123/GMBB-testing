import React from "react";
import { useHealthReport } from "@/api/healthApi";
import { useListingContext } from "@/context/ListingContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CircularProgress } from "../ui/circular-progress";
import {
  Camera,
  FileText,
  MessageSquare,
  RefreshCcw,
  Star,
} from "lucide-react";
import { Button } from "../ui/button";
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
import { Badge } from "@/components/ui/badge";
import { formatToDayMonthYear } from "@/utils/dateUtils";

export const Health: React.FC = () => {
  const { selectedListing } = useListingContext();
  const isMobile = useIsMobile();
  const {
    data: healthData,
    loading,
    error,
    refreshHealthReport,
  } = useHealthReport(
    selectedListing?.id ? parseInt(selectedListing.id) : null
  );

  // console.log("health data", healthData);

  const truncateToTwoDecimals = (num: number) => {
    return Math.trunc(num * 100) / 100;
  };

  const competitors = healthData?.competitorAndCitationData || [];

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

  if (loading)
    return <div className="text-center py-10">Loading health data...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  if (!healthData)
    return <div className="text-gray-500 text-center py-10">No data found</div>;
  return (
    // header area
    <div className={`flex-1 flex flex-col transition-all duration-300 `}>
      {/* Dark Header */}
      <header className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-white h-[250px] z-10 relative">
        <h2
          className="text-3xl font-bold text-white"
          style={{
            marginTop: isMobile ? "60px" : "30px",
            textAlign: "center",
          }}
        >
          GMB Health Report
        </h2>
        <div
          className={`container mx-auto flex items-center justify-between px-4 md:px-8 ${
            isMobile ? "flex-col space-y-4" : ""
          }`}
          style={{
            paddingTop: "20px",
            paddingBottom: "50px",
          }}
        >
          {/* Left: Business Branding */}
          <div className={`flex items-center space-x-4`}>
            {healthData?.logo ? (
              <img
                src={healthData?.logo}
                alt="Business Logo"
                className={`rounded-lg object-cover ${
                  isMobile ? "w-12 h-12" : "w-16 h-16"
                }`}
              />
            ) : (
              <div
                className={`bg-white rounded-lg flex items-center justify-center ${
                  isMobile ? "w-12 h-12" : "w-16 h-16"
                }`}
              >
                <span
                  className={`font-bold text-gray-900 ${
                    isMobile ? "text-lg" : "text-2xl"
                  }`}
                >
                  {healthData?.locationName?.charAt(0) || "B"}
                </span>
              </div>
            )}
            <div className={`flex flex-col ${isMobile ? " space-y-1" : ""}`}>
              <h1
                className={`font-bold text-white ${
                  isMobile ? "text-base" : "text-2xl"
                }`}
              >
                {healthData?.locationName}
              </h1>
              <p
                className={`text-white ${
                  isMobile ? "text-xs leading-tight max-w-[280px]" : "text-lg"
                }`}
              >
                {healthData?.address}
              </p>
            </div>
          </div>

          {/* Center: Report Title - Hidden on mobile as it's already in the header */}
          
          {/* Right: Report Date */}
          <div className={`${isMobile ? "text-center" : "text-right"}`}>
            <p className="text-sm text-white">Report Date</p>
            <p className={`text-white ${isMobile ? "text-base" : "text-lg"}`}>
              {formatToDayMonthYear(new Date())}
            </p>
          </div>
        </div>
      </header>

      <main
        className="flex-1 overflow-auto relative z-40"
        style={{
          marginTop: "-100px",
        }}
      >

        {!isMobile && <div className="flex-1 text-center"></div>}
          <Button
            onClick={refreshHealthReport}
            className="bg-white hover:bg-black hover:text-white text-black fixed right-0 top-1/2 -translate-y-1/2 shadow-lg shadow-grey-500/50 flex-col p-2 z-[9999] rounded-l-md rounded-r-none hidden sm:flex"
           style={{height:70,width:120}}>
            <RefreshCcw className="w-5 h-5 mb-1" />
            <span className="text-xs leading-tight">Refresh Report</span>
          </Button>
        <div className={`container mx-auto ${isMobile ? "p-4" : "p-8"}`}>
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* GMB Health Score */}
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <CircularProgress
                      value={healthData?.successScore}
                      size={80}
                      strokeWidth={8}
                      className="text-primary mb-4"
                    >
                      <span className="text-lg font-bold">
                        {healthData?.successScore}%
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
                      {healthData?.reviews?.reply}
                      <span className="text-sm">
                        / {healthData?.reviews?.review}
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
                      {truncateToTwoDecimals(healthData?.avgRating)}
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
                      {truncateToTwoDecimals(healthData?.gmbPhotos)}
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
                      {healthData?.totalPosts}
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
                

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Left side - Test Results Cards */}
                  <div className="space-y-4">
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Your GMB Report at a Glance
                      </h2>
                    </div>
                    {/* Failed Tests Card */}
                    <div className="bg-red-100 border border-red-200 rounded-lg px-6 py-3">
                      <div className="text-red-800 text-sm font-medium mb-1">
                        Failed Tests
                      </div>
                      <div className="text-2xl font-bold text-red-800">
                        {healthData?.failedScore}%
                      </div>
                    </div>

                    {/* Passed Tests Card */}
                    <div className="bg-green-100 border border-green-200 rounded-lg px-6 py-3">
                      <div className="text-green-800 text-sm font-medium mb-1">
                        Passed Tests
                      </div>
                      <div className="text-2xl font-bold text-green-800">
                        {healthData?.successScore} %
                      </div>
                    </div>
                  </div>

                  {/* Right side - Pie Chart */}
                  <div className="flex justify-center">
                    <div className="w-[250px] h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Passed Tests",
                                value: healthData?.successScore || 0,
                                fill: "#22c55e",
                              },
                              {
                                name: "Failed Tests",
                                value: healthData?.failedScore || 0,
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

            {/* Detailed Breakdown */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Detailed Breakdown</h2>

                <div className="space-y-6">
                  {Object.entries(healthData?.detailedBreakdown).map(
                    ([key, value], index) => {
                      const breakdownInfo: Record<
                        string,
                        { title: string; why: string; recommendation: string }
                      > = {
                        description: {
                          title:
                            "Missing Description or Description Less Than 300 Characters",
                          why: "A detailed description helps customers quickly understand what your business offers and builds trust. Short or missing descriptions can make your profile less appealing.",
                          recommendation:
                            "Write a comprehensive description of at least 300 characters that highlights your unique offerings, key services, and values.",
                        },
                        website: {
                          title: "Missing Website",
                          why: "A website link allows customers to explore your business in greater detail. Without it, potential customers might turn to competitors for more information.",
                          recommendation:
                            "Add a working website link to your GMB profile to boost credibility and drive traffic to your site.",
                        },
                        review: {
                          title: "Review Count",
                          why: "Reviews are social proof. Listings with fewer than 10 reviews appear less credible.",
                          recommendation:
                            "Encourage your satisfied customers to leave reviews. You can send them a direct link to your GMB profile.",
                        },
                        rating: {
                          title: "Rating Below Average",
                          why: "A higher rating indicates better customer satisfaction and improves visibility.",
                          recommendation:
                            "Respond to negative reviews politely and focus on customer service improvements.",
                        },
                        addCategory: {
                          title:
                            "Additional Categories Not Present or Less Than 5",
                          why: "Additional categories help Google understand your services and display your listing for relevant searches.",
                          recommendation:
                            "Add categories that reflect all your services like 'Emergency Plumbing' or 'Installation'.",
                        },
                        photo: {
                          title: "Less Than 5 Photos",
                          why: "High-quality photos enhance your profile and attract more customers.",
                          recommendation:
                            "Upload updated and clear photos regularly.",
                        },
                        workingHrs: {
                          title: "Missing Working Hours",
                          why: "Customers need to know when you're open. Missing hours can result in lost opportunities.",
                          recommendation:
                            "Add complete business hours, including holidays or special days.",
                        },
                        attributes: {
                          title: "Missing or Incomplete Attributes",
                          why: "Attributes like 'Free Wi-Fi' or 'Wheelchair Accessible' can influence a customer's decision.",
                          recommendation:
                            "Update your attributes based on customer expectations and your offerings.",
                        },
                        profile: {
                          title: "Logo Not Present or Unclear",
                          why: "A professional logo builds brand trust and makes your profile look credible.",
                          recommendation:
                            "Add a high-resolution logo that's consistent across platforms.",
                        },
                        competitor: {
                          title: "Competitor Comparison",
                          why: "You need to match or outperform your competitors to stay relevant.",
                          recommendation:
                            "Analyze what competitors are doing better and improve your listing.",
                        },
                        citation: {
                          title: "Low Citation Count",
                          why: "Citations boost local SEO and establish business legitimacy.",
                          recommendation:
                            "Submit your business to local directories like Yelp and Yellow Pages.",
                        },
                      };

                      const item = breakdownInfo[key] || {
                        title: key,
                        why: "No information available.",
                        recommendation: "Please update this section.",
                      };
                      return (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 ${
                            value
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Badge
                              className={
                                value
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }
                            >
                              High Impact
                            </Badge>
                            <Badge
                              className={
                                value
                                  ? "bg-green-500 text-white hover:bg-green-500"
                                  : "bg-red-500 text-white hover:bg-red-500"
                              }
                            >
                              {value ? " Passed" : "Failed"}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-3">
                            {index + 1}. {item.title}
                          </h3>
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">
                              • Why it Matters:
                            </h4>
                            <p className="text-sm text-muted-foreground ml-4">
                              {item.why}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">
                              • Recommendation:
                            </h4>
                            <p className="text-sm text-muted-foreground ml-4">
                              {item.recommendation}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Competitor Analysis */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Competitor Analysis</h2>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
                  <div className="flex items-center justify-start mb-3">
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                      Moderate Impact
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    The listing outperforms or matches its competitors in key
                    areas
                  </h3>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">• Why It Matters:</h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      Standing out among competitors increase the chance of
                      attraction more customer
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">• Recommendation:</h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      analyze competitor profile and focus on areas where they
                      excel such as better rating or more details description
                    </p>
                  </div>
                </div>

                {/* Competitor Analysis Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Competitor Analysis
                    </h3>
                    <p className="text-gray-600">
                      See how you compare against your local competitors
                    </p>
                  </div>

                  {/* Enhanced Legend */}
                  <div className="flex justify-center items-center gap-8 mb-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Average Rating
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Review Count
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Bar Chart */}
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={competitorChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="index" />
                        <YAxis yAxisId="left" domain={[0, 5]} />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 100]}
                        />

                        {/* ✅ Add missing gradient definitions */}
                        <defs>
                          <linearGradient
                            id="blueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                          <linearGradient
                            id="orangeGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </linearGradient>
                        </defs>

                        <Tooltip
                          formatter={(value, name) => [
                            name === "avgRating"
                              ? `${value} ⭐`
                              : `${value} reviews`,
                            name === "avgRating" ? "Rating" : "Reviews",
                          ]}
                          labelFormatter={(label) => {
                            const business = competitorChartData.find(
                              (b) => b.index === label
                            );
                            return business ? business.displayName : label;
                          }}
                        />

                        <Bar
                          yAxisId="left"
                          dataKey="avgRating"
                          fill="url(#blueGradient)"
                          name="avgRating"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="reviewCount"
                          fill="url(#orangeGradient)"
                          name="reviewCount"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Competitor Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-green-200">
                        <th className="px-4 py-3 text-left font-semibold">#</th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Business Name
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          Avg. Rating
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          Review Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {competitorChartData.map((item, idx) => {
                        const isYou = healthData?.locationName
                          .toLowerCase()
                          .includes(item.displayName.toLowerCase());
                        // console.log("you value", isYou);
                        return (
                          <tr
                            key={item.index}
                            className={
                              isYou
                                ? "bg-green-100"
                                : idx % 2 === 0
                                ? "bg-white"
                                : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-3 font-medium">
                              {isYou ? "YOU" : item.index}
                            </td>
                            <td className="px-4 py-3">{item.displayName}</td>
                            <td className="px-4 py-3 text-center">
                              {item.avgRating > 0 ? item.avgRating : "—"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {item.reviewCount > 0 ? item.reviewCount : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Citation Analysis */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Citation Analysis</h2>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-6">
                  <div className="flex items-center justify-start mb-3">
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      High Impact
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    The Listing has fewer citation then competitors.
                  </h3>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">• Why It Matters:</h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      citation improve local SEO ranking and signal credibility
                      to search engines and customer.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">• Recommendation:</h4>
                    <p className="text-sm text-muted-foreground ml-4">
                      identify citation gaps by auditing competitor profile
                      submit your business to directories like Yelp,Yellow page
                      and other niche-specific site.
                    </p>
                  </div>
                </div>

                {/* Citation Analysis Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6 shadow-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Citation Analysis
                    </h3>
                    <p className="text-gray-600">
                      Compare local citation counts across competitors
                    </p>
                  </div>

                  {/* Enhanced Bar Chart */}
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={citationChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                        <XAxis
                          dataKey="index"
                          height={60}
                          interval={0}
                          fontSize={14}
                          tick={{ fill: "#374151", fontWeight: 600 }}
                        />

                        <YAxis
                          domain={[
                            0,
                            Math.max(
                              ...citationChartData.map((d) => d.citationCount),
                              10
                            ),
                          ]}
                          tick={{ fill: "#374151", fontSize: 12 }}
                        />

                        <Tooltip
                          formatter={(value) => [
                            `${value} citations`,
                            "Citation Count",
                          ]}
                          labelFormatter={(label) => {
                            const business = citationChartData.find(
                              (b) => b.index === label
                            );
                            return business ? business.displayName : label;
                          }}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />

                        <Bar
                          dataKey="citationCount"
                          fill="url(#citationGradient)"
                          name="Citation Count"
                          radius={[2, 2, 0, 0]}
                        />

                        <defs>
                          <linearGradient
                            id="citationGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Citation Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-green-200">
                        <th className="px-4 py-3 text-left font-semibold">#</th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Business Name
                        </th>
                        <th className="px-4 py-3 text-center font-semibold">
                          No. Local Citation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Optional: Add your own business as "YOU" at the top */}
                      {/* <tr className="bg-green-100">
                                <td className="px-4 py-3 font-medium">YOU</td>
                                <td className="px-4 py-3">Webmarts Software Solution</td>
                                <td className="px-4 py-3 text-center">14</td>
                              </tr> */}

                      {/* Competitor rows */}
                      {citationChartData.map((item, idx) => {
                        const isYou = healthData?.locationName
                          .toLowerCase()
                          .includes(item.displayName.toLowerCase());
                        return (
                          <tr
                            key={item.index}
                            className={
                              isYou
                                ? "bg-green-100"
                                : idx % 2 === 0
                                ? "bg-white"
                                : "bg-gray-50"
                            }
                          >
                            <td className="px-4 py-3 font-medium">
                              {isYou ? "YOU" : item.index}
                            </td>
                            <td className="px-4 py-3">{item.displayName}</td>
                            <td className="px-4 py-3 text-center">
                              {item.citationCount > 0
                                ? item.citationCount
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Summary of Recommendations */}
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">
                  Summary of Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>Add a working website link.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        Encourage satisfied customers to leave reviews.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>Average Rating is below 4 star</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>The logo is present and professional.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>Update your business hours.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>Less Than 5 Photos. Enhance Photo</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
