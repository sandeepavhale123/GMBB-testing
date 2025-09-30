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
} from "lucide-react";
export const SubNavbar: React.FC = () => {
  const { t } = useI18nNamespace("MultidashboardComponent/subNavbar");
  const theme = useAppSelector((state) => state.theme);
  const isMobile = useIsMobile(768);
  const { profileData, isLoading } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const shouldHideSubNavbar = () => {
    // Hide while loading to prevent flash
    if (isLoading) return true;

    const userRole = profileData?.role?.toLowerCase();
    return userRole === "staff" || userRole === "client";
  };

  // Hide entire SubNavbar for staff and client users
  if (shouldHideSubNavbar()) {
    return null;
  }

  // Show custom back button header for bulk post details page
  if (location.pathname.includes("/bulk-post-details/")) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/bulk-post")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for bulk media details page
  if (location.pathname.includes("/bulk-media-details/")) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/bulk-media")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for bulk auto reply project details page
  if (location.pathname.includes("/bulk-auto-reply-project-details/")) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/bulk-auto-reply")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for bulk auto reply page
  if (location.pathname.includes("/bulk-auto-reply")) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/bulk-review")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for generate bulk report page
  if (location.pathname.includes("/generate-bulk-report")) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/reports")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for bulk report details page
  if (location.pathname.includes("/bulk-report-details/")) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/reports")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for import-post-csv page
  if (location.pathname === "/main-dashboard/import-post-csv") {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/bulk-post")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for import-post-csv-wizard page
  if (location.pathname === "/main-dashboard/import-post-csv-wizard") {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/import-post-csv")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for bulk import details page
  if (location.pathname.includes("/bulk-import-details/")) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard/import-post-csv")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Show custom back button header for profile page
  if (location.pathname.includes("/profile")) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-start py-3">
            <button
              onClick={() => navigate("/main-dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </button>
          </div>
        </div>
      </nav>
    );
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
    },
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
      label: t("reports"),
      path: "/main-dashboard/reports",
      icon: BarChart3,
    },
    {
      label: "Gallery",
      path: "/main-dashboard/gallery",
      icon: Images,
    },
    {
      label: t("settings"),
      path: "/main-dashboard/settings",
      icon: Settings,
    },
  ].filter((item) => {
    if (item.label === "Settings" && shouldHideSettings()) {
      return false;
    }
    return true;
  });

  return (
    <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: Toggle Button + Dropdown Menu */}
        {isMobile ? (
          <>
            <div className="flex items-center justify-end py-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-t border-border shadow-lg z-50 animate-fade-in">
                <div className="max-w-7xl mx-auto px-4 py-2">
                  <div className="grid grid-cols-1 gap-1">
                    {navItems.map((item, index) => {
                      const Icon = item.icon;
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
                </div>
              </div>
            )}
          </>
        ) : (
          /* Desktop: Horizontal Layout */
          <div className="flex items-center justify-center md:justify-end gap-1 md:gap-6">
            {navItems.map((item, index) => {
              const Icon = item.icon;
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
        )}
      </div>
    </nav>
  );
};
