import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Star,
  MapPin,
  BookOpen,
  Heart,
  Image,
  LogOut,
  Search,
  Bell,
  User,
  Sun,
  Moon,
  Target,
  FileText,
  X,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePerformanceBrandingReport } from "@/hooks/useReports";
import { formatToDayMonthYear } from "@/utils/dateUtils";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { object } from "zod";
import { usePublicI18n } from "@/hooks/usePublicI18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const namespaces = ["PublicReports/publicReportDashboardLayout"];

interface PublicReportDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  listingName: string;
  address: string;
  logo: string;
  onExport?: () => void;
  onShare?: () => void;
  visibleSections?: string[];
  token: string;
  date: string;
  compareDate?: string; // ✅ optional
}

export const PublicReportDashboardLayout: React.FC<
  PublicReportDashboardLayoutProps
> = ({
  children,
  title,
  listingName,
  address,
  logo,
  onExport,
  onShare,
  visibleSections = [],
  token,
  date,
  compareDate, // ✅ optional
}) => {
  const { t, languageFullName } = usePublicI18n(namespaces);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data: brandingData, isLoading } = usePerformanceBrandingReport(
    token,
    languageFullName
  );
  const branding = brandingData?.data || null;
  const { lightLogo, darkLogo } = useThemeLogo();

  const allEmptyExceptLogo = branding
    ? Object.entries(branding)
        .filter(([key]) => key !== "company_logo")
        .every(([_, value]) => value === "")
    : true; // default to true or false based on your UX need

  const ln = localStorage.getItem("i18nextLng");

  const allSidebarItems = [
    {
      id: "gmb-health",
      label: t("publicReportDashboard.sidebar.gmbHealth"),
      name: "gmb-health",
      icon: Heart,
      path: `/gmb-health/${token}?lang=${ln}`,
    },
    {
      id: "insights",
      label: t("publicReportDashboard.sidebar.businessInsights"),
      name: "gmb-insight",
      icon: BarChart3,
      path: `/gmb-insight/${token}?lang=${ln}`,
    },
    {
      id: "reviews",
      label: t("publicReportDashboard.sidebar.reviews"),
      name: "gmb-review",
      icon: Star,
      path: `/gmb-review/${token}?lang=${ln}`,
    },
    {
      id: "posts",
      label: t("publicReportDashboard.sidebar.postPerformance"),
      name: "gmb-post",
      icon: FileText,
      path: `/gmb-post/${token}?lang=${ln}`,
    },
    {
      id: "media",
      label: t("publicReportDashboard.sidebar.mediaPerformance"),
      name: "gmb-media",
      icon: Image,
      path: `/gmb-media/${token}?lang=${ln}`,
    },
    {
      id: "geo-ranking",
      label: t("publicReportDashboard.sidebar.geoRanking"),
      name: "gmb-ranking",
      icon: MapPin,
      path: `/gmb-ranking/${token}?lang=${ln}`,
    },
    {
      id: "citation",
      label: t("publicReportDashboard.sidebar.citationPerformance"),
      name: "gmb-citation",
      icon: BookOpen,
      path: `/gmb-citation/${token}?lang=${ln}`,
    },
  ];
  // Filter sidebar items based on visible sections using the `name` field
  const sidebarItems = allSidebarItems.filter((item) =>
    (visibleSections || []).includes(item.name)
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const getCurrentReportName = () => {
    const path = location.pathname;
    return sidebarItems.find((item) => path.includes(item.name))?.name || "";
  };

  const currentReportName = getCurrentReportName();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white flex relative">
        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Fixed Icon Sidebar */}
        <aside
          className={`
          fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-100 shadow-sm z-50 flex flex-col items-center py-4 sm:py-8 px-2 transition-transform duration-300 w-16 md:w-16 lg:w-24
          ${isMobile ? "w-16" : "w-24"}
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
        `}
        >
          {/* Favicon at Top */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            {branding?.company_logo ? (
              <img
                src={branding?.company_logo}
                alt={t("publicReportDashboard.branding.defaultLogoAlt")}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg shadow-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {branding?.company_name?.charAt(0) ||
                    t("publicReportDashboard.branding.companyInitial")}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Icons - Only show visible sections */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 lg:space-y-6 flex-1 justify-center">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentReportName === item.name;

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                        isActive
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 w-svw ${
            isMobile ? "ml-0" : "ml-16 sm:ml-16 lg:ml-24"
          }`}
        >
          {/* Dark Header */}
          <header
            className={`text-white  z-10 relative h-[350px] md:h-[300px] lg:h-[250px]
            `}
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary-gradient-from)), hsl(var(--primary-gradient-via)), hsl(var(--primary-gradient-from) / 0.8))`,
            }}
          >
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute top-4 left-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm z-20"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
            {compareDate ? (
              <div className="absolute right-[100px] top-4 bg-black rounded-2xl px-3 py-2">
                <p className={`text-white  text-[10px]`}>{compareDate}</p>
              </div>
            ) : (
              ""
            )}

            <h2
              className="text-xl sm:text-2xl lg:text-3xl  font-bold text-white"
              style={{
                marginTop: isMobile ? "60px" : "40px",
                textAlign: "center",
              }}
            >
              {title}
            </h2>
            <div
              className={`container mx-auto flex items-center justify-between px-4 md:px-8 ${
                isMobile ? "flex-col space-y-4 " : ""
              }`}
              style={{
                paddingTop: "20px",
                paddingBottom: "50px",
              }}
            >
              {/* Left: Business Branding */}
              <div className={`flex items-center space-x-4`}>
                {logo ? (
                  <img
                    src={logo}
                    alt={t("publicReportDashboard.branding.businessLogoAlt")}
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
                    <MapPin
                      className={`text-gray-900 ${
                        isMobile ? "w-6 h-6" : "w-8 h-8"
                      }`}
                    />
                  </div>
                )}
                <div
                  className={`flex flex-col ${isMobile ? " space-y-1" : ""}`}
                >
                  <h1
                    className={`font-bold text-white ${
                      isMobile ? "text-base" : "text-2xl"
                    }`}
                  >
                    {listingName}
                  </h1>
                  <p
                    className={`text-white  ${
                      isMobile
                        ? "text-xs leading-tight max-w-[280px]"
                        : "text-sm"
                    }`}
                  >
                    {address}
                  </p>
                </div>
              </div>

              {/* Center: Report Title - Hidden on mobile as it's already in the header */}
              {!isMobile && <div className="flex-1 text-center"></div>}

              {/* Right: Report Date */}
              <div className="flex gap-4 items-center ">
                <div
                  className={` ${compareDate ? "min-w-56" : ""} ${
                    isMobile ? "text-center" : "text-right"
                  }`}
                >
                  <p className="text-sm text-white">
                    {t("publicReportDashboard.header.reportDate")}
                  </p>
                  <p
                    className={`text-white min-w-max ${
                      isMobile ? "text-base" : "text-lg"
                    }`}
                  >
                    {date}
                  </p>
                </div>
              </div>
            </div>
          </header>
          <div className="absolute right-12 top-2 px-3 py-2">
            <LanguageSwitcher reportId={token} />
          </div>

          {/* Main Content */}
          <main
            className="flex-1 overflow-auto relative z-40 "
            style={{
              marginTop: "-100px",
            }}
          >
            <div className={`container mx-auto p-2 md:p-4 lg:p-8`}>
              {children}
            </div>
          </main>

          {/* CTA Section */}
          {!allEmptyExceptLogo && (
            <section
              className="relative overflow-hidden"
              style={{ backgroundColor: "#1e293b" }}
            >
              <div
                className={`container mx-auto ${
                  isMobile ? "px-4 py-12" : "px-6 py-20"
                }`}
              >
                <div className="grid grid-cols-1 gap-12 items-center">
                  {/* Left Content */}
                  <div className="text-white">
                    {/* Company Branding Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex justify-between flex-col gap-8 lg:flex-row lg:gap-6">
                      <div
                        className={`flex items-center flex-col gap-2 sm:flex-row sm:gap-0  ${
                          isMobile ? "space-x-4" : "space-x-4"
                        }`}
                      >
                        {branding?.company_logo ? (
                          <img
                            src={branding?.company_logo}
                            alt={t(
                              "publicReportDashboard.branding.companyLogoAlt"
                            )}
                            className="w-20 h-20 rounded-lg object-cover bg-white"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                              {branding?.company_name?.charAt(0) ||
                                t(
                                  "publicReportDashboard.branding.companyInitial"
                                )}
                            </span>
                          </div>
                        )}
                        <div className={isMobile ? "text-center" : ""}>
                          <h3 className="text-2xl font-semibold text-white mb-2">
                            {branding?.company_name}
                          </h3>
                          {/* <p className="text-white/80 text-sm">
                          Digital Marketing Solutions
                        </p> */}
                          <div className="text-white/90">
                            {/* <span className="text-white/70">Website: </span> */}
                            {branding?.company_website}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`grid gap-2 text-sm  grid-cols-1`}
                        style={{ maxWidth: 600 }}
                      >
                        <div className="text-white/90">
                          <span className="text-white/70">
                            {t("publicReportDashboard.branding.email")}:{" "}
                          </span>
                          {branding?.company_email}
                        </div>
                        <div className="text-white/90">
                          <span className="text-white/70">
                            {t("publicReportDashboard.branding.phone")}:{" "}
                          </span>
                          {branding?.company_phone}
                        </div>

                        <div className="text-white/90 break-all">
                          <span className="text-white/70">
                            {t("publicReportDashboard.branding.address")}:{" "}
                          </span>
                          {branding?.company_address}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
              </div>
            </section>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};
