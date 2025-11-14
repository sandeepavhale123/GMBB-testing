import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import { useDeviceBreakpoints } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import {
  GooglePlacesInput,
  GooglePlacesInputRef,
} from "../ui/google-places-input";
import { Label } from "../ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { PlaceOrderModal } from "./PlaceOrderModal";
import {
  useCreateCitationReport,
  useGetCitationReport,
  useRefreshCitationReport,
} from "@/hooks/useCitation";
import { useListingContext } from "@/context/ListingContext";
import { FileSearch } from "lucide-react";
import { Loader } from "../ui/loader";
import { ReportProgressModal } from "@/components/Dashboard/ReportProgressModal";
import { CopyUrlModal } from "@/components/Dashboard/CopyUrlModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

type TrackerData = {
  listed: number;
  notListed: number;
  listedPercent: number;
  totalChecked: number;
};

export const CitationPage: React.FC = () => {
  const { t } = useI18nNamespace("Citation/citationPage");

  const CitationTrackerCard = ({
    trackerData,
  }: {
    trackerData: TrackerData;
  }) => {
    const listed = trackerData?.listed || 0;
    const notListed = trackerData?.notListed || 0;
    const listedPercent = trackerData?.listedPercent || 0;
    const chartData = [
      {
        name: t("citationPage.trackerCard.title"),
        value: listed,
        fill: "hsl(var(--primary))",
      },
      {
        name: t("citationPage.trackerCard.notListed"),
        value: notListed,
        fill: "hsl(var(--muted))",
      },
    ];
    const CustomLegend = ({ payload }: any) => (
      <div className="flex flex-col gap-2 ml-4">
        {payload?.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: entry.color + "20",
              color: entry.color,
            }}
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
          <CardTitle className="text-lg">
            {t("citationPage.trackerCard.listed")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={48}
                    paddingAngle={2}
                    dataKey="value"
                    className="sm:!hidden"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={64}
                    paddingAngle={2}
                    dataKey="value"
                    className="hidden sm:!block"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {t("citationPage.trackerCard.listed")}
                </span>
                <span className="text-sm sm:text-lg font-semibold">
                  {listedPercent}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:ml-4">
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm">
              <span>{t("citationPage.trackerCard.listed")}</span>
              <span className="font-semibold">{listed}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-muted text-muted-foreground rounded text-xs sm:text-sm">
              <span>{t("citationPage.trackerCard.notListed")}</span>
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
        <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
          <FileSearch className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <CardTitle className="text-base sm:text-lg">
          {t("citationPage.localPagesCard.title")}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground px-2">
          {t("citationPage.localPagesCard.description")}
        </CardDescription>
      </CardHeader>
    </Card>
  );

  const location = useLocation();
  const { isMobile, isTablet, isDesktop } = useDeviceBreakpoints();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [citationTab, setCitationTab] = useState<"existing" | "possible">(
    "existing"
  );
  const [reportProgressOpen, setReportProgressOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [reportUrl, setReportUrl] = useState<string>("");
  const [copyUrlModalOpen, setCopyUrlModalOpen] = useState(false);
  const [shouldShowCopyModal, setShouldShowCopyModal] = useState(false);
  const [searchData, setSearchData] = useState({
    businessName: "",
    phone: "",
    city: "",
  });
  const cityInputRef = useRef<GooglePlacesInputRef>(null);
  const { selectedListing } = useListingContext();
  const { mutate: createCitationReport, isPending: isCreating } =
    useCreateCitationReport();
  const { data: citationReportData, refetch } = useGetCitationReport(
    selectedListing?.id,
    hasSearched
  );
  const { mutate: refreshReport, isPending } = useRefreshCitationReport();
  const citationData = citationReportData?.data;
  const hasCitation = Boolean(citationData?.report_id);
  const existingCitationData = citationData?.existingCitations || [];
  const possibleCitationData = citationData?.possibleCitations || [];
  const trackerData = citationData?.summary;
  const handlePlaceSelect = (formattedAddress: string) => {
    setSearchData((prev) => ({
      ...prev,
      city: formattedAddress,
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
      setSearchData((prev) => ({
        ...prev,
        businessName: selectedListing.name,
      }));
      refetch();
    }
  }, [selectedListing]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Close sidebar on navigation change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMobile, sidebarOpen]);
  const handlePlaceOrder = () => {
    setIsModalOpen(true);
  };
  const handleRefresh = () => {
    refreshReport({
      listingId: selectedListing?.id,
      isRefresh: "refresh",
    });
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Get the actual value from the city input ref
    const cityValue = cityInputRef.current?.getValue() || searchData.city;

    const payload = {
      listingId: selectedListing?.id || 0,
      businessName: searchData.businessName,
      phone: searchData.phone,
      address: cityValue,
    };

    setReportUrl("");
    setReportProgressOpen(true);
    setReportStatus("loading");

    createCitationReport(payload, {
      onSuccess: (data) => {
        setReportStatus("success");

        // Construct shareable URL from report_id
        const reportId = data.data.report_id;
        const shareableUrl = reportId
          ? `${window.location.origin}/lead/citation/${reportId}`
          : "";

        setReportUrl(shareableUrl);

        // Check if we're on a citation viewing route
        const isCitationViewRoute = /^\/citation\/\d+/.test(location.pathname);
        setShouldShowCopyModal(!isCitationViewRoute);

        setHasSearched(true);
        refetch();
      },
      onError: () => {
        setReportStatus("error");
      },
    });
  };
  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("city", e.target.value);
  };

  const handleReportProgressSuccess = () => {
    setReportProgressOpen(false);
    setReportStatus(null);

    // Only show copy URL modal if we decided to show it during report creation
    if (shouldShowCopyModal) {
      setCopyUrlModalOpen(true);
    }
  };

  const handleReportProgressClose = (open: boolean) => {
    setReportProgressOpen(open);
    if (!open) {
      setReportStatus(null);
      setReportUrl("");
    }
  };
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex w-full">
        {/* Mobile Backdrop - Only for phones, not tablets */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={handleBackdropClick}
          />
        )}

        <Sidebar
          activeTab="citation"
          onTabChange={() => {}}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          isTablet={isTablet}
        />

        <div
          className={`flex-1 transition-all duration-300 ${
            isMobile
              ? "ml-0"
              : isTablet
              ? sidebarCollapsed
                ? "ml-16"
                : "ml-64"
              : sidebarCollapsed
              ? "lg:ml-16"
              : "lg:ml-64"
          }`}
        >
          <Header onToggleSidebar={toggleSidebar} />
          <div className="flex items-center justify-center min-h-[80vh]">
            <Loader size="lg" text={t("citationPage.loading")} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex w-full">
      {/* Mobile Backdrop - Only for phones, not tablets */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={handleBackdropClick}
        />
      )}

      <Sidebar
        activeTab="citation"
        onTabChange={() => {}}
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        isTablet={isTablet}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          isMobile
            ? "ml-0"
            : isTablet
            ? sidebarCollapsed
              ? "ml-16"
              : "ml-64"
            : sidebarCollapsed
            ? "lg:ml-16"
            : "lg:ml-64"
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />

        <div className="p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {!hasSearched && !hasCitation ? (
              // Search Form Screen
              <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                      {t("citationPage.searchForm.title")}
                    </CardTitle>
                    <CardDescription>
                      {t("citationPage.searchForm.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSearch}
                      className="space-y-4"
                      autoComplete="off"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="businessName">
                          {" "}
                          {t("citationPage.searchForm.businessNameLabel")}
                        </Label>
                        <Input
                          id="businessName"
                          type="text"
                          placeholder={t(
                            "citationPage.searchForm.businessNamePlaceholder"
                          )}
                          value={searchData.businessName}
                          onChange={(e) =>
                            handleInputChange("businessName", e.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {" "}
                          {t("citationPage.searchForm.phoneLabel")}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={t(
                            "citationPage.searchForm.phonePlaceholder"
                          )}
                          value={searchData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          autoComplete="off"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">
                          {" "}
                          {t("citationPage.searchForm.cityLabel")}
                        </Label>
                        <GooglePlacesInput
                          ref={cityInputRef}
                          id="city"
                          name="city"
                          type="text"
                          placeholder={t(
                            "citationPage.searchForm.cityPlaceholder"
                          )}
                          defaultValue={searchData.city}
                          onChange={handleCityInputChange}
                          onPlaceSelect={handlePlaceSelect}
                          required
                          autoComplete="off"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isCreating}
                      >
                        {isCreating
                          ? t("citationPage.searchForm.searchingButton")
                          : t("citationPage.searchForm.searchButton")}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Citation Management Content
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {t("citationPage.management.title")}
                    </h1>
                    <p className="text-muted-foreground">
                      {t("citationPage.management.description")}
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      onClick={handleRefresh}
                      className="me-4"
                      disabled={isPending}
                    >
                      {isPending
                        ? t("citationPage.management.refreshing")
                        : t("citationPage.management.refresh")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setHasSearched(false)}
                      className="hidden"
                    >
                      {t("citationPage.management.newSearch")}
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
                      <CardTitle className="text-lg sm:text-xl">
                        {t("citationPage.auditCard.title")}
                      </CardTitle>
                    </div>
                    <Button
                      asChild
                      variant="default"
                      className="w-full sm:w-auto text-sm"
                    >
                      <a
                        href="https://orders.citationbuilderpro.com/store/43/local-citation-service"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("citationPage.auditCard.orderButton")}
                      </a>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                        <button
                          onClick={() => setCitationTab("existing")}
                          className={`px-3 py-2 sm:px-4 font-medium text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap ${
                            citationTab === "existing"
                              ? "bg-primary text-primary-foreground"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          {t("citationPage.auditCard.existingTab")}(
                          {citationData?.existingCitation})
                        </button>
                        <button
                          onClick={() => setCitationTab("possible")}
                          className={`px-3 py-2 sm:px-4 font-medium text-xs sm:text-sm rounded-md transition-colors whitespace-nowrap ${
                            citationTab === "possible"
                              ? "bg-primary text-primary-foreground"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          {t("citationPage.auditCard.possibleTab")}(
                          {trackerData?.totalChecked})
                        </button>
                      </div>

                      {citationTab === "existing" && (
                        <div className="overflow-x-auto rounded-md border -mx-4 sm:mx-0">
                          <Table className="min-w-full">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs sm:text-sm">
                                  {t("citationPage.auditCard.table.website")}
                                </TableHead>
                                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                                  {t(
                                    "citationPage.auditCard.table.businessName"
                                  )}
                                </TableHead>
                                <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                                  {t("citationPage.auditCard.table.phone")}
                                </TableHead>
                                <TableHead className="text-xs sm:text-sm">
                                  {t("citationPage.auditCard.table.action")}
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {existingCitationData.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                      <img
                                        src={`https://www.google.com/s2/favicons?sz=16&domain_url=${row.website}`}
                                        alt="favicon"
                                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                                        onError={(e) =>
                                          (e.currentTarget.src =
                                            "/default-icon.png")
                                        }
                                      />
                                      <span className="text-xs sm:text-sm truncate">
                                        {row.website}
                                      </span>
                                    </div>
                                    <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                      {row.businessName} •{" "}
                                      {row.phone &&
                                      /^[\d+\-().\s]+$/.test(row.phone)
                                        ? row.phone
                                        : t("citationPage.noPhoneProvided")}
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                                    {row.businessName}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                                    {row.phone &&
                                    /^[\d+\-().\s]+$/.test(row.phone)
                                      ? row.phone
                                      : t("citationPage.noPhoneProvided")}
                                  </TableCell>
                                  <TableCell>
                                    <a
                                      href={
                                        row.website?.startsWith("http://") ||
                                        row.website?.startsWith("https://")
                                          ? row.website
                                          : `https://${row.website}`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center px-2 py-1 sm:px-3 sm:py-2 bg-primary text-primary-foreground rounded text-xs sm:text-sm hover:bg-primary/80 transition-colors w-full sm:w-auto"
                                    >
                                      {t("citationPage.auditCard.table.view")}
                                    </a>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {citationTab === "possible" && (
                        <div className="w-full overflow-x-auto rounded-md border">
                          <Table className="min-w-max table-auto">
                            {/* <div className="overflow-x-auto rounded-md border -mx-4 sm:mx-0">
                          <Table className="min-w-full table-auto"> */}
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs sm:text-sm">
                                  {t("citationPage.auditCard.table.siteName")}
                                </TableHead>
                                <TableHead className="text-xs sm:text-sm text-right">
                                  {t("citationPage.auditCard.table.action")}
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {possibleCitationData.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2 sm:gap-4">
                                      <img
                                        src={`https://www.google.com/s2/favicons?sz=16&domain_url=${row.website}`}
                                        alt="favicon"
                                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                                        onError={(e) =>
                                          (e.currentTarget.src =
                                            "/default-icon.png")
                                        }
                                      />
                                      <span className="text-xs sm:text-sm break-words">
                                        {row.site}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs w-full sm:w-auto whitespace-nowrap"
                                      onClick={() => {
                                        if (row.website) {
                                          const url =
                                            row.website.startsWith("http://") ||
                                            row.website.startsWith("https://")
                                              ? row.website
                                              : `https://${row.website}`;
                                          window.open(
                                            url,
                                            "_blank",
                                            "noopener,noreferrer"
                                          );
                                        }
                                      }}
                                    >
                                      {t("citationPage.auditCard.table.fixNow")}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
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

      {/* Report Progress Modal */}
      {reportStatus && (
        <ReportProgressModal
          open={reportProgressOpen}
          onOpenChange={handleReportProgressClose}
          reportType="citation-audit"
          status={reportStatus}
          onSuccess={handleReportProgressSuccess}
        />
      )}

      {/* Copy URL Modal */}
      <CopyUrlModal
        open={copyUrlModalOpen}
        onOpenChange={setCopyUrlModalOpen}
        reportUrl={reportUrl}
      />
    </div>
  );
};
