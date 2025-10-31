import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Send, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const navItems = [
  {
    label: "dashboard",
    path: "/module/reputation",
    icon: LayoutDashboard,
    type: "link",
  },
  {
    label: "review",
    path: "/module/reputation/review",
    icon: MessageSquare,
    type: "link",
  },
  {
    label: "request",
    path: "/module/reputation/request",
    icon: Send,
    type: "link",
  },
  {
    label: "setting",
    path: "/module/reputation/setting",
    icon: Settings,
    type: "link",
  },
];

export const SubNavBar: React.FC = () => {
  const { t } = useI18nNamespace("Reputation-module-component/SubNavBar");
  const location = useLocation();
  const navigate = useNavigate();

  // Show back button on create-campaign, create-template, edit-template, and review-link pages
  const isCreateCampaignPage = location.pathname === "/module/reputation/create-campaign";
  const isCreateTemplatePage = location.pathname === "/module/reputation/create-template";
  const isEditTemplatePage = location.pathname.startsWith("/module/reputation/edit-template");
  const isReviewLinkPage = location.pathname === "/module/reputation/review-link";
  const isCreatePage = isCreateCampaignPage || isCreateTemplatePage || isEditTemplatePage || isReviewLinkPage;

  const handleBackClick = () => {
    if (isCreateTemplatePage || isEditTemplatePage) {
      navigate("/module/reputation/request?tab=templates");
    } else {
      navigate("/module/reputation/request");
    }
  };

  if (isCreatePage) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-4">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              <span>{t("back")}</span>
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-end md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive =
              item.path === "/module/reputation/setting"
                ? location.pathname.startsWith("/module/reputation/setting")
                : location.pathname === item.path;

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
                  {t(`nav.${item.label}`, item.label)}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
