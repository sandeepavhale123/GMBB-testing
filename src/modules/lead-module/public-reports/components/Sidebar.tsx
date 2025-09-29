import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart,
  BarChart3,
  BookOpen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  brandingData?: {
    company_logo?: string;
    company_name?: string;
  } | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  brandingData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const sidebarItems = [
    {
      id: "gmb-health",
      label: "GMB Health Report",
      name: "gbp",
      icon: Heart,
      path: "/lead/gbp",
    },
    {
      id: "gmb-prospect",
      label: "GMB Prospect Report",
      name: "prospect",
      icon: BarChart3,
      path: "/lead/prospect",
    },
    {
      id: "citation-audit",
      label: "Citation Audit Report",
      name: "citation",
      icon: BookOpen,
      path: "/lead/citation",
    },
  ];

  const getCurrentReportName = () => {
    const path = location.pathname;
    return sidebarItems.find((item) => path.includes(item.name))?.name || "";
  };

  const currentReportName = getCurrentReportName();

  return (
    <TooltipProvider>
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
        {/* Logo/Company Branding at Top */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          {brandingData?.company_logo ? (
            <img
              src={brandingData.company_logo}
              alt="Company Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg shadow-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary">
                {brandingData?.company_name?.charAt(0) || "L"}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Icons */}
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
    </TooltipProvider>
  );
};