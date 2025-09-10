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
      { id: 1, item: "Business Name", status: "pass", recommendation: "Your business name is properly formatted and matches your actual business name." },
      { id: 2, item: "Address", status: "pass", recommendation: "Your address is complete and accurate." },
      { id: 3, item: "Phone Number", status: "fail", recommendation: "Add a local phone number to improve trust and local SEO." },
      { id: 4, item: "Website URL", status: "pass", recommendation: "Your website URL is properly linked." },
      { id: 5, item: "Business Category", status: "fail", recommendation: "Select the most accurate primary category for your business." },
      { id: 6, item: "Business Hours", status: "fail", recommendation: "Update your business hours to reflect current operating times." },
      { id: 7, item: "Business Description", status: "pass", recommendation: "Your business description is complete and informative." },
      { id: 8, item: "Photos", status: "fail", recommendation: "Add high-quality photos of your business, products, and services." },
      { id: 9, item: "Reviews Response", status: "fail", recommendation: "Respond to customer reviews to show engagement." },
      { id: 10, item: "Posts", status: "fail", recommendation: "Regularly post updates to keep your listing active." },
    ],
    competitors: [
      { name: "Competitor A", score: 85 },
      { name: "Competitor B", score: 78 },
      { name: "Competitor C", score: 92 },
      { name: "Your Business", score: 30 },
    ],
    businessListings: [
      { platform: "Google My Business", status: "claimed", url: "google.com/business" },
      { platform: "Yelp", status: "unclaimed", url: "" },
      { platform: "Facebook", status: "claimed", url: "facebook.com/business" },
      { platform: "Bing Places", status: "unclaimed", url: "" },
    ],
    advancedSuggestions: [
      { priority: "high", suggestion: "Optimize your Google My Business category selection for better visibility" },
      { priority: "high", suggestion: "Add regular posts and updates to your GMB profile" },
      { priority: "medium", suggestion: "Respond to all customer reviews to improve engagement" },
      { priority: "medium", suggestion: "Upload high-quality photos of your business and services" },
      { priority: "low", suggestion: "Claim your Yelp and Bing Places listings" },
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
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Your GMB Report at a Glance
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Test Results */}
            <div className="space-y-4">
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
                  <div className="text-center mt-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {reportData.gmbScore.current}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Current GMB Score
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-6 space-y-2 w-full">
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
                  </div>
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
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {item.status === 'pass' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium">{item.item}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === 'pass' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status === 'pass' ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-8">
                    {item.recommendation}
                  </p>
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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.competitors}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {reportData.competitors.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === 'Your Business' ? '#ef4444' : '#3b82f6'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Analysis:</strong> Your business is currently scoring below competitors. 
                Focus on the failed items above to improve your competitive position.
              </p>
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
            <CardTitle>Advanced Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.advancedSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                    suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {suggestion.priority.toUpperCase()}
                  </div>
                  <p className="text-sm flex-1">{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};