import React from "react";
import { useParams } from "react-router-dom";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, XCircle, AlertTriangle, TrendingUp, Copy, MapPin, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useGetCitationAuditReport } from "@/api/leadApi";
import { useGetLeadReportBranding } from "@/hooks/useReportBranding";

export const CitationAuditReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { data: apiResponse, isLoading, error } = useGetCitationAuditReport(reportId || '');
  const { data: brandingResponse } = useGetLeadReportBranding(reportId || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Citation Audit Report...</p>
        </div>
      </div>
    );
  }

  if (error || !apiResponse?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load citation audit report</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Transform API response to match expected format
  const reportDetails = apiResponse?.data?.reportDetails;
  const summary = apiResponse?.data?.summary;
  const existingCitations = apiResponse?.data?.existingCitation ?? [];
  const possibleCitations = apiResponse?.data?.possibleCitation ?? [];

  // Calculate listed and non-listed counts from existing citations
  const totalCitations = summary?.totalCitations ?? 0;
  const listed = existingCitations.length;
  const nonListed = Math.max(0, totalCitations - listed);

  const reportData = {
    title: "Citation Audit Report",
    listingName: reportDetails?.bname || "Business Name",
    address: reportDetails?.address || "",
    logo: "",
    date: new Date().toLocaleDateString(),
    citations: {
      total: totalCitations,
      listed: listed,
      nonListed: nonListed,
      missing: summary?.missingCitations ?? 0,
      duplicates: summary?.duplicateListings ?? 0,
      accuracy: summary?.accuracyScore ?? 0,
    },
    existingCitations: existingCitations.map(citation => ({
      siteName: citation.host || citation.title,
      businessName: citation.found_bname || citation.title,
      phone: citation.found_phone || "",
      url: citation.url,
    })),
    possibleCitations: possibleCitations.map(citation => ({
      siteName: citation.host || citation.sitename,
      businessName: reportDetails?.bname || "",
      phone: reportDetails?.phone || "",
      url: citation.url,
      status: citation.site_status,
    })),
  };


  const brandingData = brandingResponse?.data || null;

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
      reportType="citation"
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
                        {reportData.citations.total > 0 ? Math.round((reportData.citations.listed / reportData.citations.total) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                </div>

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
                        {reportData.citations.total > 0 ? Math.round((reportData.citations.nonListed / reportData.citations.total) * 100) : 0}%
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