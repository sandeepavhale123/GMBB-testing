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
  Images,
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
  BookOpen,
  ChevronDown,
  ChevronRight,
  Search,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { isSubscriptionExpired } from "@/utils/subscriptionUtil";
import { useAppSelector } from "../hooks/useRedux";
import { FaComments, FaQuestion } from "react-icons/fa";
import { useEffect, useState } from "react";
import { BiSupport } from "react-icons/bi";
import { X } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  sidebarOpen?: boolean;
  isTablet?: boolean;
  onNavigate?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string | null;
  subItems?: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  isMobile = false,
  sidebarOpen = false,
  isTablet = false,
  onNavigate,
}) => {
  const { t } = useI18nNamespace("Components/sidebar");

  const menuItems: MenuItem[] = [
    {
      id: "overview",
      label: t("sidebar.menu.overview"),
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "tracking",
      label: t("sidebar.menu.tracking"),
      icon: TrendingUp,
      path: null,
      subItems: [
        {
          id: "geo-ranking",
          label: t("sidebar.menu.geo-ranking"),
          icon: MapPin,
          path: "/geo-ranking",
        },
      ],
    },
    {
      id: "citation",
      label: t("sidebar.menu.citation"),
      icon: BookOpen,
      path: "/citation",
    },
    {
      id: "reports",
      label: t("sidebar.menu.reports"),
      icon: FileBarChart,
      path: null,
      subItems: [
        {
          id: "performance-report",
          label: t("sidebar.menu.performance-report"),
          icon: FileBarChart,
          path: "/reports",
        },
        {
          id: "bulk-report",
          label: t("sidebar.menu.bulk-report"),
          icon: FileBarChart,
          path: "/bulk-reports",
        },
      ],
    },
    {
      id: "settings",
      label: t("sidebar.menu.settings"),
      icon: Settings,
      path: "/settings",
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const { listingId } = useParams();
  const { profileData } = useProfile();
  const { dark_logo_url, favicon_url, dark_logo, favicon } = useAppSelector(
    (state) => state.theme
  );

  // State for managing expanded sub-menus
  const [expandedMenus, setExpandedMenus] = React.useState<Set<string>>(
    new Set()
  );

  const isAdmin = profileData?.role?.toLowerCase() === "admin";

  // Helper function to check if user role should be restricted
  const shouldHideForRole = () => {
    const userRole = profileData?.role?.toLowerCase();
    return userRole === "staff" || userRole === "client";
  };

  // Get user info from profile data
  const userName = profileData
    ? `${profileData.first_name} ${profileData.last_name}`
    : t("sidebar.profile.userFallback");
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

  const trialPlan =
    profileData?.planName?.toLowerCase() === "7$ for 7-day trial" ||
    profileData?.planName?.toLowerCase() === "trial" ||
    profileData?.planId === "50";

  // Toggle sub-menu expansion
  const toggleSubMenu = (menuId: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // Memoized function to determine active tab based on current path
  const activeTab = React.useMemo(() => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/");
    const baseRoute = pathParts[1];

    // Handle business-info route mapping to businesses tab
    if (baseRoute === "business-info") {
      return "businesses";
    }

    // Handle location-dashboard route mapping to overview tab
    if (baseRoute === "location-dashboard") {
      return "overview";
    }

    // Handle main-dashboard route mapping to main-dashboard tab
    if (baseRoute === "main-dashboard") {
      return "main-dashboard";
    }

    // Check main menu items first
    const activeItem = menuItems.find((item) => item.path === `/${baseRoute}`);
    if (activeItem) {
      return activeItem.id;
    }

    // Check sub-menu items
    for (const item of menuItems) {
      if (item.subItems && Array.isArray(item.subItems)) {
        const activeSubItem = item.subItems.find(
          (subItem) => subItem.path === `/${baseRoute}`
        );
        if (activeSubItem) {
          return activeSubItem.id;
        }
      }
    }

    // Don't return any active tab if no match is found
    // This prevents Dashboard from being highlighted on unrelated pages
    return "";
  }, [location.pathname]);

  // Effect to auto-expand parent menu when sub-item is active
  React.useEffect(() => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/");
    const baseRoute = pathParts[1];

    // Find if current route is a sub-menu item and expand its parent
    for (const item of menuItems) {
      if (item.subItems) {
        const activeSubItem = item.subItems.find(
          (subItem) => subItem.path === `/${baseRoute}`
        );
        if (activeSubItem) {
          setExpandedMenus((prev) => new Set(prev).add(item.id));
          break;
        }
      }
    }
  }, [location.pathname]);

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
    if (isPlanExpired) {
      if (shouldHideForRole()) {
        navigate("/plan-expired");
        return;
      } else {
        navigate("/settings/subscription");
        return;
      }
    }
    // For routes that need listing context, append the listing ID
    const listingRoutes = [
      "/location-dashboard",
      "/ai-tasks",
      "/posts",
      "/media",
      "/gallery",
      "/insights",
      "/keywords",
      "/geo-ranking",
      "/ai-chatbot",
      "/reviews",
      "/qa",
      "/reports",
      "/bulk-reports",
      "/generate-bulk-reports",
      "/view-bulk-reports",
      "/business-info",
      "/citation",
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

    // Call onNavigate callback if provided (for mobile menu close)
    onNavigate?.();
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
          (window as any).$crisp.push([
            "set",
            "user:email",
            profileData?.username,
          ]);
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
    <>
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out border-r",
          // Mobile behavior (phones) - overlay from left
          isMobile &&
            (sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"),
          // Tablet behavior - persistent like desktop but responsive
          isTablet && (collapsed ? "w-16" : "w-64"),
          // Desktop behavior
          !isMobile && !isTablet && (collapsed ? "w-16" : "w-64"),
          // Higher z-index for mobile overlay only
          isMobile && "z-50"
        )}
        style={{
          backgroundColor: "var(--sidebar-bg, #111827)",
          borderColor: "var(--sidebar-border, #374151)",
        }}
      >
        <div className="flex h-full flex-col max-h-screen">
          {/* Logo Section */}
          <div
            className="flex h-20 items-center justify-between border-b px-4"
            style={{
              borderColor: "#0000001c",
              height: "107px",
            }}
          >
            {!(collapsed && !isMobile && !isTablet) ? (
              <div className="flex items-center space-x-2">
                <img
                  src={getDarkLogoUrl()}
                  alt="GMB Genie Logo"
                  className=" w-auto object-contain"
                  style={{
                    height: "60px",
                    maxWidth: "220px",
                  }}
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
          <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-4 pt-0">
            <ScrollArea className="px-0 py-4 ">
              <nav className="space-y-2">
                {menuItems
                  .filter(
                    (item) => !(item.id === "settings" && shouldHideForRole())
                  )
                  .filter(
                    (item) =>
                      !(
                        item.id === "main-dashboard" &&
                        profileData?.dashboardType === 0
                      )
                  )
                  .filter(
                    (item) =>
                      !(
                        item.id === "settings" &&
                        profileData?.dashboardType === 1
                      )
                  )
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const hasSubItems =
                      item.subItems && item.subItems.length > 0;
                    const isExpanded = expandedMenus.has(item.id);
                    return (
                      <div key={item.id}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start h-10",
                            collapsed && !isMobile && !isTablet
                              ? "px-2 justify-center"
                              : "px-3"
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
                              e.currentTarget.style.color = "#ffffff";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color =
                                "var(--sidebar-text, #d1d5db)";
                            }
                          }}
                          onClick={() => {
                            if (hasSubItems) {
                              if (!(collapsed && !isMobile && !isTablet)) {
                                toggleSubMenu(item.id);
                              }
                            } else if (item.path) {
                              handleTabChange(item.id, item.path);
                            }
                          }}
                          title={
                            collapsed && !isMobile && !isTablet
                              ? item.label
                              : undefined
                          }
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              collapsed && !isMobile && !isTablet
                                ? "mx-auto"
                                : "mr-3"
                            )}
                          />
                          {!(collapsed && !isMobile && !isTablet) && (
                            <>
                              <span className="text-sm font-medium flex-1 text-left">
                                {item.label}
                              </span>
                              {hasSubItems && (
                                <div className="ml-2">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </Button>

                        {/* Sub-menu items */}
                        {hasSubItems &&
                          isExpanded &&
                          !(collapsed && !isMobile && !isTablet) && (
                            <div className="ml-4 mt-1 space-y-1">
                              {item.subItems?.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = activeTab === subItem.id;
                                return (
                                  <Button
                                    key={subItem.id}
                                    variant={isSubActive ? "default" : "ghost"}
                                    className="w-full justify-start h-8 text-xs pl-6"
                                    style={{
                                      backgroundColor: isSubActive
                                        ? "var(--sidebar-active-bg, #2563eb)"
                                        : "transparent",
                                      color: isSubActive
                                        ? "var(--sidebar-active-text, #ffffff)"
                                        : "var(--sidebar-text, #d1d5db)",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isSubActive) {
                                        e.currentTarget.style.backgroundColor =
                                          "var(--sidebar-hover-bg, #374151)";
                                        e.currentTarget.style.color = "#ffffff";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSubActive) {
                                        e.currentTarget.style.backgroundColor =
                                          "transparent";
                                        e.currentTarget.style.color =
                                          "var(--sidebar-text, #d1d5db)";
                                      }
                                    }}
                                    onClick={() =>
                                      handleTabChange(subItem.id, subItem.path)
                                    }
                                  >
                                    <SubIcon className="h-4 w-4 mr-2" />
                                    <span className="text-xs font-medium">
                                      {subItem.label}
                                    </span>
                                  </Button>
                                );
                              })}
                            </div>
                          )}
                      </div>
                    );
                  })}
              </nav>
            </ScrollArea>
          </div>

          {/* Upgrade Plan Card - Show if no plan date or plan is expired and not enterprise plan */}
          {!isPlanExpired &&
            !(collapsed && !isMobile && !isTablet) &&
            !isEnterprisePlan &&
            !shouldHideForRole() &&
            trialPlan && (
              <div className="px-3 pb-4">
                <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-semibold text-white">
                        {isPlanExpired
                          ? t("sidebar.upgradeCard.title.planExpired")
                          : t("sidebar.upgradeCard.title.upgradePlan")}
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 mb-3">
                      {isPlanExpired
                        ? t("sidebar.upgradeCard.description.planExpired")
                        : t("sidebar.upgradeCard.description.upgradePlan")}
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 text-xs font-medium"
                      onClick={() => navigate("/settings/subscription")}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      {isPlanExpired
                        ? t("sidebar.upgradeCard.button.renewNow")
                        : t("sidebar.upgradeCard.button.upgradeNow")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

          {/* User Profile Section */}
          <div
            className="border-t p-4 shrink-0"
            style={{
              borderColor: "#0000001c",
            }}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-12",
                collapsed && !isMobile && !isTablet
                  ? "px-2 justify-center"
                  : "px-3"
              )}
              style={{
                color: "var(--sidebar-text, #d1d5db)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--sidebar-hover-bg, #374151)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--sidebar-text, #d1d5db)";
              }}
              onClick={() => navigate("/profile")}
              title={collapsed && !isMobile && !isTablet ? userName : undefined}
            >
              <Avatar
                className={cn(
                  "w-8 h-8",
                  collapsed && !isMobile && !isTablet ? "mx-auto" : "mr-3"
                )}
              >
                <AvatarImage src={userProfilePic} alt="user-profile" />
                <AvatarFallback className="bg-gray-600 text-gray-200 text-sm font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {!(collapsed && !isMobile && !isTablet) && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-white">
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
    </>
  );
};
