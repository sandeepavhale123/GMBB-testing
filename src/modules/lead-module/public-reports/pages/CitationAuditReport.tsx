import React from "react";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, XCircle, AlertTriangle, TrendingUp, Copy, MapPin } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export const CitationAuditReport: React.FC = () => {
  // Mock data - replace with actual data fetching
  const reportData = {
    title: "Citation Audit Report",
    listingName: "Sample Business",
    address: "123 Main St, City, State 12345",
    logo: "",
    date: "January 15, 2025",
    citations: {
      total: 120,
      listed: 85,
      nonListed: 35,
      missing: 35,
      duplicates: 5,
      accuracy: 85,
    },
    existingCitations: [
      { siteName: "wanderlog.com", businessName: "Sample Business", phone: "(555) 123-4567" },
      { siteName: "instagram.com", businessName: "Sample Business", phone: "(555) 123-4567" },
      { siteName: "facebook.com", businessName: "Sample Business", phone: "(555) 123-4567" },
      { siteName: "yelp.com", businessName: "Sample Business", phone: "(555) 123-4567" },
      { siteName: "google.com", businessName: "Sample Business", phone: "(555) 123-4567" },
    ],
    possibleCitations: [
      { siteName: "tripadvisor.com", businessName: "Sample Business", phone: "(555) 123-4567" },
      { siteName: "yellowpages.com", businessName: "Sample Business", phone: "(555) 123-4567" },
      { siteName: "foursquare.com", businessName: "Sample Business", phone: "(555) 123-4567" },
      { siteName: "nextdoor.com", businessName: "Sample Business", phone: "(555) 123-4567" },
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

  // Chart data for donut chart
  const chartData = [
    {
      name: "Listed",
      value: reportData.citations.listed,
      fill: "#3b82f6", // blue
    },
    {
      name: "Non-Listed", 
      value: reportData.citations.nonListed,
      fill: "#ec4899", // pink/magenta
    },
  ];

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-col gap-2 ml-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium">{entry.value}</span>
          <span className="text-sm text-muted-foreground">({entry.payload.value})</span>
        </div>
      ))}
    </div>
  );

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
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Citations Found</p>
                  <p className="text-3xl font-bold">{reportData.citations.total}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accuracy Score</p>
                  <p className="text-3xl font-bold text-green-600">{reportData.citations.accuracy}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Missing Citations</p>
                  <p className="text-3xl font-bold text-orange-600">{reportData.citations.missing}</p>
                </div>
                <XCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duplicate Listings</p>
                  <p className="text-3xl font-bold text-red-600">{reportData.citations.duplicates}</p>
                </div>
                <Copy className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Citation Status at a Glance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Your Citation Report at a Glance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1 space-y-4">
                {/* Non-Listed Card */}
                <div className="bg-red-100 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">Non-Listed</h3>
                      <p className="text-sm text-red-700">Areas that need attention</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-red-900">{reportData.citations.nonListed}</div>
                      <div className="text-lg font-medium text-red-700">
                        {Math.round((reportData.citations.nonListed / reportData.citations.total) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listed Card */}
                <div className="bg-green-100 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Listed</h3>
                      <p className="text-sm text-green-700">Areas performing well</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-900">{reportData.citations.listed}</div>
                      <div className="text-lg font-medium text-green-700">
                        {Math.round((reportData.citations.listed / reportData.citations.total) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="flex-1 flex justify-center">
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.name === 'Listed' ? '#22c55e' : '#ef4444'} 
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Local Page & Directory Score Info */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-3">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Local Page & Directory Score</h3>
              <p className="text-blue-100 leading-relaxed">
                Your local page and directory score is based on the number of places in which your listing is present, 
                divided by the number of local page and directories we've checked.
              </p>
            </div>
          </div>
        </div>

        {/* Citation Audit Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Citation Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="existing" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="existing">
                  Existing Citations ({reportData.existingCitations.length})
                </TabsTrigger>
                <TabsTrigger value="possible">
                  Possible Citations ({reportData.possibleCitations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Site Name</TableHead>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.existingCitations.map((citation, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://www.google.com/s2/favicons?sz=16&domain_url=${citation.siteName}`}
                                alt="favicon"
                                className="w-4 h-4"
                                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                              />
                              {citation.siteName}
                            </div>
                          </TableCell>
                          <TableCell>{citation.businessName}</TableCell>
                          <TableCell>{citation.phone}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`https://${citation.siteName}`, '_blank')}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="possible" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Site Name</TableHead>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.possibleCitations.map((citation, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <img
                                src={`https://www.google.com/s2/favicons?sz=16&domain_url=${citation.siteName}`}
                                alt="favicon"
                                className="w-4 h-4"
                                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                              />
                              {citation.siteName}
                            </div>
                          </TableCell>
                          <TableCell>{citation.businessName}</TableCell>
                          <TableCell>{citation.phone}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => window.open(`https://${citation.siteName}`, '_blank')}
                            >
                              Add Listing
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PublicReportLayout>
  );
};