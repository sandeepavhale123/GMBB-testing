import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/useProfile";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import {
  LayoutDashboard,
  Settings,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

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

  const shouldHideSettings = () => {
    const userRole = profileData?.role?.toLowerCase();
    return userRole === "staff" || userRole === "client";
  };

  const navItems = [
    {
      label: "Sample Page",
      path: "/main-dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t("settings"),
      path: "/main-dashboard/settings",
      icon: Settings,
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
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white lg:hidden">
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
