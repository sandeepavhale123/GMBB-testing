import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const SubNavBar: React.FC = () => {
  const { t } = useI18nNamespace(["social-poster-components/SubNavBar"]);
  const navItems = [
    {
      label: t("subnav.dashboard"),
      path: "/social-poster/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t("subnav.posts"),
      path: "/social-poster/posts",
      icon: FileText,
    },
    {
      label: t("subnav.accounts"),
      path: "/social-poster/accounts",
      icon: Users,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const lang = localStorage.getItem("i18nextLng");

  // Check if we're on the create post page
  const isCreatePostPage = location.pathname === "/social-poster/posts/create";
  const isEditPostPage =
    location.pathname.includes("/social-poster/posts/") &&
    location.pathname.includes("/edit");

  // Show back button for create/edit pages
  if (isCreatePostPage || isEditPostPage) {
    return (
      <nav
        className={`fixed left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white ${
          lang === "es" || lang === "de" || lang === "it" || lang === "fr"
            ? "top-[65px] md:top-[138px] lg:top-[65px]"
            : "top-[65px]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-start gap-4 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/social-poster/posts")}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={18} />
              <span>{t("subnav.back")}</span>
            </Button>
          </div>
        </div>
      </nav>
    );
  }

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
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
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
