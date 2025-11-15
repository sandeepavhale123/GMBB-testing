import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, History, Settings } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const SubNavBar: React.FC = () => {
  const { t } = useI18nNamespace("Laed-module-component/SubNavBar");
  const navItems = [
    {
      label: t("subNav.dashboard"),
      path: "/module/lead",
      icon: LayoutDashboard,
      type: "link",
    },
    {
      label: t("subNav.credits"),
      path: "/module/lead/credits",
      icon: History,
      type: "link",
    },
    {
      label: t("subNav.settings"),
      path: "/module/lead/settings",
      icon: Settings,
      type: "link",
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const lang = localStorage.getItem("i18nextLng");

  return (
    <nav
      className={`fixed left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white ${
        lang === "es" || lang === "de" || lang === "it" || lang === "fr"
          ? "top-[65px] md:top-[138px] lg:top-[65px]"
          : "top-[65px]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-end md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            // Special handling for Settings to include nested routes
            const isActive =
              item.path === "/module/lead/settings"
                ? location.pathname.startsWith("/module/lead/settings")
                : location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path!}
                className={cn(
                  "flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconComponent size={18} />
                <span className="hidden md:block whitespace-nowrap">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
