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
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { isSubscriptionExpired } from "@/utils/subscriptionUtil";

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
    id: "insights",
    label: "Insights",
    icon: BarChart3,
    path: "/insights",
  },
  {
    id: "geo-ranking",
    label: "GEO Ranking",
    icon: MapPin,
    path: "/geo-ranking",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: Star,
    path: "/reviews",
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
  const userProfilePic = profileData?.profilePic || "/lovable-uploads/e82c6af8-dd5a-48b6-bc12-9663e5ab24eb.png";
  const planExpDate = profileData?.planExpDate || null;

  // Check if plan is expired using the subscription utility
  const isPlanExpired = isSubscriptionExpired(planExpDate);

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

  const handleTabChange = (tab: string, basePath: string) => {
    // For routes that need listing context, append the listing ID
    const listingRoutes = [
      "/location-dashboard",
      "/posts",
      "/media",
      "/insights",
      "/geo-ranking",
      "/reviews",
      "/qa",
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

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/1dbac215-c555-4005-aa94-73183e291d0e.png"
                alt="GMB Genie Logo"
                className="h-15 object-contain"
              />
            </div>
          ) : (
            <img
              src="/lovable-uploads/f6f982ce-daf2-42fe-bff3-b78a0c684308.png"
              alt="GMB Genie Logo"
              className="w-8 h-8 object-contain"
            />
          )}
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10",
                    collapsed ? "px-2 justify-center" : "px-3",
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
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

        {/* Upgrade Plan Card - Show if no plan date or plan is expired */}
        {(!planExpDate || isPlanExpired) && !collapsed && (
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
        <div className="border-t border-gray-800 p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-12 text-gray-300 hover:bg-gray-800 hover:text-white",
              collapsed ? "px-2 justify-center" : "px-3"
            )}
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
