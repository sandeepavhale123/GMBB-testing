import React from "react";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye, CheckCircle, XCircle, AlertTriangle, Star } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { CTASection } from "../components/CTASection";

export const GmbProspectReport: React.FC = () => {
  // Mock data - replace with actual data fetching
  const reportData = {
    title: "GMB Prospect Report",
    listingName: "Sample Business",
    address: "123 Main St, City, State 12345",
    logo: "",
    date: "January 15, 2025",
    gmbScore: {
      current: 30,
      potential: 70,
    },
    auditItems: [
      { 
        id: 1, 
        item: "Missing Description or Description Less Than 300 Characters", 
        status: "fail", 
        whyItMatters: "A detailed description helps customers quickly understand what your business offers and builds trust. Short or missing descriptions can make your profile less engaging.",
        recommendation: "Write a compelling description of at least 300 characters that highlights your unique offerings, key services, and values."
      },
      { 
        id: 2, 
        item: "Missing Website", 
        status: "pass", 
        whyItMatters: "A website link allows customers to explore your business in greater detail. Without it, potential customers might turn to competitors for more information.",
        recommendation: "Add a working website link to your GMB profile to boost credibility and drive traffic to your site."
      },
      { 
        id: 3, 
        item: "Review Count", 
        status: "pass", 
        whyItMatters: "Reviews are social proof. Listings with fewer than 10 reviews appear less credible, and customers are more likely to choose competitors with more reviews.",
        recommendation: "Encourage your satisfied customers to leave reviews. You can send them a direct link to your GMB profile for convenience."
      },
      { 
        id: 4, 
        item: "Rating Below", 
        status: "pass", 
        whyItMatters: "Great GMB A rating of 4 or above is a strong indicator of customer satisfaction.",
        recommendation: "Continue responding to reviews to show customers that you value their feedback."
      },
      { 
        id: 5, 
        item: "Additional Categories Not Present or Less Than 5", 
        status: "fail", 
        whyItMatters: "Additional categories help Google understand your services and display your business for relevant searches. Missing categories limit your visibility.",
        recommendation: "Add additional categories that reflect all your services. For example, if you're a plumber, include categories like 'Emergency Plumbing' or 'Water Heater Installation.'"
      },
      { 
        id: 6, 
        item: "Less Than 5 Photos", 
        status: "pass", 
        whyItMatters: "High-quality photos enhance your profile's appeal and help customers visualize your offerings.",
        recommendation: "Regularly update photos to keep your profile fresh and engaging."
      },
      { 
        id: 7, 
        item: "Missing Working Hours", 
        status: "pass", 
        whyItMatters: "Customers need to know when you're open. Missing hours can lead to lost business and frustrated customers.",
        recommendation: "Update your business hours, including holiday schedules, to ensure customers always have accurate information."
      },
      { 
        id: 8, 
        item: "Missing or Fewer Than 5 Attributes", 
        status: "pass", 
        whyItMatters: "Customers need to know when you're open. Missing hours can lead to lost business and frustrated customers.",
        recommendation: "Update your business hours, including holiday schedules, to ensure customers always have accurate information."
      },
      { 
        id: 9, 
        item: "The logo is present and professional.", 
        status: "pass", 
        whyItMatters: "Your logo helps build brand recognition and makes your profile look professional.",
        recommendation: "Your logo looks great! Ensure it stays consistent across all platforms."
      },
    ],
    competitorData: [
      { name: "Webmarts Software Solution", avgRating: 4.1, reviewCount: 10 },
      { name: "Redbytes Software", avgRating: 4.7, reviewCount: 23 },
      { name: "Websar IT Solutions", avgRating: 5.0, reviewCount: 61 },
      { name: "Web Square IT Solutions", avgRating: 4.3, reviewCount: 10 },
      { name: "WebNTT Technologies", avgRating: 5.0, reviewCount: 7 },
    ],
    citationData: [
      { rank: "YOU", name: "Webmarts Software Solution", citations: 14 },
      { rank: "2", name: "Redbytes Software", citations: 18 },
      { rank: "3", name: "Websar IT Solutions", citations: 13 },
      { rank: "4", name: "Web Square IT Solutions", citations: 26 },
      { rank: "5", name: "WebNTT Technologies", citations: 20 },
    ],
    businessListings: [
      { platform: "Google My Business", status: "claimed", url: "google.com/business" },
      { platform: "Yelp", status: "unclaimed", url: "" },
      { platform: "Facebook", status: "claimed", url: "facebook.com/business" },
      { platform: "Bing Places", status: "unclaimed", url: "" },
    ],
    advancedSuggestions: [
      { number: 1, suggestion: "Use question and Answer (Q&A)", impact: "High Impact" },
      { number: 2, suggestion: "Add a virtual Tour", impact: "High Impact" },
      { number: 3, suggestion: "Highlight Special Features with Posts", impact: "High Impact" },
      { number: 4, suggestion: "Use Call Tracking", impact: "Moderate Impact" },
      { number: 5, suggestion: "Optimize for Voice Search", impact: "Moderate Impact" },
      { number: 6, suggestion: "Add Service Areas", impact: "High Impact" },
      { number: 7, suggestion: "Use Google Posts to Announce Offers", impact: "High Impact" },
      { number: 8, suggestion: "Use Emoji in Posts", impact: "Moderate Impact" },
      { number: 9, suggestion: "Integrate Booking Options", impact: "Moderate Impact" },
      { number: 10, suggestion: "Share Customer Stories", impact: "Moderate Impact" },
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

  const pieData = [
    { name: 'Current Score', value: reportData.gmbScore.current, fill: '#ef4444' },
    { name: 'Potential Score', value: reportData.gmbScore.potential, fill: '#22c55e' },
  ];

  const COLORS = ['#ef4444', '#22c55e'];

  return (
    <PublicReportLayout
      title={reportData.title}
      listingName={reportData.listingName}
      address={reportData.address}
      logo={reportData.logo}
      date={reportData.date}
      brandingData={brandingData}
    >
      <div className="space-y-8">
        {/* Introduction Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Google My Business Audit Report</h2>
            <p className="text-muted-foreground leading-relaxed">
              This comprehensive audit analyzes your Google My Business profile performance and identifies 
              key opportunities for improvement. Our analysis covers all critical aspects of your GMB presence, 
              from basic information accuracy to advanced optimization strategies that can significantly boost 
              your local search visibility and customer engagement.
            </p>
          </CardContent>
        </Card>

        {/* Your GMB Report at a Glance */}
        <div className="mb-8">
          
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Test Results */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Your GMB Report at a Glance
              </h2>
              {/* Failed Tests Card */}
              <Card className="bg-red-100 border-red-200">
                <CardContent className="p-6">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-1">
                        Failed Tests
                      </h3>
                      <p className="text-sm text-red-700">
                        Areas that need attention
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-900">
                        {reportData.auditItems.filter(item => item.status === 'fail').length}
                      </div>
                      <div className="text-sm text-red-700">
                        {Math.round((reportData.auditItems.filter(item => item.status === 'fail').length / reportData.auditItems.length) * 100)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Passed Tests Card */}
              <Card className="bg-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-900 mb-1">
                        Passed Tests
                      </h3>
                      <p className="text-sm text-green-700">
                        Areas performing well
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-900">
                        {reportData.auditItems.filter(item => item.status === 'pass').length}
                      </div>
                      <div className="text-sm text-green-700">
                        {Math.round((reportData.auditItems.filter(item => item.status === 'pass').length / reportData.auditItems.length) * 100)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Pie Chart */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value}%`, name]}
                          labelStyle={{ color: '#374151' }}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend */}
                  {/* <div className="mt-6 space-y-2 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-sm text-gray-700">Failed Tests</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {reportData.auditItems.filter(item => item.status === 'fail').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm text-gray-700">Passed Tests</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {reportData.auditItems.filter(item => item.status === 'pass').length}
                      </span>
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.auditItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`border-2 rounded-lg p-6 relative ${
                    item.status === 'pass' 
                      ? 'border-green-200 bg-green-50/50' 
                      : 'border-red-200 bg-red-50/50'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      item.status === 'pass' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {item.status === 'pass' ? 'Passed' : 'Failed'}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="mb-4 pr-20">
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.id}. {item.item}
                    </h3>
                  </div>

                  {/* Why It Matters */}
                  <div className="mb-4">
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-gray-900 mr-1">•</span>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Why It Matters:</span>
                        <div className="text-sm text-gray-700 mt-1 leading-relaxed">
                          {item.whyItMatters}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <div className="flex items-start">
                      <span className="text-sm font-semibold text-gray-900 mr-1">•</span>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Recommendation:</span>
                        <div className="text-sm text-gray-700 mt-1 leading-relaxed">
                          {item.recommendation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Competitor Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Top Section - Performance Summary */}
            <div className="mb-6 p-6 border-2 border-green-200 bg-green-50/50 rounded-lg relative">
              <div className="absolute top-4 right-4">
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">
                  Passed
                </span>
              </div>
              
              <h3 className="text-base font-semibold text-gray-900 mb-4 pr-20">
                The listing outperforms or matches its competitors in key areas
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-sm font-semibold text-gray-900 mr-1">•</span>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Why It Matters:</span>
                    <div className="text-sm text-gray-700 mt-1">
                      standing out among competitors increase the chance of attraction more customer
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-sm font-semibold text-gray-900 mr-1">•</span>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Recommendation:</span>
                    <div className="text-sm text-gray-700 mt-1">
                      standing out among competitors increase the chance of attraction more customer
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="mb-6 p-4 border rounded-lg">
              <h4 className="text-lg font-semibold text-center mb-4">Competitor Analysis</h4>
              
              <div className="flex justify-center items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-700">Avg. Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm text-gray-700">Review Count</span>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.competitorData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                      fontSize={12}
                    />
                    <YAxis yAxisId="rating" domain={[0, 5]} />
                    <YAxis yAxisId="reviews" orientation="right" domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'avgRating' ? `${value}/5.0` : value,
                        name === 'avgRating' ? 'Avg. Rating' : 'Review Count'
                      ]}
                    />
                    <Bar yAxisId="rating" dataKey="avgRating" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="reviews" dataKey="reviewCount" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Citation Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-green-200 grid grid-cols-3 font-semibold text-gray-900">
                <div className="p-3 text-center">#</div>
                <div className="p-3">Business Name</div>
                <div className="p-3 text-center">No. Local Citation</div>
              </div>
              
              {reportData.citationData.map((item, index) => (
                <div key={index} className={`grid grid-cols-3 border-t ${item.rank === 'YOU' ? 'bg-gray-100' : 'bg-white'}`}>
                  <div className="p-3 text-center font-medium text-gray-900">{item.rank}</div>
                  <div className="p-3 text-gray-800">{item.name}</div>
                  <div className="p-3 text-center text-gray-900">{item.citations}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Listings Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.businessListings.map((listing, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{listing.platform}</span>
                    {listing.url && (
                      <div className="text-xs text-muted-foreground">{listing.url}</div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    listing.status === 'claimed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <CTASection />

        {/* Advanced Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Suggestion Beyond Current Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden border rounded-lg">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-gray-50 border-b font-semibold text-gray-900">
                <div className="col-span-1 p-4 text-center">#</div>
                <div className="col-span-8 p-4">Suggestion</div>
                <div className="col-span-3 p-4 text-center">Impact Level</div>
              </div>
              
              {/* Table Rows */}
              {reportData.advancedSuggestions.map((suggestion, index) => (
                <div key={index} className={`grid grid-cols-12 border-b last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <div className="col-span-1 p-4 text-center font-medium text-gray-900">
                    {suggestion.number}
                  </div>
                  <div className="col-span-8 p-4 text-gray-800">
                    {suggestion.suggestion}
                  </div>
                  <div className="col-span-3 p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      suggestion.impact === 'High Impact'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {suggestion.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};