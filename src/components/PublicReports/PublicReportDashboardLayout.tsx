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
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PublicReportDashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  companyName?: string;
  companyLogo?: string;
  onExport?: () => void;
  onShare?: () => void;
  visibleSections?: string[];
  address: string;
  token: string;
}

export const PublicReportDashboardLayout: React.FC<
  PublicReportDashboardLayoutProps
> = ({
  children,
  title,
  companyName = "Demo Business",
  companyLogo,
  onExport,
  onShare,
  visibleSections = [],
  address,
  token,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  console.log("visible section", visibleSections);
  console.log("sidebar items", sidebarItems);

  const getCurrentReportName = () => {
    const path = location.pathname;
    return sidebarItems.find((item) => path.includes(item.name))?.name || "";
  };

  const currentReportName = getCurrentReportName();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white flex">
        {/* Fixed Icon Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-24 bg-white/80 backdrop-blur-sm border-r border-gray-100 shadow-sm z-50 flex flex-col items-center py-8 px-2">
          {/* Favicon at Top */}
          <div className="mb-8">
            <img
              src="/lovable-uploads/f6f982ce-daf2-42fe-bff3-b78a0c684308.png"
              alt="Favicon"
              className="w-12 h-12 rounded-xl shadow-lg object-cover"
            />
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
                      onClick={() => navigate(item.path)}
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
        <div className="flex-1 ml-24 flex flex-col">
          {/* Dark Header */}
          <header className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white h-[250px] z-10">
            <h2
              className="text-3xl font-bold text-white"
              style={{
                marginTop: "30px",
                textAlign: "center",
              }}
            >
              {title}
            </h2>
            <div
              className="container mx-auto flex items-center justify-between px-8"
              style={{
                paddingTop: "20px",
                paddingBottom: "50px",
              }}
            >
              {/* Left: Business Branding */}
              <div className="flex items-center space-x-4">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt="Business Logo"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {companyName?.charAt(0) || "B"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">{companyName}</h1>
                  <p className="text-lg text-gray-300">{address}</p>
                </div>
              </div>

              {/* Center: Report Title */}
              <div className="flex-1 text-center"></div>

              {/* Right: Report Date */}
              <div className="text-right">
                <p className="text-sm text-gray-400">Report Date</p>
                <p className="text-lg text-white">
                  {new Date().toLocaleDateString()}
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
            <div className="container mx-auto p-8">{children}</div>
          </main>

          {/* CTA Section */}
          <section
            className="relative overflow-hidden"
            style={{ backgroundColor: "#1e293b" }}
          >
            <div className="container mx-auto px-6 py-20">
              <div className="grid grid-cols-1 gap-12 items-center">
                {/* Left Content */}
                <div className="text-white">
                  {/* Company Branding Card */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-4 mb-4">
                      {companyLogo ? (
                        <img
                          src={companyLogo}
                          alt="Company Logo"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {companyName?.charAt(0) || "C"}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {companyName}
                        </h3>
                        <p className="text-white/80 text-sm">
                          Digital Marketing Solutions
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="text-white/90">
                        <span className="text-white/70">Email: </span>
                        contact@
                        {companyName?.toLowerCase().replace(/\s+/g, "") ||
                          "company"}
                        .com
                      </div>
                      <div className="text-white/90">
                        <span className="text-white/70">Phone: </span>
                        (555) 123-4567
                      </div>
                      <div className="text-white/90">
                        <span className="text-white/70">Website: </span>
                        www.
                        {companyName?.toLowerCase().replace(/\s+/g, "") ||
                          "company"}
                        .com
                      </div>
                      <div className="text-white/90">
                        <span className="text-white/70">Address: </span>
                        123 Business Ave, Suite 100
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

          {/* Footer */}
          <footer className="bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between text-sm text-gray-500">
            <div>
              Created by{" "}
              <span className="font-medium text-gray-700">{companyName}</span>
            </div>
            <div className="flex items-center space-x-6">
              <button className="hover:text-gray-700 transition-colors">
                About
              </button>
              <button className="hover:text-gray-700 transition-colors">
                Support
              </button>
              <button className="hover:text-gray-700 transition-colors">
                Purchase
              </button>
            </div>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
};
