import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/useProfile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import {
  LayoutDashboard,
  FileText,
  Images,
  Star,
  BarChart3,
  Settings,
  ArrowLeft,
  Menu,
  X,
  FolderOpen,
  ChevronDown,
  Layers,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Reusable BackButton Component
const BackButton: React.FC<{
  onClick: () => void;
  label: string;
}> = ({ onClick, label }) => (
  <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-start py-3">
        <button
          onClick={onClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {label}
        </button>
      </div>
    </div>
  </nav>
);

export const SubNavbar: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardComponent/subNavbar");
  const theme = useAppSelector((state) => state.theme);
  const isMobile = useIsMobile(768);
  const { profileData, isLoading } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shouldHideSubNavbar = () => {
    if (isLoading) return true;
    const userRole = profileData?.role?.toLowerCase();
    return userRole === "staff" || userRole === "client";
  };

  if (shouldHideSubNavbar()) {
    return null;
  }

  // Back button route configuration
const backButtonRoutes: Record<string, string> = {
  "/bulk-post-details/": "/main-dashboard/bulk-post",
  "/bulk-media-details/": "/main-dashboard/bulk-media",
  "/bulk-auto-reply-project-details/": "/main-dashboard/bulk-auto-reply",
  "/bulk-auto-reply": "/main-dashboard/bulk-review",
  "/generate-bulk-report": "/main-dashboard/reports",
  "/bulk-report-details/": "/main-dashboard/reports",
  "/import-post-csv": "/main-dashboard/bulk-post",
  "/import-post-csv-wizard": "/main-dashboard/import-post-csv",
  "/bulk-import-details/": "/main-dashboard/import-post-csv",
  // "/bulk-map-ranking": "/main-dashboard",
  "/check-bulk-map-ranking": "/main-dashboard/bulk-map-ranking",
  "/view-bulk-map-ranking/": "/main-dashboard/bulk-map-ranking",
};

  const currentPath = location.pathname;

  // Special handling for profile page
  if (currentPath.includes("/profile")) {
    return (
      <BackButton
        onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate("/main-dashboard");
          }
        }}
        label={t("back")}
      />
    );
  }

  // Check all other back button routes
  for (const [route, backPath] of Object.entries(backButtonRoutes)) {
    if (currentPath.includes(route) || currentPath === route) {
      return <BackButton onClick={() => navigate(backPath)} label={t("back")} />;
    }
  }

  const shouldHideSettings = () => {
    const userRole = profileData?.role?.toLowerCase();
    return userRole === "staff" || userRole === "client";
  };

  const navItems = [
    {
      label: t("dashboard"),
      path: "/main-dashboard",
      icon: LayoutDashboard,
      type: "link",
    },
    {
      label: "Bulk Action",
      icon: Layers,
      type: "dropdown",
      children: [
        {
          label: t("bulkPosts"),
          path: "/main-dashboard/bulk-post",
          icon: FileText,
        },
        {
          label: t("bulkMedia"),
          path: "/main-dashboard/bulk-media",
          icon: FolderOpen,
        },
        {
          label: t("bulkReview"),
          path: "/main-dashboard/bulk-review",
          icon: Star,
        },
        {
          label: "Bulk Map Ranking",
          path: "/main-dashboard/bulk-map-ranking",
          icon: MapPin,
        },
      ],
    },
    {
      label: t("reports"),
      path: "/main-dashboard/reports",
      icon: BarChart3,
      type: "link",
    },
    {
      label: t("gallery"),
      path: "/main-dashboard/gallery",
      icon: Images,
      type: "link",
    },
    {
      label: t("settings"),
      path: "/main-dashboard/settings",
      icon: Settings,
      type: "link",
    },
  ].filter((item) => {
    if (item.label === t("settings") && shouldHideSettings()) {
      return false;
    }
    return true;
  });

  return (
    <>
      {/* Mobile menu */}
      <nav className="fixed top-[65px] left-0 right-0 z-50 w-full px-4 pt-1 pb-0 border-b border-border bg-white lg:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-3">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="pb-4 space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;

                if (item.type === "dropdown" && item.children) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                                  isActive
                                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`
                              }
                            >
                              <ChildIcon className="h-4 w-4" />
                              <span>{child.label}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={index === 0}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md ${
                        isActive
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Desktop menu */}
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white hidden lg:block">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end overflow-x-auto scrollbar-hide">
            {navItems.map((item, index) => {
              const Icon = item.icon;

              if (item.type === "dropdown" && item.children) {
                const isAnyChildActive = item.children.some(
                  (child) => location.pathname === child.path
                );

                return (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`px-4 py-3 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                          isAnyChildActive
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <DropdownMenuItem key={child.path} asChild>
                            <NavLink
                              to={child.path}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <ChildIcon className="h-4 w-4" />
                              {child.label}
                            </NavLink>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={index === 0}
                  className={({ isActive }) =>
                    `px-4 py-3 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
