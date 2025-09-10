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

        {/* GMB Report Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              GMB Report Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <div className="text-3xl font-bold">{reportData.gmbScore.current}%</div>
                  <div className="text-sm text-muted-foreground">Current Score</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Current Score: {reportData.gmbScore.current}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Potential Score: {reportData.gmbScore.current + reportData.gmbScore.potential}%</span>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Improvement Opportunity</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your GMB profile has significant room for improvement. By addressing the issues 
                        identified below, you could potentially increase your score by {reportData.gmbScore.potential} points.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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