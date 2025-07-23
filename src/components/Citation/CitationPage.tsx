import React, { useEffect, useRef, useState } from "react";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { GooglePlacesInput } from "../ui/google-places-input";
import { Label } from "../ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { PlaceOrderModal } from "./PlaceOrderModal";
import {
  useCreateCitationReport,
  useGetCitationReport,
  useRefreshCitationReport,
} from "@/hooks/useCitation";
import { useListingContext } from "@/context/ListingContext";

type TrackerData = {
  listed: number;
  notListed: number;
  listedPercent: number;
  totalChecked: number;
};

const CitationTrackerCard = ({ trackerData }: { trackerData: TrackerData }) => {
  const listed = trackerData?.listed || 0;
  const notListed = trackerData?.notListed || 0;
  const listedPercent = trackerData?.listedPercent || 0;

  const chartData = [
    { name: "Listed", value: listed, fill: "hsl(var(--primary))" },
    { name: "Not Listed", value: notListed, fill: "hsl(var(--muted))" },
  ];

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-col gap-2 ml-4">
      {payload?.map((entry: any, index: number) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-2 rounded text-sm"
          style={{ backgroundColor: entry.color + "20", color: entry.color }}
        >
          <span>{entry.value}</span>
          <span className="font-semibold">{entry.payload.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Citation Tracker</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex-1">
          <div className="relative w-32 h-32 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={64}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm text-muted-foreground">Listed</span>
              <span className="text-lg font-semibold">{listedPercent}%</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded text-sm">
            <span>Listed</span>
            <span className="font-semibold">{listed}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded text-sm">
            <span>Not Listed</span>
            <span className="font-semibold">{notListed}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LocalPagesCard = () => (
  <Card className="h-full">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
        <div className="w-8 h-8 bg-primary/20 rounded"></div>
      </div>
      <CardTitle className="text-lg">Local Pages & Directories</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        Your local page and directory score is based on the number of places in
        which your listing is present, divided by the number of local page and
        directories we've checked.
      </CardDescription>
    </CardHeader>
  </Card>
);

const existingCitationData = [
  {
    website: "example1.com",
    businessName: "Business A",
    phone: "+1-234-567-8901",
    you: "Listed",
  },
  {
    website: "example2.com",
    businessName: "Business B",
    phone: "+1-234-567-8902",
    you: "Listed",
  },
  {
    website: "example3.com",
    businessName: "Business C",
    phone: "+1-234-567-8903",
    you: "Not Listed",
  },
];

const possibleCitationData = [
  { siteName: "Directory A", action: "Fix" },
  { siteName: "Directory B", action: "Fix" },
  { siteName: "Directory C", action: "Fix" },
  { siteName: "Directory D", action: "Fix" },
  { siteName: "Directory E", action: "Fix" },
];

export const CitationPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchData, setSearchData] = useState({
    businessName: "",
    phone: "",
    city: "",
  });
  // Store the formatted address string instead of the complete place object
  const selectedCityRef = useRef<string>("");
  // const selectedPlaceRef = useRef<PlaceResult | null>(null);
  const { selectedListing } = useListingContext();
  const listingName = selectedListing?.name;
  const { mutate: createCitationReport } = useCreateCitationReport();
  const { data: citationReportData, refetch } = useGetCitationReport(
    selectedListing?.id,
    hasSearched
  );
  const { mutate: refreshReport, isLoading } = useRefreshCitationReport();
  const citationData = citationReportData?.data;
  const existingCitationData = citationData?.existingCitations || [];
  const possibleCitationData = citationData?.possibleCitations || [];
  const trackerData = citationData?.summary;

  const handlePlaceSelect = (formattedAddress: string) => {
    selectedCityRef.current = formattedAddress;
    console.log("Selected city from Google:", formattedAddress);

    // Update the city field in the form
    setSearchData((prev) => ({
      ...prev,
      city: formattedAddress,
    }));
  };
  useEffect(() => {
    if (selectedListing?.name) {
      setSearchData((prev) => ({
        ...prev,
        businessName: selectedListing.name,
      }));
      refetch();
    }
  }, [selectedListing]);
  console.log("citation data", citationReportData);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handlePlaceOrder = () => {
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    refreshReport({ listingId: selectedListing?.id, isRefresh: "refresh" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const addressToUse = selectedCityRef.current || searchData.city;
    console.log("Search payload:", {
      businessName: searchData.businessName,
      phone: searchData.phone,
      city: addressToUse, // This is now the formatted_address string
    });

    const payload = {
      listingId: selectedListing?.id || 0,
      businessName: searchData.businessName,
      phone: searchData.phone,
      address: selectedCityRef.current,
    };

    createCitationReport(payload, {
      onSuccess: () => {
        setHasSearched(true);
        refetch();
        selectedCityRef.current = "";
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar
        activeTab="citation"
        onTabChange={() => {}}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />

        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {!hasSearched ? (
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
                    <form
                      onSubmit={handleSearch}
                      className="space-y-4"
                      autoComplete="off"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          type="text"
                          placeholder="Enter business name"
                          value={searchData.businessName}
                          onChange={(e) =>
                            handleInputChange("businessName", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter phone number"
                          value={searchData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          autoComplete="off"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <GooglePlacesInput
                          id="city"
                          type="text"
                          placeholder="Enter city name"
                          value={searchData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          onPlaceSelect={handlePlaceSelect}
                          required
                          autoComplete="off"
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Search
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            ) : (
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
                  <Button
                    variant="outline"
                    onClick={() => setHasSearched(false)}
                  >
                    New Search
                  </Button>
                </div>

                {/* Two Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CitationTrackerCard trackerData={trackerData} />
                  <LocalPagesCard />
                </div>

                {/* Citation Audit Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Citation Audit</CardTitle>
                    </div>
                    <Button variant="default" onClick={handlePlaceOrder}>
                      Place Order
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="existing" className="w-full">
                      <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                        <TabsTrigger value="existing">
                          Existing Citation ({citationData?.existingCitation})
                        </TabsTrigger>
                        <TabsTrigger value="possible">
                          Possible Citation (50)
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="existing" className="mt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Website</TableHead>
                              <TableHead>Business Name</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>You</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {existingCitationData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {row.website}
                                </TableCell>
                                <TableCell>{row.businessName}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      row.you === "Listed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {row.you}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>

                      <TabsContent value="possible" className="mt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Site Name</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {possibleCitationData.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {row.siteName}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm">
                                    {row.action}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      <PlaceOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
