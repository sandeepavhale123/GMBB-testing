import React, { useEffect, useRef, useState } from "react";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { GooglePlacesInput, GooglePlacesInputRef } from "../ui/google-places-input";
import { Label } from "../ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { PlaceOrderModal } from "./PlaceOrderModal";
import { useCreateCitationReport, useGetCitationReport, useRefreshCitationReport } from "@/hooks/useCitation";
import { useListingContext } from "@/context/ListingContext";
import { FileSearch } from "lucide-react";
import { Loader } from "../ui/loader";
type TrackerData = {
  listed: number;
  notListed: number;
  listedPercent: number;
  totalChecked: number;
};
const CitationTrackerCard = ({
  trackerData
}: {
  trackerData: TrackerData;
}) => {
  const listed = trackerData?.listed || 0;
  const notListed = trackerData?.notListed || 0;
  const listedPercent = trackerData?.listedPercent || 0;
  const chartData = [{
    name: "Listed",
    value: listed,
    fill: "hsl(var(--primary))"
  }, {
    name: "Not Listed",
    value: notListed,
    fill: "hsl(var(--muted))"
  }];
  const CustomLegend = ({
    payload
  }: any) => <div className="flex flex-col gap-2 ml-4">
      {payload?.map((entry: any, index: number) => <div key={index} className="flex items-center gap-2 px-3 py-2 rounded text-sm" style={{
      backgroundColor: entry.color + "20",
      color: entry.color
    }}>
          <span>{entry.value}</span>
          <span className="font-semibold">{entry.payload.value}</span>
        </div>)}
    </div>;
  return <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Citation Tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={30} outerRadius={48} paddingAngle={2} dataKey="value" className="sm:!hidden">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={64} paddingAngle={2} dataKey="value" className="hidden sm:!block">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Listed</span>
              <span className="text-sm sm:text-lg font-semibold">{listedPercent}%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:ml-4">
          <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm">
            <span>Listed</span>
            <span className="font-semibold">{listed}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-muted text-muted-foreground rounded text-xs sm:text-sm">
            <span>Not Listed</span>
            <span className="font-semibold">{notListed}</span>
          </div>
        </div>
      </CardContent>
    </Card>;
};
const LocalPagesCard = () => <Card className="h-full">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
        <FileSearch className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
      </div>
      <CardTitle className="text-base sm:text-lg">Local Pages & Directories</CardTitle>
      <CardDescription className="text-xs sm:text-sm text-muted-foreground px-2">
        Your local page and directory score is based on the number of places in
        which your listing is present, divided by the number of local page and
        directories we've checked.
      </CardDescription>
    </CardHeader>
  </Card>;
export const CitationPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    businessName: "",
    phone: "",
    city: ""
  });
  const cityInputRef = useRef<GooglePlacesInputRef>(null);
  const {
    selectedListing
  } = useListingContext();
  const {
    mutate: createCitationReport,
    isPending: isCreating
  } = useCreateCitationReport();
  const {
    data: citationReportData,
    refetch
  } = useGetCitationReport(selectedListing?.id, hasSearched);
  const {
    mutate: refreshReport,
    isPending
  } = useRefreshCitationReport();
  const citationData = citationReportData?.data;
  const hasCitation = Boolean(citationData?.report_id);
  const existingCitationData = citationData?.existingCitations || [];
  const possibleCitationData = citationData?.possibleCitations || [];
  const trackerData = citationData?.summary;
  console.log("possible citation data", possibleCitationData);
  console.log("citation data", citationData);
  const handlePlaceSelect = (formattedAddress: string) => {
    console.log("handlePlaceSelect - Selected city from Google:", formattedAddress);
    setSearchData(prev => ({
      ...prev,
      city: formattedAddress
    }));
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (selectedListing?.name) {
      setSearchData(prev => ({
        ...prev,
        businessName: selectedListing.name
      }));
      refetch();
    }
  }, [selectedListing]);
  console.log("Current searchData state:", searchData);
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  const handlePlaceOrder = () => {
    setIsModalOpen(true);
  };
  const handleRefresh = () => {
    refreshReport({
      listingId: selectedListing?.id,
      isRefresh: "refresh"
    });
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the actual value from the city input ref
    const cityValue = cityInputRef.current?.getValue() || searchData.city;
    console.log("handleSearch - Current searchData state:", searchData);
    console.log("handleSearch - City input value:", cityValue);
    const payload = {
      listingId: selectedListing?.id || 0,
      businessName: searchData.businessName,
      phone: searchData.phone,
      address: cityValue
    };
    console.log("handleSearch - Final API payload:", payload);
    createCitationReport(payload, {
      onSuccess: () => {
        setHasSearched(true);
        refetch();
      }
    });
  };
  const handleInputChange = (field: string, value: string) => {
    console.log(`handleInputChange - ${field}:`, value);
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleCityInputChange - Manual typing detected:", e.target.value);
    handleInputChange("city", e.target.value);
  };
  if (isPageLoading) {
    return <div className="min-h-screen flex w-full">
        <Sidebar activeTab="citation" onTabChange={() => {}} collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
          <Header onToggleSidebar={toggleSidebar} />
          <div className="flex items-center justify-center min-h-[80vh]">
            <Loader size="lg" text="Loading citation page..." />
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen flex w-full">
      <Sidebar activeTab="citation" onTabChange={() => {}} collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <Header onToggleSidebar={toggleSidebar} />

        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {!hasSearched && !hasCitation ?
          // Search Form Screen
          <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                      Citation Audit Report
                    </CardTitle>
                    <CardDescription>
                      Enter your business details to start the citation audit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSearch} className="space-y-4" autoComplete="off">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input id="businessName" type="text" placeholder="Enter business name" value={searchData.businessName} onChange={e => handleInputChange("businessName", e.target.value)} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" placeholder="Enter phone number" value={searchData.phone} onChange={e => handleInputChange("phone", e.target.value)} autoComplete="off" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <GooglePlacesInput ref={cityInputRef} id="city" name="city" type="text" placeholder="Enter city name" defaultValue={searchData.city} onChange={handleCityInputChange} onPlaceSelect={handlePlaceSelect} required autoComplete="off" />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isCreating}>
                        {isCreating ? "Searching..." : "Search"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div> :
          // Citation Management Content
          <>
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Citation Management
                    </h1>
                    <p className="text-muted-foreground">
                      Monitor and manage your business citations across
                      directories
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" onClick={handleRefresh} className="me-4" disabled={isPending}>
                      {isPending ? "Refreshing..." : "Refresh Citation"}
                    </Button>
                    <Button variant="outline" onClick={() => setHasSearched(false)} className="hidden">
                      New Search
                    </Button>
                  </div>
                </div>

                {/* Two Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CitationTrackerCard trackerData={trackerData} />
                  <LocalPagesCard />
                </div>

                {/* Citation Audit Card */}
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg sm:text-xl">Citation Audit</CardTitle>
                    </div>
                    <Button variant="default" onClick={handlePlaceOrder} className="w-full sm:w-auto text-sm">
                      Place Order
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="existing" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 sm:inline-flex sm:h-10 sm:items-center sm:justify-center sm:rounded-md bg-muted p-1 text-muted-foreground">
                        <TabsTrigger value="existing" className="text-xs sm:text-sm">
                          Existing Citation ({citationData?.existingCitation})
                        </TabsTrigger>
                        <TabsTrigger value="possible" className="text-xs sm:text-sm">
                          Possible Citation ({trackerData?.totalChecked})
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="existing" className="mt-6">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs sm:text-sm">Website</TableHead>
                                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Business Name</TableHead>
                                <TableHead className="text-xs sm:text-sm hidden md:table-cell">Phone</TableHead>
                                <TableHead className="text-xs sm:text-sm">You</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {existingCitationData.map((row, index) => <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                      <img src={`https://www.google.com/s2/favicons?sz=16&domain_url=${row.website}`} alt="favicon" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" onError={e => e.currentTarget.src = "/default-icon.png"} />
                                      <span className="text-xs sm:text-sm truncate">{row.website}</span>
                                    </div>
                                    <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                      {row.businessName} • {row.phone}
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{row.businessName}</TableCell>
                                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">{row.phone}</TableCell>
                                  <TableCell>
                                    <span className={`px-1 py-0.5 sm:px-2 sm:py-1 rounded text-xs ${row.you ? "bg-green-100 text-white" : "bg-red-100 text-white"}`}>
                                      {row.you ? <>✅</> : <>❌</>}
                                    </span>
                                  </TableCell>
                                </TableRow>)}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>

                      <TabsContent value="possible" className="mt-6">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs sm:text-sm">Site Name</TableHead>
                                <TableHead className="text-xs sm:text-sm text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {possibleCitationData.map((row, index) => <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                      <img src={`https://www.google.com/s2/favicons?sz=16&domain_url=${row.website}`} alt="favicon" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" onError={e => e.currentTarget.src = "/default-icon.png"} />
                                      <span className="text-xs sm:text-sm">{row.site}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="text-xs" onClick={() => {
                                if (row.website) {
                                  const url = row.website.startsWith("http://") || row.website.startsWith("https://") ? row.website : `https://${row.website}`;
                                  window.open(url, "_blank", "noopener,noreferrer");
                                }
                              }}>
                                      Fix Now
                                    </Button>
                                  </TableCell>
                                </TableRow>)}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>}
          </div>
        </div>
      </div>

      <PlaceOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>;
};