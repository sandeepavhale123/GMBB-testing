import React, { useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Settings, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AbSubNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/dashboard",
        matchPath: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Team",
        path: "/workspace/team",
        matchPath: "/workspace/team",
        icon: Users,
      },
      {
        label: "Settings",
        path: "/workspace/settings",
        matchPath: "/workspace/settings",
        icon: Settings,
      },
      {
        label: "Subscription",
        path: "/subscription",
        matchPath: "/subscription",
        icon: CreditCard,
      },
    ],
    []
  );

  // Check if we're on create/edit bot pages
  const isCreateBotPage = location.pathname === "/create";
  const isEditBotPage = location.pathname.startsWith("/edit/");
  const isBotDetailPage = location.pathname.startsWith("/detail/");
  const isSubPage = isCreateBotPage || isEditBotPage || isBotDetailPage;

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  // Show back button on create/edit pages
  if (isSubPage) {
    return (
      <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-4">
            <Button variant="ghost" onClick={handleBackClick} className="flex items-center gap-2">
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-end md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname.startsWith(item.matchPath);

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
                <span className="hidden md:block whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
