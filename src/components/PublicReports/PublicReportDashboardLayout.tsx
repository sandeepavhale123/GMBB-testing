import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Star,
  MapPin,
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
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data: brandingData, isLoading } = usePerformanceBrandingReport(token);
  const branding = brandingData?.data || null;
  const { lightLogo } = useThemeLogo();

  const allSidebarItems = [
    {
      id: "gmb-health",
      label: "GMB Health",
      name: "gmb-health",
      icon: Heart,
      path: `/gmb-health/${token}`,
    },
    {
      id: "insights",
      label: "Business Insights",
      name: "gmb-insight",
      icon: BarChart3,
      path: `/gmb-insight/${token}`,
    },
    {
      id: "reviews",
      label: "Reviews",
      name: "gmb-review",
      icon: Star,
      path: `/gmb-review/${token}`,
    },
    {
      id: "posts",
      label: "Post Performance",
      name: "gmb-post",
      icon: FileText,
      path: `/gmb-post/${token}`,
    },
    {
      id: "media",
      label: "Media Performance",
      name: "gmb-media",
      icon: Image,
      path: `/gmb-media/${token}`,
    },
    {
      id: "geo-ranking",
      label: "GEO Ranking",
      name: "gmb-ranking",
      icon: MapPin,
      path: `/gmb-ranking/${token}`,
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
          fixed left-0 top-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-100 shadow-sm z-50 flex flex-col items-center py-8 px-2 transition-transform duration-300
          ${isMobile ? "w-24" : "w-24"}
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
        `}
        >
          {/* Favicon at Top */}
          <div className="mb-8">
            {/* <img
              src="/lovable-uploads/f6f982ce-daf2-42fe-bff3-b78a0c684308.png"
              alt="Favicon"
              className="w-12 h-12 rounded-xl shadow-lg object-cover"
            /> */}
            {branding?.company_logo ? (
              <img
                src={branding?.company_logo}
                alt="Company Logo"
                className="w-12 h-12 rounded-xl shadow-lg object-cover"
              />
            ) : (
              <img
                src={lightLogo}
                alt="Default Logo"
                className="w-12 h-12 rounded-xl shadow-lg object-cover"
              />
            )}
          </div>

          {/* Navigation Icons - Only show visible sections */}
          <div className="flex flex-col items-center space-y-6 flex-1 justify-center">
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
                      className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                        isActive
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      <IconComponent className="h-10 w-10" />
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
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isMobile ? "ml-0" : "ml-24"
          }`}
        >
          {/* Dark Header */}
          <header 
            className="text-white h-[350px] z-10 relative sm:h-[250px]"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary-gradient-from)), hsl(var(--primary-gradient-via)), hsl(var(--primary-gradient-from) / 0.8))`
            }}
          >
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute top-4 left-4 p-2 bg-white/20 rounded-lg backdrop-blur-sm z-20"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            )}

            <h2
              className="text-3xl font-bold text-white"
              style={{
                marginTop: isMobile ? "60px" : "30px",
                textAlign: "center",
              }}
            >
              {title}
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
                {logo ? (
                  <img
                    src={logo}
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
                      {listingName?.charAt(0) || "B"}
                    </span>
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
                    className={`text-gray-300  ${
                      isMobile
                        ? "text-xs leading-tight max-w-[280px]"
                        : "text-lg"
                    }`}
                  >
                    {address}
                  </p>
                </div>
              </div>

              {/* Center: Report Title - Hidden on mobile as it's already in the header */}
              {!isMobile && <div className="flex-1 text-center"></div>}

              {/* Right: Report Date */}
              <div className={`${isMobile ? "text-center" : "text-right"}`}>
                <p className="text-sm text-gray-400">Report Date</p>
                <p
                  className={`text-white ${isMobile ? "text-base" : "text-lg"}`}
                >
                  {date}
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main
            className="flex-1 overflow-auto relative z-40"
            style={{
              marginTop: "-100px",
            }}
          >
            <div className={`container mx-auto ${isMobile ? "p-4" : "p-8"}`}>
              {children}
            </div>
          </main>

          {/* CTA Section */}
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
                      className={`flex items-center ${
                        isMobile ? "space-x-4" : "space-x-4"
                      }`}
                    >
                      {branding?.company_logo ? (
                        <img
                          src={branding?.company_logo}
                          alt="Company Logo"
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {branding?.company_name?.charAt(0) || "C"}
                          </span>
                        </div>
                      )}
                      <div className={isMobile ? "text-center" : ""}>
                        <h3 className="text-1xl font-semibold text-white mb-2">
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

                    <div className={`grid gap-2 text-sm  grid-cols-1`}>
                      <div className="text-white/90">
                        <span className="text-white/70">Email: </span>
                        {branding?.company_email}
                      </div>
                      <div className="text-white/90">
                        <span className="text-white/70">Phone: </span>
                        {branding?.company_phone}
                      </div>

                      <div className="text-white/90 break-all">
                        <span className="text-white/70">Address: </span>
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
        </div>
      </div>
    </TooltipProvider>
  );
};
