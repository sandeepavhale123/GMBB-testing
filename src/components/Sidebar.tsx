import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  FileText,
  Image,
  BarChart3,
  MapPin,
  Star,
  Building,
  Settings,
  Crown,
  Sparkles,
  MessageCircleQuestion,
  FileBarChart,
  Bot,
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { isSubscriptionExpired } from "@/utils/subscriptionUtil";
import { useAppSelector } from "../hooks/useRedux";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    path: "/location-dashboard",
  },
  {
    id: "posts",
    label: "Posts",
    icon: FileText,
    path: "/posts",
  },
  {
    id: "media",
    label: "Media",
    icon: Image,
    path: "/media",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: Star,
    path: "/reviews",
  },
  {
    id: "insights",
    label: "Insights",
    icon: BarChart3,
    path: "/insights",
  },
  {
    id: "qa",
    label: "Q&A",
    icon: MessageCircleQuestion,
    path: "/qa",
  },
  {
    id: "businesses",
    label: "Management",
    icon: Building,
    path: "/business-info",
  },
  {
    id: "geo-ranking",
    label: "GEO Ranking",
    icon: MapPin,
    path: "/geo-ranking",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileBarChart,
    path: "/reports",
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listingId } = useParams();
  const { profileData } = useProfile();
  const { dark_logo_url, favicon_url, dark_logo, favicon } = useAppSelector(
    (state) => state.theme
  );

  // console.log("user", profileData);
  const isAdmin = profileData?.role?.toLowerCase() === "admin";

  // Helper function to check if user role should be restricted
  const shouldHideForRole = () => {
    const userRole = profileData?.role?.toLowerCase();
    return userRole === "staff" || userRole === "client";
  };

  // Get user info from profile data
  const userName = profileData
    ? `${profileData.first_name} ${profileData.last_name}`
    : "User";
  const userEmail = profileData?.username || "user@example.com";
  const userInitials = profileData
    ? `${profileData.first_name?.charAt(0) || ""}${
        profileData.last_name?.charAt(0) || ""
      }`
    : "U";
  const userProfilePic =
    profileData?.profilePic ||
    "/lovable-uploads/e82c6af8-dd5a-48b6-bc12-9663e5ab24eb.png";
  const planExpDate = profileData?.planExpDate || null;

  // Check if plan is expired using the subscription utility
  const isPlanExpired = isSubscriptionExpired(planExpDate);
  const isEnterprisePlan =
    profileData?.planName?.toLowerCase() === "enterprise";
  // console.log("plan exp or not .....", isPlanExpired);
  // console.log("is enterprise plan .....", isEnterprisePlan);
  // console.log(
  //   "result of condition",
  //   !isPlanExpired && !collapsed && !isEnterprisePlan
  // );
  // Determine active tab based on current path
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/");
    const baseRoute = pathParts[1];

    // Handle business-info route mapping to businesses tab
    if (baseRoute === "business-info") {
      return "businesses";
    }

    const activeItem = menuItems.find((item) => item.path === `/${baseRoute}`);
    return activeItem ? activeItem.id : "overview";
  };

  const activeTab = getActiveTab();

  // Get logo URLs with fallbacks - prioritize uploaded files over API URLs
  const getDarkLogoUrl = () => {
    // If a new dark logo file has been uploaded, use it immediately
    if (dark_logo) {
      return URL.createObjectURL(dark_logo);
    }
    // Otherwise use the API URL or fallback
    return (
      dark_logo_url ||
      "/lovable-uploads/1dbac215-c555-4005-aa94-73183e291d0e.png"
    );
  };

  const getFaviconUrl = () => {
    // If a new favicon file has been uploaded, use it immediately
    if (favicon) {
      return URL.createObjectURL(favicon);
    }
    // Otherwise use the API URL or fallback
    return (
      favicon_url || "/lovable-uploads/f6f982ce-daf2-42fe-bff3-b78a0c684308.png"
    );
  };

  const handleTabChange = (tab: string, basePath: string) => {
    // For routes that need listing context, append the listing ID
    const listingRoutes = [
      "/location-dashboard",
      "/ai-tasks",
      "/posts",
      "/media",
      "/insights",
      "/geo-ranking",
      "/ai-chatbot",
      "/reviews",
      "/qa",
      "/reports",
      "/business-info",
    ];

    if (listingRoutes.includes(basePath) && listingId) {
      navigate(`${basePath}/${listingId}`);
    } else if (listingRoutes.includes(basePath)) {
      // If no listing ID available, navigate to default
      navigate(`${basePath}/default`);
    } else {
      // For non-listing routes (settings), navigate normally
      navigate(basePath);
    }
  };

  React.useEffect(() => {
    if (isAdmin) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://client.crisp.chat/l.js";
      document.head.appendChild(script);

      (window as any).$crisp = [];
      (window as any).CRISP_WEBSITE_ID = "0a5a5d0b-5517-45e0-be41-6bbe43d41696";

      (window as any).CRISP_READY_TRIGGER = function () {
        const visitorEmail = (window as any).$crisp?.get("user:email");
        if (!visitorEmail) {
          (window as any).$crisp.push(["set", "user:email", profileData?.username]);
        }
      };

      return () => {
        // Cleanup: Remove Crisp script and globals when component unmounts
        document.head.removeChild(script);
        delete (window as any).$crisp;
        delete (window as any).CRISP_WEBSITE_ID;
        delete (window as any).CRISP_READY_TRIGGER;
      };
    }
  }, [isAdmin, profileData?.username]);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out border-r",
        collapsed ? "w-16" : "w-64"
      )}
      style={{
        backgroundColor: "var(--sidebar-bg, #111827)",
        borderColor: "var(--sidebar-border, #374151)",
      }}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div
          className="flex h-20 items-center justify-between border-b px-4"
          style={{
            borderColor: "var(--sidebar-border, #374151)",
            height: "107px",
          }}
        >
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <img
                src={getDarkLogoUrl()}
                alt="GMB Genie Logo"
                className=" w-auto object-contain"
                style={{ height: "60px", maxWidth: "220px" }}
              />
            </div>
          ) : (
            <img
              src={getFaviconUrl()}
              alt="GMB Genie Logo"
              className="w-8 h-8 object-contain"
            />
          )}
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {menuItems
              .filter(
                (item) => !(item.id === "settings" && shouldHideForRole())
              )
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-10",
                      collapsed ? "px-2 justify-center" : "px-3"
                    )}
                    style={{
                      backgroundColor: isActive
                        ? "var(--sidebar-active-bg, #2563eb)"
                        : "transparent",
                      color: isActive
                        ? "var(--sidebar-active-text, #ffffff)"
                        : "var(--sidebar-text, #d1d5db)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor =
                          "var(--sidebar-hover-bg, #374151)";
                        e.currentTarget.style.color =
                          "var(--sidebar-hover-text, #ffffff)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color =
                          "var(--sidebar-text, #d1d5db)";
                      }
                    }}
                    onClick={() => handleTabChange(item.id, item.path)}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Button>
                );
              })}
          </nav>
        </ScrollArea>

        {/* Upgrade Plan Card - Show if no plan date or plan is expired and not enterprise plan */}
        {!isPlanExpired &&
          !collapsed &&
          !isEnterprisePlan &&
          !shouldHideForRole() && (
            <div className="px-3 pb-4">
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm font-semibold text-white">
                      {isPlanExpired ? "Plan Expired" : "Upgrade Plan"}
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 mb-3">
                    {isPlanExpired
                      ? "Your plan has expired. Renew to continue accessing features"
                      : "Unlock premium features and get unlimited access"}
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 text-xs font-medium"
                    onClick={() => navigate("/settings/subscription")}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {isPlanExpired ? "Renew Now" : "Upgrade Now"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

        {/* User Profile Section */}
        <div
          className="border-t p-4"
          style={{ borderColor: "var(--sidebar-border, #374151)" }}
        >
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-12",
              collapsed ? "px-2 justify-center" : "px-3"
            )}
            style={{
              color: "var(--sidebar-text, #d1d5db)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--sidebar-hover-bg, #374151)";
              e.currentTarget.style.color =
                "var(--sidebar-hover-text, #ffffff)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--sidebar-text, #d1d5db)";
            }}
            onClick={() => navigate("/profile")}
            title={collapsed ? userName : undefined}
          >
            <Avatar className={cn("w-8 h-8", collapsed ? "mx-auto" : "mr-3")}>
              <AvatarImage src={userProfilePic} />
              <AvatarFallback className="bg-gray-600 text-gray-200 text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{userName}</p>
                <p className="text-xs text-gray-400">
                  {userEmail.length > 20
                    ? userEmail.slice(0, 19) + "..."
                    : userEmail}
                </p>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
